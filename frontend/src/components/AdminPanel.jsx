import { useState, useEffect } from 'react'

export default function AdminPanel({ onClose }) {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('clinicAppointments') || '[]')
    setAppointments(data)
  }, [])

  const clearAll = () => {
    localStorage.removeItem('clinicAppointments')
    setAppointments([])
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.7)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}>
      <div style={{
        background: 'white', borderRadius: '20px', maxWidth: '900px',
        width: '100%', maxHeight: '80vh', overflow: 'auto', padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#7B2D8E', fontSize: '1.3rem' }}>
            📋 قائمة الحجوزات ({appointments.length})
          </h3>
          <button onClick={onClose} style={{
            background: '#fee2e2', border: 'none', borderRadius: '50%',
            width: '35px', height: '35px', cursor: 'pointer', fontSize: '1.2rem'
          }}>✕</button>
        </div>
        {appointments.length > 0 ? (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#7B2D8E', color: 'white' }}>
                  {['#', 'الاسم', 'الهاتف', 'الخدمة', 'التاريخ', 'الوقت', 'الحالة'].map((h, i) => (
                    <th key={i} style={{ padding: '10px', textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...appointments].reverse().map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{i + 1}</td>
                    <td style={{ padding: '10px' }}>{a.name}</td>
                    <td style={{ padding: '10px', direction: 'ltr', textAlign: 'left' }}>{a.phone}</td>
                    <td style={{ padding: '10px' }}>{a.service}</td>
                    <td style={{ padding: '10px' }}>{a.date}</td>
                    <td style={{ padding: '10px' }}>{a.time}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#fef3c7', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#9CA3AF', textAlign: 'center' }}>
              بيانات الحجوزات مخزنة محلياً في المتصفح
            </p>
            <button onClick={clearAll} style={{
              marginTop: '10px', padding: '8px 20px', background: '#ef4444',
              color: 'white', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontSize: '0.85rem'
            }}>مسح جميع الحجوزات</button>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-gray)', padding: '40px' }}>
            لا توجد حجوزات مسجلة
          </p>
        )}
      </div>
    </div>
  )
}
