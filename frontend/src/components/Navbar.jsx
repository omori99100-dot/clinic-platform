import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute('id')
      })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setActive(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const links = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'الخدمات' },
    { id: 'gallery', label: 'أعمالنا' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(123,45,142,0.08)', padding: '0 5%' }}>
      <div className="flex items-center justify-between" style={{ maxWidth: '1400px', margin: '0 auto', height: '75px' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home') }} className="flex items-center gap-3 no-underline font-bold" style={{ color: 'var(--text-dark)', fontSize: '1.1rem' }}>
          <img src="/assets/images/logo.jpg" alt="د. أحمد شهاب" style={{ height: '45px', borderRadius: '10px' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style=\"background:var(--primary-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent\">د. أحمد شهاب</span>' }} />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>د. أحمد شهاب</span>
        </a>

        <ul className={`flex items-center gap-2 list-none`}
          style={{
            display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', margin: 0
          }}>
          {links.map(l => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}
                className={`no-underline font-medium transition-all duration-300 ${active === l.id ? 'active' : ''}`}
                style={{
                  color: active === l.id ? 'var(--primary)' : 'var(--text-gray)',
                  fontSize: '0.95rem', padding: '8px 18px', borderRadius: 'var(--radius-full)',
                  background: active === l.id ? 'var(--primary-soft)' : 'transparent'
                }}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#booking" onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
              className="no-underline font-semibold"
              style={{
                background: 'var(--primary-gradient)', color: 'white', padding: '10px 24px',
                borderRadius: 'var(--radius-full)', fontWeight: 600
              }}>
              <i className="fas fa-calendar-check"></i> احجز موعدك
            </a>
          </li>
        </ul>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: isMobile ? 'flex' : 'none',
            flexDirection: 'column', gap: '5px', cursor: 'pointer', padding: '5px'
          }}>
          <span style={{
            width: '28px', height: '3px', background: 'var(--text-dark)',
            borderRadius: '3px', transition: 'var(--transition)',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none'
          }}></span>
          <span style={{
            width: '28px', height: '3px', background: 'var(--text-dark)',
            borderRadius: '3px', transition: 'var(--transition)',
            opacity: menuOpen ? 0 : 1
          }}></span>
          <span style={{
            width: '28px', height: '3px', background: 'var(--text-dark)',
            borderRadius: '3px', transition: 'var(--transition)',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none'
          }}></span>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '75px', left: 0, right: 0,
          background: 'var(--bg-white)', padding: '20px',
          boxShadow: 'var(--shadow-md)', borderBottom: '2px solid var(--primary-soft)',
          display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 999
        }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}
              style={{
                textDecoration: 'none', color: active === l.id ? 'var(--primary)' : 'var(--text-gray)',
                fontWeight: 500, padding: '10px 18px', borderRadius: 'var(--radius-full)',
                textAlign: 'center', background: active === l.id ? 'var(--primary-soft)' : 'transparent'
              }}>
              {l.label}
            </a>
          ))}
          <a href="#booking" onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
            style={{
              background: 'var(--primary-gradient)', color: 'white', padding: '12px 24px',
              borderRadius: 'var(--radius-full)', fontWeight: 600, textDecoration: 'none', textAlign: 'center'
            }}>
            <i className="fas fa-calendar-check"></i> احجز موعدك
          </a>
        </div>
      )}
    </nav>
  )
}
