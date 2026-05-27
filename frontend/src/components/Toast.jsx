import { useEffect } from 'react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className={`toast show ${toast.type}`} style={{
      position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--text-dark)', color: 'white', padding: '16px 28px',
      borderRadius: 'var(--radius-sm)', fontWeight: 500,
      boxShadow: 'var(--shadow-lg)', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '12px',
      borderRight: `4px solid ${toast.type === 'error' ? '#EF4444' : '#10B981'}`
    }}>
      <i className="fas fa-check-circle" style={{ color: toast.type === 'error' ? '#EF4444' : '#10B981', fontSize: '1.3rem' }}></i>
      <span>{toast.message}</span>
    </div>
  )
}
