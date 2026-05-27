import { Router } from 'express'
import { login, verifyToken } from '../controllers/auth.js'
import { authenticate } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/login', authLimiter, login)
router.get('/verify', authenticate, verifyToken)

export default router
