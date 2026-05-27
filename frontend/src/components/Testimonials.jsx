const testimonials = [
  { stars: 5, text: '"دكتور أحمد شهاب فنان في شغله. سويت فينير عندو والنتيجة كانت خرافية."', name: 'محمد ع.', initial: 'م', service: 'فينير أسنان' },
  { stars: 5, text: '"زراعة أسنان بتقنية رائعة وما حسيت بألم. الدكتور متابع معاي حتى بعد العملية."', name: 'أحمد ف.', initial: 'أ', service: 'زراعة أسنان' },
]

export default function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials" style={{ background: 'var(--bg-white)', padding: '100px 5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--primary-soft)', color: 'var(--primary)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '15px'
          }}>
            <i className="fas fa-comments"></i> آراء المرضى
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '15px', color: 'var(--text-dark)' }}>
            ماذا يقول <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مرضانا</span>
          </h2>
        </div>

        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card fade-up" style={{
              background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', padding: '30px',
              border: '1px solid rgba(123,45,142,0.05)', transition: 'var(--transition)'
            }}>
              <div className="testimonial-stars" style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '1.1rem' }}>
                {'★'.repeat(t.stars)}
              </div>
              <p className="testimonial-text" style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.8 }}>
                {t.text}
              </p>
              <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="testimonial-avatar" style={{
                  width: '48px', height: '48px', background: 'var(--primary-gradient)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '1.2rem'
                }}>{t.initial}</div>
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{t.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
