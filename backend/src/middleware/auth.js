import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'الرجاء تسجيل الدخول' })
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'انتهت صلاحية الجلسة' })
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.split(' ')[1], config.jwt.secret)
    } catch {
      // ignore invalid token
    }
  }
  next()
}
