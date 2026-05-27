import { query } from '../config/database.js'

export const User = {
  async findByEmail(email) {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    )
    return rows[0] || null
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT id, name, email, role, last_login, created_at FROM users WHERE id = $1',
      [id]
    )
    return rows[0] || null
  },

  async updateLastLogin(id) {
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [id]
    )
  },
}

export default User
