import pool from '../config/database.js'

export const Log = {
  async create({ action, entity_type, entity_id, user_id, details, ip_address }) {
    const { rows } = await pool.query(`
      INSERT INTO logs (action, entity_type, entity_id, user_id, details, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [action, entity_type, entity_id, user_id, JSON.stringify(details || {}), ip_address])
    return rows[0].id
  },

  async findRecent(limit = 50) {
    const { rows } = await pool.query(`
      SELECT l.*, u.name AS user_name
      FROM logs l
      LEFT JOIN users u ON u.id = l.user_id
      ORDER BY l.created_at DESC
      LIMIT $1
    `, [limit])
    return rows
  },
}

export default Log
