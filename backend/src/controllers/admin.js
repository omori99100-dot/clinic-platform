import Booking from '../models/Booking.js'
import Log from '../models/Log.js'
import { sendWhatsApp } from '../utils/whatsapp.js'

export async function getBookings(req, res) {
  try {
    const { date, status, page, limit } = req.query
    const result = await Booking.findAll({ date, status, page: Number(page) || 1, limit: Number(limit) || 50 })
    res.json(result)
  } catch (err) {
    console.error('Get bookings error:', err)
    res.status(500).json({ error: 'حدث خطأ' })
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ error: 'الحجز غير موجود' })
    res.json({ booking })
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ' })
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'حالة غير صالحة' })
    }

    const booking = await Booking.updateStatus(req.params.id, status)
    if (!booking) return res.status(404).json({ error: 'الحجز غير موجود' })

    // Send WhatsApp on confirmation
    if (status === 'confirmed') {
      sendWhatsApp({
        to: booking.patient_phone,
        template: 'booking_confirmed',
        params: {
          patient_name: booking.patient_name,
          service: booking.service,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
        },
      }).then(success => {
        Booking.markWhatsappSent(booking.id, success ? null : 'API failed')
      }).catch(err => {
        Booking.markWhatsappSent(booking.id, err.message)
      })
    }

    await Log.create({
      action: 'booking_status_updated',
      entity_type: 'booking',
      entity_id: booking.id,
      user_id: req.user.id,
      details: { old_status: null, new_status: status },
      ip_address: req.ip,
    })

    res.json({ booking })
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ' })
  }
}

export async function deleteBooking(req, res) {
  try {
    const deleted = await Booking.delete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'الحجز غير موجود' })

    await Log.create({
      action: 'booking_deleted',
      entity_type: 'booking',
      entity_id: req.params.id,
      user_id: req.user.id,
      ip_address: req.ip,
    })

    res.json({ message: 'تم حذف الحجز' })
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ' })
  }
}

export async function getAnalytics(req, res) {
  try {
    const { start_date, end_date } = req.query
    const end = end_date || new Date().toISOString().split('T')[0]
    const start = start_date || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]

    Booking.refreshStats().catch(() => {})

    const stats = await Booking.getStats(start, end)

    const summary = stats.reduce((acc, row) => {
      acc.total += Number(row.total)
      acc.confirmed += Number(row.confirmed)
      acc.completed += Number(row.completed)
      acc.cancelled += Number(row.cancelled)
      acc.pending += Number(row.pending)
      return acc
    }, { total: 0, confirmed: 0, completed: 0, cancelled: 0, pending: 0 })

    res.json({ summary, daily: stats })
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ' })
  }
}
