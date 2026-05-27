import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Log from '../models/Log.js'
import config from '../config/index.js'

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
    }

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
    }

    await User.updateLastLogin(user.id)

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    await Log.create({
      action: 'admin_login',
      entity_type: 'user',
      entity_id: user.id,
      user_id: user.id,
      details: { email: user.email },
      ip_address: req.ip,
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'حدث خطأ في الخادم' })
  }
}

export async function verifyToken(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' })
    }
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ في الخادم' })
  }
}
