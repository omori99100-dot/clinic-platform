const galleryData = [
  { img: 'case-1-after-before.jpg', title: 'فينير تجميلي', desc: 'قشور تجميلية للأسنان', bg: 'linear-gradient(135deg, #7B2D8E, #9B4DAB)' },
  { img: 'case-2-after.jpg', title: 'تقويم أسنان', desc: 'نتائج التقويم', bg: 'linear-gradient(135deg, #5B1E6E, #7B2D8E)' },
  { img: 'case-2-before.jpg', title: 'تقويم أسنان', desc: 'قبل العلاج', bg: 'linear-gradient(135deg, #6B21A8, #7B2D8E)' },
  { img: 'case-3-before-after.jpg', title: 'زراعة أسنان', desc: 'زراعة وتغليف', bg: 'linear-gradient(135deg, #9B4DAB, #C084D0)' },
  { img: 'case-4-before-after.jpg', title: 'ابتسامة هوليود', desc: 'تحسين شامل', bg: 'linear-gradient(135deg, #7B2D8E, #5B1E6E)' },
  { img: 'case-5-after-before.jpg', title: 'تجميل شامل', desc: 'نتائج متكاملة', bg: 'linear-gradient(135deg, #C084D0, #7B2D8E)' },
  { img: 'case-6-after.jpg', title: 'ترميم تجميلي', desc: 'بعد العلاج', bg: 'linear-gradient(135deg, #A855F7, #7B2D8E)' },
  { img: 'case-6-before.jpg', title: 'ترميم تجميلي', desc: 'قبل العلاج', bg: 'linear-gradient(135deg, #6B21A8, #9333EA)' },
  { img: 'case-7-after.jpg', title: 'بوندينغ تجميلي', desc: 'بعد العلاج', bg: 'linear-gradient(135deg, #D8B4FE, #7B2D8E)' },
  { img: 'case-7-before.jpg', title: 'بوندينغ تجميلي', desc: 'قبل العلاج', bg: 'linear-gradient(135deg, #4B0082, #7B2D8E)' },
  { img: 'case-8-after.jpg', title: 'ترميم أسنان', desc: 'بعد العلاج', bg: 'linear-gradient(135deg, #9333EA, #6B21A8)' },
  { img: 'case-8-before.jpg', title: 'ترميم أسنان', desc: 'قبل العلاج', bg: 'linear-gradient(135deg, #7B2D8E, #4B0082)' },
  { img: 'case-9-after.jpg', title: 'زراعة وتغليف', desc: 'بعد العلاج', bg: 'linear-gradient(135deg, #9B4DAB, #7B2D8E)' },
  { img: 'case-9-before.jpg', title: 'زراعة وتغليف', desc: 'قبل العلاج', bg: 'linear-gradient(135deg, #5B1E6E, #4B0082)' },
  { img: 'case-10-before-after.jpg', title: 'تجميل ابتسامة', desc: 'نتائج مميزة', bg: 'linear-gradient(135deg, #C026D3, #7B2D8E)' },
  { img: 'case-11-after.jpg', title: 'تجميل أسنان', desc: 'بعد العلاج', bg: 'linear-gradient(135deg, #A21CAF, #7B2D8E)' },
  { img: 'case-11-before.jpg', title: 'تجميل أسنان', desc: 'قبل العلاج', bg: 'linear-gradient(135deg, #701A75, #4B0082)' },
]

export default function Gallery() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="section gallery" id="gallery" style={{ background: 'var(--bg-light)', padding: '100px 5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--primary-soft)', color: 'var(--primary)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '15px'
          }}>
            <i className="fas fa-images"></i> أعمالنا
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '15px', color: 'var(--text-dark)' }}>
            أعمالنا <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>السابقة</span>
          </h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            بعض من أعمال العيادة
          </p>
        </div>

        <div className="gallery-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'
        }}>
          {galleryData.map((item, i) => (
            <div key={i} className="gallery-item fade-up" style={{
              position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
              cursor: 'pointer', background: 'var(--secondary)', aspectRatio: '1/1'
            }}>
              <div className="img-wrap" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.bg }}>
                <img src={`/assets/images/${item.img}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1rem;text-align:center;padding:20px">${item.title}<span style="opacity:0.7;font-size:0.8rem;font-weight:400;margin-top:5px">${item.desc}</span></div>`
                  }} />
              </div>
              <div className="gallery-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,26,46,0.8), transparent)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '20px', color: 'white', opacity: 0, transition: 'var(--transition)'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '35px' }} className="fade-up">
          <a href="#booking" onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
            className="btn btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 32px', borderRadius: 'var(--radius-full)', fontWeight: 600,
              fontSize: '1rem', textDecoration: 'none', cursor: 'pointer', border: 'none',
              background: 'var(--primary-gradient)', color: 'white',
              boxShadow: '0 8px 30px rgba(123,45,142,0.4)',
              transition: 'var(--transition)', fontFamily: 'inherit'
            }}>
            <i className="fas fa-calendar-check"></i> احجز استشارتك
          </a>
        </div>
      </div>
    </section>
  )
}
