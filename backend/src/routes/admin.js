import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAnalytics,
} from '../controllers/admin.js'

const router = Router()

router.use(authenticate)

router.get('/bookings', getBookings)
router.get('/bookings/:id', getBookingById)
router.patch('/bookings/:id/status', updateBookingStatus)
router.delete('/bookings/:id', deleteBooking)
router.get('/analytics', getAnalytics)

export default router
