import { Router } from 'express'
import { createBooking, checkAvailability } from '../controllers/bookings.js'
import { bookingLimiter } from '../middleware/rateLimit.js'
import { validate, bookingSchema } from '../middleware/validate.js'

const router = Router()

router.post('/', bookingLimiter, validate(bookingSchema), createBooking)
router.get('/availability', checkAvailability)

export default router
