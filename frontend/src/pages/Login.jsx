import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #7B2D8E 0%, #5B21B6 100%)',
      padding: '20px', fontFamily: "'Cairo', sans-serif"
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '70px', height: '70px', background: 'linear-gradient(135deg, #7B2D8E, #5B21B6)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 15px', fontSize: '30px', color: 'white'
          }}>
            <i className="fas fa-tooth"></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#7B2D8E', margin: '0 0 5px' }}>لوحة التحكم</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: 0 }}>عيادة د. أحمد شهاب</p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', color: '#DC2626', padding: '12px 16px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: '#374151' }}>
              البريد الإلكتروني
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@clinic.com" required
              style={{
                width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB',
                borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit',
                boxSizing: 'border-box'
              }} />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: '#374151' }}>
              كلمة المرور
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB',
                borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit',
                boxSizing: 'border-box'
              }} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7B2D8E, #5B21B6)',
            color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            fontFamily: 'inherit'
          }}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          <a href="/" style={{ color: '#7B2D8E', textDecoration: 'none' }}>← العودة إلى الموقع</a>
        </p>
      </div>
    </div>
  )
}
