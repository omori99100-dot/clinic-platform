import { query } from '../config/database.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { secret } = req.body
  if (secret !== process.env.MIGRATION_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    await query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'doctor', 'staff')),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patient_name VARCHAR(100) NOT NULL,
        patient_phone VARCHAR(20) NOT NULL,
        service VARCHAR(100) NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        notes TEXT DEFAULT '',
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        whatsapp_sent BOOLEAN DEFAULT false,
        whatsapp_error TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique ON bookings(patient_phone, booking_date, booking_time) WHERE status != 'cancelled';
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(patient_phone);
      CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

      CREATE TABLE IF NOT EXISTS logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id UUID,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        details JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action);
      CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_logs_user ON logs(user_id);

      CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats AS
        SELECT booking_date, COUNT(*) AS total_bookings,
          COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed,
          COUNT(*) FILTER (WHERE status = 'completed') AS completed,
          COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
          COUNT(*) FILTER (WHERE status = 'pending') AS pending
        FROM bookings GROUP BY booking_date ORDER BY booking_date DESC;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(booking_date);

      CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
      DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
      CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
      DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
      CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    `)

    const bcrypt = require('bcryptjs')
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12)
    await query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
      ['Admin', process.env.ADMIN_EMAIL || 'admin@clinic.com', hash, 'admin']
    )

    res.json({ success: true, message: 'Migration and admin user created' })
  } catch (err) {
    console.error('Migration error:', err)
    res.status(500).json({ error: err.message })
  }
}
