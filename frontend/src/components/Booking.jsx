import { useState, useEffect, useCallback } from 'react'
import { bookingApi } from '../services/api'

const schedule = {
  0: { name: 'الأحد', slots: ['15:00','16:00','17:00','18:00','19:00'] },
  1: { name: 'الإثنين', slots: ['15:00','16:00','17:00','18:00','19:00'] },
  2: { name: 'الثلاثاء', slots: ['15:00','16:00','17:00','18:00','19:00'] },
  3: { name: 'الأربعاء', slots: ['15:00','16:00','17:00','18:00','19:00'] },
  4: { name: 'الخميس', slots: ['15:00','16:00','17:00','18:00','19:00'] },
  5: { name: 'الجمعة', slots: [] },
  6: { name: 'السبت', slots: ['09:00','10:00','11:00','12:00','15:00','16:00','17:00','18:00','19:00'] }
}

export default function Booking({ showToast }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [slots, setSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ service: '', name: '', phone: '', notes: '' })

  const updateSlots = useCallback(async (d) => {
    if (!d) return
    const selectedDate = new Date(d + 'T12:00:00')
    if (isNaN(selectedDate.getTime())) return
    const dayOfWeek = selectedDate.getDay()
    const daySchedule = schedule[dayOfWeek]
    if (!daySchedule) return

    let available = [...daySchedule.slots]
    const isToday = d === today
    const now = new Date()

    if (isToday) {
      available = available.filter(slotTime => {
        const [h, m] = slotTime.split(':').map(Number)
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes())
      })
    }

    try {
      const data = await bookingApi.checkAvailability(d)
      available = available.filter(s => !(data.bookedTimes || []).includes(s))
    } catch {
      // API offline, fall back to schedule-only
    }

    setSlots(available)
    setTime('')
  }, [today])

  useEffect(() => { updateSlots(date) }, [date, updateSlots])

  useEffect(() => {
    const handleTouch = (e) => {
      const input = e.target
      if (input.type === 'date' && input.showPicker) input.showPicker()
    }
    const dateInput = document.getElementById('bookingDate')
    if (dateInput) {
      dateInput.addEventListener('touchstart', handleTouch)
      return () => dateInput.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { service, name, phone } = form

    if (!service || !name || !phone || !date || !time) {
      showToast('يرجى تعبئة جميع الحقول المطلوبة', 'error')
      return
    }
    if (phone.length < 10) {
      showToast('يرجى إدخال رقم هاتف صحيح', 'error')
      return
    }

    setSubmitting(true)
    try {
      await bookingApi.create({
        patient_name: name,
        patient_phone: phone,
        service,
        booking_date: date,
        booking_time: time,
        notes: form.notes,
      })
      showToast('✅ تم إرسال الحجز بنجاح! سيتم تأكيده عبر واتساب', 'success')

      const appointments = JSON.parse(localStorage.getItem('clinicAppointments') || '[]')
      appointments.push({
        id: Date.now(), ...form, date, time,
        createdAt: new Date().toISOString(), status: 'جديد'
      })
      localStorage.setItem('clinicAppointments', JSON.stringify(appointments))

      setForm({ service: '', name: '', phone: '', notes: '' })
      setTime('')
      setDate(today)
      updateSlots(today)
    } catch (err) {
      if (err.message.includes('محجوز') || err.message.includes('موجود')) {
        showToast('هذا الموعد محجوز بالفعل، الرجاء اختيار موعد آخر', 'error')
        updateSlots(date)
      } else {
        showToast(err.message || 'فشل إرسال الحجز', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section booking" id="booking" style={{
      background: 'var(--primary-gradient)', position: 'relative', overflow: 'hidden', padding: '100px 5%'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)', color: 'white',
            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '15px'
          }}>
            <i className="fas fa-calendar-alt"></i> الحجز الإلكتروني
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '15px', color: 'white' }}>
            احجز <span style={{ color: 'white' }}>موعدك الآن</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            اختيار الخدمة والوقت المناسب لك - سيتم تأكيد الحجز عبر واتساب
          </p>
        </div>

        <div className="booking-content" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', alignItems: 'start' }}>
          <div className="booking-form fade-up" style={{
            background: 'var(--bg-white)', borderRadius: 'var(--radius-md)', padding: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div className="booking-steps" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              {[
                { num: '1', text: 'اختر الخدمة التي تريدها' },
                { num: '2', text: 'اختر التاريخ والوقت المناسب لك' },
                { num: '3', text: 'أدخل معلوماتك وسنؤكد حجزك عبر واتساب' },
              ].map((s, i) => (
                <div key={i} className="booking-step" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div className="booking-step-num" style={{
                    width: '35px', height: '35px', background: 'var(--primary-soft)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', flexShrink: 0
                  }}>{s.num}</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                    <strong style={{ color: 'var(--text-dark)' }}>{s.text}</strong>
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-dark)' }}>
                  نوع الخدمة <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select value={form.service} onChange={(e) => setForm(f => ({ ...f, service: e.target.value }))} required
                  style={{
                    width: '100%', padding: '12px 40px 12px 16px', border: '2px solid #E5E7EB',
                    borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '0.95rem',
                    transition: 'var(--transition)', background: 'var(--bg-light)', color: 'var(--text-dark)',
                    cursor: 'pointer', appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%236B7280\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'left 16px center'
                  }}>
                  <option value="">-- اختر الخدمة --</option>
                  <option value="فينير الأسنان">فينير الأسنان</option>
                  <option value="تقويم الأسنان">تقويم الأسنان</option>
                  <option value="زراعة الأسنان">زراعة الأسنان</option>
                  <option value="تبييض الأسنان">تبييض الأسنان</option>
                  <option value="تنظيف أسنان">تنظيف أسنان</option>
                  <option value="استشارة عامة">استشارة عامة</option>
                </select>
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-dark)' }}>
                    الاسم الكامل <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="مثال: أحمد محمد" required
                    style={{
                      width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB',
                      borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '0.95rem',
                      transition: 'var(--transition)', background: 'var(--bg-light)', color: 'var(--text-dark)'
                    }} />
                </div>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-dark)' }}>
                    رقم الهاتف <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="مثال: 07701234567" required
                    style={{
                      width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB',
                      borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '0.95rem',
                      transition: 'var(--transition)', background: 'var(--bg-light)', color: 'var(--text-dark)'
                    }} />
                </div>
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-dark)' }}>
                    تاريخ الموعد <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input type="date" id="bookingDate" value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today} required
                    style={{
                      width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB',
                      borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '0.95rem',
                      transition: 'var(--transition)', background: 'var(--bg-light)', color: 'var(--text-dark)'
                    }} />
                </div>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-dark)' }}>
                    الوقت <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div className="time-slots" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '5px' }}>
                    {slots.length > 0 ? slots.map(s => (
                      <div key={s} onClick={() => setTime(s)}
                        style={{
                          padding: '10px', textAlign: 'center', border: `2px solid ${time === s ? 'var(--primary)' : '#E5E7EB'}`,
                          borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
                          transition: 'var(--transition)', background: time === s ? 'var(--primary)' : 'var(--bg-light)',
                          color: time === s ? 'white' : 'inherit'
                        }}>
                        {s}
                      </div>
                    )) : (
                      <p style={{ color: '#ef4444', fontSize: '0.9rem', gridColumn: '1 / -1' }}>⚠ لا توجد مواعيد متاحة في هذا اليوم</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-dark)' }}>
                  ملاحظات إضافية
                </label>
                <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="أي معلومات إضافية تريد إخبارنا بها..."
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB',
                    borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '0.95rem',
                    transition: 'var(--transition)', background: 'var(--bg-light)', color: 'var(--text-dark)',
                    resize: 'vertical', minHeight: '100px'
                  }} />
              </div>

              <button type="submit" disabled={submitting}
                style={{
                  width: '100%', padding: '16px', fontSize: '1.1rem',
                  background: 'var(--primary-gradient)', color: 'white', border: 'none',
                  borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'var(--transition)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  opacity: submitting ? 0.6 : 1
                }}>
                {submitting ? (
                  <><i className="fas fa-spinner fa-spin"></i> جاري إرسال الحجز...</>
                ) : (
                  <><i className="fas fa-check-circle"></i> تأكيد الحجز</>
                )}
              </button>
            </form>
          </div>

          <div className="booking-info fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: 'fa-clock', title: 'أوقات تواجد الدكتور', content: () => (
                <>
                  <p><strong>السبت:</strong> ٩:٠٠ ص – ١:٠٠ م و ٣:٠٠ م – ٨:٠٠ م</p>
                  <p><strong>الأحد - الخميس:</strong> ٣:٠٠ م – ٨:٠٠ م</p>
                  <p><strong>الجمعة:</strong> مغلق</p>
                </>
              )},
              { icon: 'fa-phone-alt', title: 'اتصل بنا', content: () => (
                <>
                  <a href="tel:+9647721123444" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', marginTop: '8px', fontWeight: 500 }}><i className="fas fa-phone"></i> 0772 112 3444</a>
                  <a href="tel:+9647748047699" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', marginTop: '8px', fontWeight: 500 }}><i className="fas fa-phone"></i> 0774 804 7699</a>
                </>
              )},
              { icon: 'fa-location-dot', title: 'العنوان', content: () => (
                <>
                  <p>سامراء — الضباط الأولى، مقابل حلويات الدلوش، فوق صيدلية شمس</p>
                  <a href="https://maps.app.goo.gl/SJqbV8ncrrAj1TWC9" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', marginTop: '8px', fontWeight: 500 }}><i className="fas fa-map-marked-alt"></i> عرض على الخريطة</a>
                </>
              )},
              { icon: 'fa-shield-alt', title: 'ضمان الجودة', content: () => (
                <p>نستخدم مواد أمريكية وسويسرية معتمدة من FDA و CE الأوروبية.</p>
              )},
            ].map((card, i) => (
              <div key={i} className="booking-info-card" style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)',
                padding: '25px', color: 'white'
              }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '10px' }}>
                  <i className={`fas ${card.icon}`} style={{ fontSize: '1.3rem' }}></i> {card.title}
                </h4>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                  <card.content />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
