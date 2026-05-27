import app from './app.js'
import config from './config/index.js'
import pool from './config/database.js'

async function start() {
  try {
    await pool.query('SELECT 1')
    console.log('Database connected')
  } catch (err) {
    console.error('Database connection failed:', err.message)
    console.log('Server will start without DB — ensure DATABASE_URL is set')
  }

  app.listen(config.port, () => {
    console.log(`Clinic API running on port ${config.port} [${config.nodeEnv}]`)
  })
}

start()
