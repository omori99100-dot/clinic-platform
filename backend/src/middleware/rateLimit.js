import rateLimit from 'express-rate-limit'

const keyGenerator = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.ip
    || 'unknown'
}

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'طلبات كثيرة جداً، الرجاء المحاولة لاحقاً' },
})

export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'لقد تجاوزت الحد المسموح من الحجوزات، الرجاء المحاولة لاحقاً' },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'محاولات دخول كثيرة جداً' },
})
