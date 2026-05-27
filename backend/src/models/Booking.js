import { query } from '../config/database.js'

export const Booking = {
  async create(data) {
    const { rows } = await query(`
      INSERT INTO bookings (patient_name, patient_phone, service, booking_date, booking_time, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [data.patient_name, data.patient_phone, data.service, data.booking_date, data.booking_time, data.notes || ''])
    return rows[0]
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM bookings WHERE id = $1', [id])
    return rows[0] || null
  },

  async findByDate(date) {
    const { rows } = await query(
      'SELECT * FROM bookings WHERE booking_date = $1 ORDER BY booking_time ASC',
      [date]
    )
    return rows
  },

  async findAll({ date, status, page = 1, limit = 50 } = {}) {
    const conditions = []
    const params = []
    let paramIdx = 1

    if (date) {
      conditions.push(`booking_date = $${paramIdx++}`)
      params.push(date)
    }
    if (status) {
      conditions.push(`status = $${paramIdx++}`)
      params.push(status)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const offset = (page - 1) * limit

    const countResult = await query(`SELECT COUNT(*) FROM bookings ${where}`, params)
    const total = parseInt(countResult.rows[0].count, 10)

    const { rows } = await query(
      `SELECT * FROM bookings ${where} ORDER BY booking_date DESC, booking_time DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    )

    return { rows, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async updateStatus(id, status) {
    const { rows } = await query(`
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
    `, [status, id])
    return rows[0] || null
  },

  async markWhatsappSent(id, error = null) {
    if (error) {
      await query(
        'UPDATE bookings SET whatsapp_sent = false, whatsapp_error = $1 WHERE id = $2',
        [error, id]
      )
    } else {
      await query(
        'UPDATE bookings SET whatsapp_sent = true, whatsapp_error = NULL WHERE id = $1',
        [id]
      )
    }
  },

  async delete(id) {
    const { rows } = await query(
      'DELETE FROM bookings WHERE id = $1 RETURNING id',
      [id]
    )
    return rows[0] || null
  },

  async checkDuplicate(phone, date, time) {
    const { rows } = await query(`
      SELECT id FROM bookings
      WHERE patient_phone = $1 AND booking_date = $2 AND booking_time = $3 AND status != 'cancelled'
      LIMIT 1
    `, [phone, date, time])
    return rows.length > 0
  },

  async getStats(startDate, endDate) {
    const { rows } = await query(`
      SELECT
        booking_date,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending
      FROM bookings
      WHERE booking_date >= $1 AND booking_date <= $2
      GROUP BY booking_date
      ORDER BY booking_date ASC
    `, [startDate, endDate])
    return rows
  },
  },

  async refreshStats() {
    await query('REFRESH MATERIALIZED VIEW CONCURRENTLY daily_stats')
  },
}

export default Booking
