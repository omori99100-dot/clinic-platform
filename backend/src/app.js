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
  origin: [config.cors.frontendUrl, 'https://clinic-site-sand-six.vercel.app', 'http://localhost:5173'],
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
