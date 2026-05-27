import { Pool } from 'pg'
import config from './index.js'

const isPooler = config.database.url?.includes('pooler.supabase.com')
const pool = new Pool({
  connectionString: config.database.url,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(isPooler ? {} : { statement_timeout: 10000 }),
})

pool.on('error', (err) => {
  console.error('Database pool error:', err.message)
})

export async function query(text, params) {
  try {
    const result = await pool.query(text, params)
    return result
  } catch (err) {
    if (err.code === '57P01' || err.code === '08006' || err.code === '08003') {
      console.error('DB connection lost, retrying once...')
      await new Promise(r => setTimeout(r, 1000))
      return await pool.query(text, params)
    }
    throw err
  }
}

export default pool
