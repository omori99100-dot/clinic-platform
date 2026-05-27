import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح').max(255),
  password: z.string().min(6, 'كلمة المرور قصيرة جداً').max(128),
})

export const bookingSchema = z.object({
  patient_name: z.string().min(2, 'الاسم قصير جداً').max(100),
  patient_phone: z.string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'رقم الهاتف غير صالح'),
  service: z.string().min(2, 'الخدمة مطلوبة').max(100),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تاريخ غير صالح'),
  booking_time: z.string().regex(/^\d{2}:\d{2}$/, 'وقت غير صالح'),
  notes: z.string().max(500).optional().default(''),
})

export const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'حالة غير صالحة' }),
  }),
})

export const analyticsSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const error = result.error.issues[0]?.message || 'بيانات غير صالحة'
      return res.status(400).json({ error })
    }
    req.validated = result.data
    next()
  }
}
