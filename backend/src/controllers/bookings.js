import Booking from '../models/Booking.js'
import Log from '../models/Log.js'
import { sendWhatsApp } from '../utils/whatsapp.js'

export async function createBooking(req, res) {
  try {
    const { patient_name, patient_phone, service, booking_date, booking_time, notes } = req.validated

    const duplicate = await Booking.checkDuplicate(patient_phone, booking_date, booking_time)
    if (duplicate) {
      return res.status(409).json({ error: 'لديك حجز بالفعل في هذا الموعد' })
    }

    const booking = await Booking.create({
      patient_name,
      patient_phone,
      service,
      booking_date,
      booking_time,
      notes,
    })

    // Non-blocking WhatsApp trigger
    sendWhatsApp({
      to: patient_phone,
      template: 'booking_confirmation',
      params: { patient_name, service, booking_date, booking_time },
    }).then(success => {
      Booking.markWhatsappSent(booking.id, success ? null : 'API failed')
    }).catch(err => {
      Booking.markWhatsappSent(booking.id, err.message)
    })

    Log.create({
      action: 'booking_created',
      entity_type: 'booking',
      entity_id: booking.id,
      details: { patient_name, patient_phone, service, booking_date },
      ip_address: req.ip,
    }).catch(() => {})

    res.status(201).json({ booking })
  } catch (err) {
    console.error('Create booking error:', err)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'هذا الموعد محجوز مسبقاً' })
    }
    res.status(500).json({ error: 'حدث خطأ في إنشاء الحجز' })
  }
}

export async function checkAvailability(req, res) {
  try {
    const { date } = req.query
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'التاريخ مطلوب (YYYY-MM-DD)' })
    }

    const bookings = await Booking.findByDate(date)
    const bookedTimes = bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => b.booking_time.slice(0, 5))

    res.json({ date, bookedTimes })
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ' })
  }
}
