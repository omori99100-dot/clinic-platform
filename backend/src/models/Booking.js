import { createClient } from '@supabase/supabase-js'
import config from '../config/index.js'

const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false },
})

export const Booking = {
  async create(data) {
    const { data: inserted, error } = await supabase
      .from('bookings').insert({
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        service: data.service,
        booking_date: data.booking_date,
        booking_time: data.booking_time,
        notes: data.notes || '',
      }).select('*').maybeSingle()
    if (error) throw error
    return inserted
  },

  async findById(id) {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async findByDate(date) {
    const { data, error } = await supabase
      .from('bookings').select('*').eq('booking_date', date).order('booking_time', { ascending: true })
    if (error) throw error
    return data || []
  },

  async findAll({ date, status, page = 1, limit = 50 } = {}) {
    let q = supabase.from('bookings').select('*', { count: 'exact' })
    if (date) q = q.eq('booking_date', date)
    if (status) q = q.eq('status', status)
    q = q.order('booking_date', { ascending: false }).order('booking_time', { ascending: false })
    const from = (page - 1) * limit
    q = q.range(from, from + limit - 1)
    const { data, error, count } = await q
    if (error) throw error
    return {
      rows: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('bookings').update({ status }).eq('id', id).select('*').maybeSingle()
    if (error) throw error
    return data
  },

  async markWhatsappSent(id, errorVal = null) {
    const update = errorVal
      ? { whatsapp_sent: false, whatsapp_error: errorVal }
      : { whatsapp_sent: true, whatsapp_error: null }
    const { error } = await supabase.from('bookings').update(update).eq('id', id)
    if (error) throw error
  },

  async delete(id) {
    const { data, error } = await supabase.from('bookings').delete().eq('id', id).select('id').maybeSingle()
    if (error) throw error
    return data
  },

  async checkDuplicate(phone, date, time) {
    const { data, error } = await supabase
      .from('bookings').select('id').eq('patient_phone', phone).eq('booking_date', date)
      .eq('booking_time', time).neq('status', 'cancelled').limit(1)
    if (error) throw error
    return (data || []).length > 0
  },

  async getStats(startDate, endDate) {
    const { data, error } = await supabase.rpc('get_booking_stats', {
      start_date: startDate, end_date: endDate,
    })
    if (error) {
      const { data: fallback, error: fbError } = await supabase
        .from('bookings').select('booking_date, status')
        .gte('booking_date', startDate).lte('booking_date', endDate)
      if (fbError) throw fbError
      const map = {}
      for (const row of fallback || []) {
        if (!map[row.booking_date]) map[row.booking_date] = { booking_date: row.booking_date, total: 0, confirmed: 0, completed: 0, cancelled: 0, pending: 0 }
        map[row.booking_date].total++
        map[row.booking_date][row.status] = (map[row.booking_date][row.status] || 0) + 1
      }
      return Object.values(map).sort((a, b) => a.booking_date < b.booking_date ? -1 : 1)
    }
    return data || []
  },

  async refreshStats() {
    try {
      await supabase.rpc('refresh_booking_stats')
    } catch (e) {
      console.error('refreshStats failed:', e.message)
    }
  },
}

export default Booking
