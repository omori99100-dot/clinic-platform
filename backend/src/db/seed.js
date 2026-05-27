import bcrypt from 'bcryptjs'
import pool from '../config/database.js'
import config from '../config/index.js'

async function seed() {
  const client = await pool.connect()
  try {
    const hash = await bcrypt.hash(config.admin.password, 12)
    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['مدير العيادة', config.admin.email, hash, 'admin'])

    console.log('Admin user seeded:', config.admin.email)
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
