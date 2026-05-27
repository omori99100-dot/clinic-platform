export default function Footer() {
  return (
    <footer className="footer" style={{ background: '#1A1A2E', color: 'white', padding: '60px 5% 30px' }}>
      <div className="footer-inner" style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px'
      }}>
        <div>
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <img src="/assets/images/logo.jpg" alt="د. أحمد شهاب" style={{ height: '45px', borderRadius: '10px' }}
              onError={(e) => { e.target.style.display = 'none' }} />
            <span style={{
              fontSize: '1.2rem', fontWeight: 700,
              background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>د. أحمد شهاب</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
            عيادة د. أحمد شهاب لزراعة وتجميل وتقويم الأسنان. مهمتنا العناية بصحة أسنانكم.
          </p>
          <div className="footer-social" style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            {[
              { href: 'https://www.instagram.com/dr_ahmedshihabclinic', icon: 'fab fa-instagram' },
              { href: 'https://www.facebook.com/share/1KfVfVv1eW/', icon: 'fab fa-facebook-f' },
              { href: 'https://wa.me/9647721123444', icon: 'fab fa-whatsapp' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.icon}
                style={{
                  width: '42px', height: '42px', background: 'rgba(255,255,255,0.08)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.1rem', textDecoration: 'none', transition: 'var(--transition)'
                }}>
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'white' }}>الخدمات</h4>
          {['فينير الأسنان', 'تقويم الأسنان', 'زراعة الأسنان', 'تبييض الأسنان', 'تنظيف أسنان'].map((s, i) => (
            <a key={i} href="#services" style={{
              color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textDecoration: 'none',
              display: 'block', marginBottom: '10px', transition: 'var(--transition)'
            }}>{s}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'white' }}>روابط سريعة</h4>
          {[
            { label: 'الرئيسية', id: 'home' },
            { label: 'أعمالنا', id: 'gallery' },
            { label: 'حجز موعد', id: 'booking' },
            { label: 'اتصل بنا', id: 'contact' },
          ].map((l, i) => (
            <a key={i} href={`#${l.id}`} onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(l.id)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }} style={{
              color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textDecoration: 'none',
              display: 'block', marginBottom: '10px', transition: 'var(--transition)'
            }}>{l.label}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'white' }}>معلومات الاتصال</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
            <i className="fas fa-map-pin" style={{ marginLeft: '8px' }}></i>سامراء، الضباط الأولى
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
            <i className="fas fa-phone" style={{ marginLeft: '8px' }}></i>0772 112 3444
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
            <i className="fas fa-clock" style={{ marginLeft: '8px' }}></i>السبت 9:00-13:00 و 15:00-20:00
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
            <i className="fas fa-clock" style={{ marginLeft: '8px' }}></i>الأحد-الخميس 15:00-20:00
          </p>
        </div>
      </div>
      <div className="footer-bottom" style={{
        maxWidth: '1200px', margin: '40px auto 0', paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem'
      }}>
        © 2026 عيادة د. أحمد شهاب لزراعة وتجميل وتقويم الأسنان. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
