import { Router } from 'express'
import { login, verifyToken } from '../controllers/auth.js'
import { authenticate } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { validate, loginSchema } from '../middleware/validate.js'

const router = Router()

router.post('/login', authLimiter, validate(loginSchema), login)
router.get('/verify', authenticate, verifyToken)

export default router
