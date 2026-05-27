import { Router } from 'express'
import { createBooking, checkAvailability } from '../controllers/bookings.js'
import { bookingLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/', bookingLimiter, createBooking)
router.get('/availability', checkAvailability)

export default router
