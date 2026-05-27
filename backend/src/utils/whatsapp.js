// WhatsApp Cloud API integration
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
import config from '../config/index.js'

export async function sendWhatsApp({ to, template, params }) {
  if (!config.whatsapp.phoneNumberId || !config.whatsapp.accessToken) {
    console.log('WhatsApp not configured — skipping message')
    return false
  }

  const messages = {
    booking_confirmation: `مرحباً ${params.patient_name}، تم استلام حجزك في عيادة الدكتور أحمد شهاب. الخدمة: ${params.service}، التاريخ: ${params.booking_date}، الوقت: ${params.booking_time}. سيتم تأكيد الحجز قريباً.`,
    booking_confirmed: `مرحباً ${params.patient_name}، تم تأكيد حجزك في عيادة الدكتور أحمد شهاب. الخدمة: ${params.service}، التاريخ: ${params.booking_date}، الوقت: ${params.booking_time}. يرجى الحضور قبل الموعد بـ 10 دقائق.`,
  }

  const text = messages[template]
  if (!text) return false

  try {
    const url = `https://graph.facebook.com/v21.0/${config.whatsapp.phoneNumberId}/messages`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${config.whatsapp.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.startsWith('964') ? to : `964${to.replace(/^0+/, '')}`,
        type: 'text',
        text: { body: text },
      }),
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const err = await response.text()
      console.error('WhatsApp API error:', err)
      return false
    }

    console.log('WhatsApp sent to:', to, 'template:', template)
    return true
  } catch (err) {
    console.error('WhatsApp send failed:', err.message)
    return false
  }
}
