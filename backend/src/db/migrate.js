import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.join(__dirname, 'migrations')

async function runMigrations() {
  const client = await pool.connect()
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      console.log(`Running migration: ${file}`)
      await client.query(sql)
      console.log(`Completed: ${file}`)
    }
    console.log('All migrations complete.')
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
