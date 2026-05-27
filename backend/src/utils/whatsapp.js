import config from '../config/index.js'

const MAX_RETRIES = 3

const messages = {
  booking_confirmation: (p) =>
    `مرحباً ${p.patient_name}، تم استلام حجزك في عيادة الدكتور أحمد شهاب. الخدمة: ${p.service}، التاريخ: ${p.booking_date}، الوقت: ${p.booking_time}. سيتم تأكيد الحجز قريباً.`,
  booking_confirmed: (p) =>
    `مرحباً ${p.patient_name}، تم تأكيد حجزك في عيادة الدكتور أحمد شهاب. الخدمة: ${p.service}، التاريخ: ${p.booking_date}، الوقت: ${p.booking_time}. يرجى الحضور قبل الموعد بـ 10 دقائق.`,
}

function normalizePhone(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  if (cleaned.startsWith('964')) return cleaned
  return `964${cleaned.replace(/^0+/, '')}`
}

async function attemptSend(to, text, attempt = 1) {
  const url = `https://graph.facebook.com/v21.0/${config.whatsapp.phoneNumberId}/messages`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${config.whatsapp.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhone(to),
        type: 'text',
        text: { body: text },
      }),
    })

    clearTimeout(timeout)
    return response.ok
  } catch (err) {
    clearTimeout(timeout)
    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt) * 1000
      await new Promise(r => setTimeout(r, delay))
      return attemptSend(to, text, attempt + 1)
    }
    return false
  }
}

export async function sendWhatsApp({ to, template, params }) {
  if (!config.whatsapp.phoneNumberId || !config.whatsapp.accessToken) {
    console.log('WhatsApp not configured — skipping message')
    return false
  }

  const templateFn = messages[template]
  if (!templateFn) return false

  const text = templateFn(params)
  const success = await attemptSend(to, text)
  console.log(`WhatsApp ${success ? 'sent' : 'FAILED'} to:`, to, 'template:', template)
  return success
}
