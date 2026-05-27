import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Booking from './components/Booking'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import BackToTop from './components/BackToTop'
import Toast from './components/Toast'

const AdminPanel = lazy(() => import('./components/AdminPanel'))

export default function App() {
  const [toast, setToast] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === 'a' || e.key === 'A') && !e.ctrlKey && !e.metaKey && !e.target.closest('input,textarea,select')) {
        setShowAdmin(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  return (
    <div dir="rtl">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Booking showToast={showToast} />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
      {showAdmin && (
        <Suspense fallback={null}>
          <AdminPanel onClose={() => setShowAdmin(false)} />
        </Suspense>
      )}
    </div>
  )
}
