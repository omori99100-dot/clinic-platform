import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import config from './config/index.js'
import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import adminRoutes from './routes/admin.js'
import { apiLimiter } from './middleware/rateLimit.js'

const app = express()

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

// CORS
app.use(cors({
    origin: [config.cors.frontendUrl, 'https://frontend-sandy-omega-3vcyr9e45t.vercel.app', 'http://localhost:5173'],
  credentials: true,
}))

// Rate limiting
app.use('/api/', apiLimiter)

// Body parsing
app.use(express.json({ limit: '10kb' }))

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Temporary migration endpoint (remove after first run)
import { query } from './config/database.js'
app.post('/api/migrate', async (req, res) => {
  if (req.query.secret !== 'migrate-2026-go') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await query(`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','doctor','staff')), is_active BOOLEAN DEFAULT true, last_login TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)')
    await query(`CREATE TABLE IF NOT EXISTS bookings (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), patient_name VARCHAR(100) NOT NULL, patient_phone VARCHAR(20) NOT NULL, service VARCHAR(100) NOT NULL, booking_date DATE NOT NULL, booking_time TIME NOT NULL, notes TEXT DEFAULT '', status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')), whatsapp_sent BOOLEAN DEFAULT false, whatsapp_error TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
    await query("CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique ON bookings(patient_phone, booking_date, booking_time) WHERE status != 'cancelled'")
    await query('CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date)')
    await query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)')
    await query('CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(patient_phone)')
    await query('CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC)')
    await query(`CREATE TABLE IF NOT EXISTS logs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), action VARCHAR(100) NOT NULL, entity_type VARCHAR(50), entity_id UUID, user_id UUID REFERENCES users(id) ON DELETE SET NULL, details JSONB DEFAULT '{}', ip_address VARCHAR(45), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
    await query('CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action)')
    await query('CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at DESC)')
    await query('CREATE INDEX IF NOT EXISTS idx_logs_user ON logs(user_id)')
    await query(`CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats AS SELECT booking_date, COUNT(*) AS total_bookings, COUNT(*) FILTER (WHERE status='confirmed') AS confirmed, COUNT(*) FILTER (WHERE status='completed') AS completed, COUNT(*) FILTER (WHERE status='cancelled') AS cancelled, COUNT(*) FILTER (WHERE status='pending') AS pending FROM bookings GROUP BY booking_date ORDER BY booking_date DESC`)
    await query('CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(booking_date)')
    await query(`CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql`)
    await query('DROP TRIGGER IF EXISTS trg_users_updated_at ON users; CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at()')
    await query('DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings; CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at()')
    res.json({ success: true, step: 1, message: 'Tables created' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Create admin user (separate call in case bcrypt is slow)
app.post('/api/migrate/admin', async (req, res) => {
  if (req.query.secret !== 'migrate-2026-go') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const bcrypt = (await import('bcryptjs')).default
    const hash = await bcrypt.hash(config.admin.password, 12)
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Admin', config.admin.email, hash, 'admin']
    )
    res.json({ success: true, step: 2, message: 'Admin user created' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'حدث خطأ داخلي في الخادم' })
})

export default app
