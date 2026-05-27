import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../services/api'

const statusColors = {
  pending: '#FEF3C7',
  confirmed: '#DBEAFE',
  completed: '#D1FAE5',
  cancelled: '#FEE2E2',
}

const statusLabels = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ summary: {}, daily: [] })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', date: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionMsg, setActionMsg] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (filter.status) params.status = filter.status
      if (filter.date) params.date = filter.date
      const [b, a] = await Promise.all([
        adminApi.getBookings(params),
        adminApi.getAnalytics({}),
      ])
      setBookings(b.rows)
      setTotalPages(b.totalPages)
      setStats(a)
    } catch (err) {
      setActionMsg('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => { fetchData() }, [fetchData])

  const updateStatus = async (id, status) => {
    try {
      await adminApi.updateStatus(id, status)
      setActionMsg('تم تحديث الحالة')
      fetchData()
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  const deleteBooking = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return
    try {
      await adminApi.deleteBooking(id)
      setActionMsg('تم حذف الحجز')
      fetchData()
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const { summary, daily } = stats

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #7B2D8E, #5B21B6)', color: 'white',
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-tooth" style={{ fontSize: '1.3rem' }}></i>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.1rem' }}>لوحة التحكم</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>{user?.name} — {user?.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/" style={{ color: 'white', fontSize: '0.85rem', opacity: 0.8, textDecoration: 'none' }}>
            <i className="fas fa-external-link-alt"></i> الموقع
          </a>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
            fontFamily: 'inherit'
          }}>
            <i className="fas fa-sign-out-alt"></i> خروج
          </button>
        </div>
      </header>

      {/* Action message toast */}
      {actionMsg && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, background: '#374151', color: 'white', padding: '10px 24px',
          borderRadius: '10px', fontSize: '0.9rem'
        }}>
          {actionMsg}
          <button onClick={() => setActionMsg('')} style={{
            background: 'none', border: 'none', color: 'white', marginRight: '12px', cursor: 'pointer'
          }}>✕</button>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Stats cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '15px', marginBottom: '24px'
        }}>
          {[
            { label: 'إجمالي الحجوزات', value: summary.total || 0, color: '#7B2D8E' },
            { label: 'مؤكد', value: summary.confirmed || 0, color: '#2563EB' },
            { label: 'مكتمل', value: summary.completed || 0, color: '#059669' },
            { label: 'ملغي', value: summary.cancelled || 0, color: '#DC2626' },
            { label: 'قيد الانتظار', value: summary.pending || 0, color: '#D97706' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '5px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '16px 20px',
          marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>تصفية:</div>
          <select value={filter.status} onChange={e => { setFilter(f => ({ ...f, status: e.target.value })); setPage(1) }}
            style={{
              padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px',
              fontSize: '0.85rem', fontFamily: 'inherit'
            }}>
            <option value="">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
          <input type="date" value={filter.date} onChange={e => { setFilter(f => ({ ...f, date: e.target.value })); setPage(1) }}
            style={{
              padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px',
              fontSize: '0.85rem', fontFamily: 'inherit'
            }} />
          {(filter.status || filter.date) && (
            <button onClick={() => { setFilter({ status: '', date: '' }); setPage(1) }} style={{
              background: '#F3F4F6', border: 'none', padding: '8px 14px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit'
            }}>إلغاء التصفية</button>
          )}
        </div>

        {/* Bookings table */}
        <div style={{
          background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                  {['#', 'الاسم', 'الهاتف', 'الخدمة', 'التاريخ', 'الوقت', 'الحالة', 'واتساب', 'إجراءات'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>جاري التحميل...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>لا توجد حجوزات</td></tr>
                ) : bookings.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 10px', color: '#6B7280' }}>{(page - 1) * 20 + i + 1}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 500 }}>{b.patient_name}</td>
                    <td style={{ padding: '12px 10px', direction: 'ltr', textAlign: 'left' }}>{b.patient_phone}</td>
                    <td style={{ padding: '12px 10px' }}>{b.service}</td>
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>{b.booking_date}</td>
                    <td style={{ padding: '12px 10px' }}>{b.booking_time}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                        style={{
                          padding: '4px 8px', borderRadius: '6px', border: '1px solid #D1D5DB',
                          background: statusColors[b.status] || '#F3F4F6', fontSize: '0.8rem',
                          fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
                        }}>
                        {Object.entries(statusLabels).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {b.whatsapp_sent ? (
                        <span style={{ color: '#059669', fontSize: '0.8rem' }}>✓ أرسلت</span>
                      ) : b.whatsapp_error ? (
                        <span style={{ color: '#DC2626', fontSize: '0.75rem' }} title={b.whatsapp_error}>✗ فشل</span>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <button onClick={() => deleteBooking(b.id)}
                        style={{
                          background: '#FEE2E2', border: 'none', color: '#DC2626',
                          padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                          fontSize: '0.75rem', fontFamily: 'inherit'
                        }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                style={{
                  padding: '8px 16px', border: '1px solid #D1D5DB', borderRadius: '8px',
                  background: 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1,
                  fontFamily: 'inherit'
                }}>السابق</button>
              <span style={{ padding: '8px 12px', color: '#6B7280', fontSize: '0.85rem' }}>{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '8px 16px', border: '1px solid #D1D5DB', borderRadius: '8px',
                  background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1,
                  fontFamily: 'inherit'
                }}>التالي</button>
            </div>
          )}
        </div>

        {/* Daily stats chart */}
        {daily.length > 0 && (
          <div style={{
            background: 'white', borderRadius: '16px', padding: '20px', marginTop: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px', fontSize: '1rem', color: '#374151' }}>إحصائيات يومية (آخر 30 يوم)</h3>
            <div style={{ overflowX: 'auto', fontSize: '0.8rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '8px', textAlign: 'right' }}>التاريخ</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>المجموع</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>مؤكد</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>مكتمل</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>ملغي</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>قيد الانتظار</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '8px' }}>{d.booking_date}</td>
                      <td style={{ padding: '8px', textAlign: 'center', fontWeight: 600 }}>{d.total}</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#2563EB' }}>{d.confirmed}</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#059669' }}>{d.completed}</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#DC2626' }}>{d.cancelled}</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#D97706' }}>{d.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
