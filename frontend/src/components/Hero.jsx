export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="home" style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 40%, #7B2D8E 100%)',
      overflow: 'hidden', padding: '120px 5% 80px'
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[
          { t: '20%', l: '10%', s: '8px', d: '0s' }, { t: '60%', l: '80%', s: '5px', d: '2s' },
          { t: '30%', l: '60%', s: '10px', d: '4s' }, { t: '70%', l: '30%', s: '4px', d: '6s' },
          { t: '50%', l: '50%', s: '7px', d: '8s' }, { t: '15%', l: '85%', s: '6px', d: '3s' },
          { t: '85%', l: '15%', s: '9px', d: '5s' }, { t: '40%', l: '40%', s: '3px', d: '7s' },
        ].map((p, i) => (
          <span key={i} style={{
            position: 'absolute', top: p.t, left: p.l, width: p.s, height: p.s,
            background: 'rgba(255,255,255,0.15)', borderRadius: '50%',
            animation: `float-particle 15s infinite`, animationDelay: p.d
          }} />
        ))}
      </div>

      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '-100px', right: '-100px', borderRadius: '50%', background: 'rgba(155,77,171,0.1)' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', bottom: '-50px', left: '-50px', borderRadius: '50%', background: 'rgba(155,77,171,0.1)' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'rgba(155,77,171,0.1)' }} />
      </div>

      <div className="hero-content" style={{
        position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center'
      }}>
        <div style={{ color: 'white' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px',
            borderRadius: 'var(--radius-full)', fontSize: '0.9rem', marginBottom: '25px'
          }}>
            <i className="fas fa-tooth" style={{ color: 'var(--accent)' }}></i>
            عيادة د. أحمد شهاب
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px'
          }}>
            طب وتجميل <br /><span style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>الأسنان</span>
          </h1>
          <p style={{
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', marginBottom: '35px',
            maxWidth: '550px', lineHeight: 1.9
          }}>
            سامراء — الضباط الأولى، مقابل حلويات الدلوش
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <a href="#booking" onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
              className="btn-primary" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 32px', borderRadius: 'var(--radius-full)', fontWeight: 600,
                fontSize: '1rem', textDecoration: 'none', cursor: 'pointer', border: 'none',
                background: 'var(--primary-gradient)', color: 'white',
                boxShadow: '0 8px 30px rgba(123,45,142,0.4)',
                transition: 'var(--transition)', fontFamily: 'inherit'
              }}>
              <i className="fas fa-calendar-check"></i> احجز موعدك
            </a>
            <a href="https://wa.me/9647721123444?text=مرحباً%20دكتور،%20أرغب%20بحجز%20موعد" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 32px', borderRadius: 'var(--radius-full)', fontWeight: 600,
                fontSize: '1rem', textDecoration: 'none', cursor: 'pointer',
                background: '#25D366', color: 'white',
                boxShadow: '0 8px 30px rgba(37,211,102,0.3)',
                transition: 'var(--transition)', fontFamily: 'inherit'
              }}>
              <i className="fab fa-whatsapp"></i> واتساب
            </a>
          </div>
        </div>

        <div className="hero-visual" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="hero-image-wrapper" style={{
            position: 'relative', width: '100%', maxWidth: '500px',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <img src="/assets/images/doctor.jpg" alt="د. أحمد شهاب" style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22600%22 viewBox=%220 0 500 600%22%3E%3Crect width=%22500%22 height=%22600%22 fill=%22%237B2D8E%22/%3E%3Ctext x=%22250%22 y=%22270%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2224%22 font-family=%22Arial%22%3E%D8%AF.%20%D8%A3%D8%AD%D9%85%D8%AF%20%D8%B4%D9%87%D8%A7%D8%A8%3C/text%3E%3Ctext x=%22250%22 y=%22310%22 text-anchor=%22middle%22 fill=%22rgba(255,255,255,0.7)%22 font-size=%2216%22 font-family=%22Arial%22%3E%D8%A3%D8%AE%D8%B5%D8%A7%D8%A6%D9%8A%20%D8%AA%D8%AC%D9%85%D9%8A%D9%84%20%D9%88%D8%B2%D8%B1%D8%A7%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A3%D8%B3%D9%86%D8%A7%D9%86%3C/text%3E%3C/svg%3E' }} />
            <div style={{
              position: 'absolute', bottom: '20px', right: '20px',
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
              padding: '12px 20px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.9rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <i className="fas fa-tooth" style={{ color: 'var(--primary)' }}></i>
              أخصائي تجميل وزراعة الأسنان
            </div>
          </div>
          {[
            { icon: 'fa-smile', text: 'أهلاً بمرضانا الجدد', top: '10%', right: '-20px', delay: '0.5s' },
            { icon: 'fa-certificate', text: 'اهتمام ورعاية', bottom: '30%', left: '-30px', delay: '1s' },
          ].map((c, i) => (
            <div key={i} className="floating-card" style={{
              position: 'absolute', ...(c.top ? { top: c.top } : {}), ...(c.right ? { right: c.right } : {}),
              ...(c.bottom ? { bottom: c.bottom } : {}), ...(c.left ? { left: c.left } : {}),
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
              padding: '14px 20px', borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)',
              animation: `float 3s ease-in-out infinite`, animationDelay: c.delay
            }}>
              <i className={`fas ${c.icon}`} style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
