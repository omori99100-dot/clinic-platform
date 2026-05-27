export default function Contact() {
  const contacts = [
    { href: 'tel:+9647721123444', icon: 'fa-phone-alt', title: 'اتصل بنا', desc: '0772 112 3444' },
    { href: 'tel:+9647748047699', icon: 'fa-phone-alt', title: 'رقم إضافي', desc: '0774 804 7699' },
    { href: 'https://wa.me/9647721123444', icon: 'fab fa-whatsapp', title: 'واتساب', desc: '0772 112 3444', bg: '#E8F5E9', color: '#25D366', external: true },
    { href: 'https://maps.app.goo.gl/SJqbV8ncrrAj1TWC9', icon: 'fas fa-location-dot', title: 'العنوان', desc: 'سامراء — الضباط الأولى، مقابل حلويات الدلوش، فوق صيدلية شمس', external: true },
    { href: 'https://www.instagram.com/dr_ahmedshihabclinic', icon: 'fab fa-instagram', title: 'انستغرام', desc: '@dr_ahmedshihabclinic', bg: '#FCE4EC', color: '#E1306C', external: true },
  ]

  const cardStyle = {
    display: 'flex', alignItems: 'center', gap: '18px',
    background: 'var(--bg-white)', padding: '22px 25px',
    borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition)',
    border: '1px solid rgba(123,45,142,0.05)',
    textDecoration: 'none', color: 'var(--text-dark)'
  }

  return (
    <section className="section" id="contact" style={{ padding: '100px 5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--primary-soft)', color: 'var(--primary)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '15px'
          }}>
            <i className="fas fa-address-card"></i> تواصل معنا
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '15px', color: 'var(--text-dark)' }}>
            معلومات <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الاتصال</span>
          </h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            لا تتردد بالتواصل معنا - نحن هنا لخدمتك
          </p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          <div className="contact-info-cards fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {contacts.map((c, i) => (
              <a key={i} href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener noreferrer' : undefined} style={cardStyle}>
                <div className="contact-card-icon" style={{
                  width: '55px', height: '55px',
                  background: c.bg || 'var(--primary-soft)',
                  borderRadius: 'var(--radius-sm)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', color: c.color || 'var(--primary)',
                  flexShrink: 0
                }}>
                  <i className={c.icon}></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{c.title}</h4>
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>{c.desc}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="contact-map fade-up" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--primary-soft)', borderRadius: 'var(--radius-sm)',
            padding: '40px', textAlign: 'center', color: 'var(--text-gray)', fontSize: '1.1rem'
          }}>
            <div>
              <i className="fas fa-map-marked-alt" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '15px', display: 'block' }}></i>
              <p><strong>العنوان:</strong> سامراء — الضباط الأولى، مقابل حلويات الدلوش، فوق صيدلية شمس</p>
              <p style={{ marginTop: '10px' }}>يمكنك استخدام تطبيق الخرائط للوصول إلينا</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
