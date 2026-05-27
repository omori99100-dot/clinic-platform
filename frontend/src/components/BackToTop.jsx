import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="العودة للأعلى"
      style={{
        position: 'fixed', bottom: '25px', right: '25px', zIndex: 999,
        width: '50px', height: '50px', background: 'var(--primary-gradient)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '1.2rem', boxShadow: 'var(--shadow-md)',
        cursor: 'pointer', border: 'none', transition: 'var(--transition)',
        opacity: show ? 1 : 0, visibility: show ? 'visible' : 'hidden'
      }}>
      <i className="fas fa-arrow-up"></i>
    </button>
  )
}
