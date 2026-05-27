import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function SWUpdater({ children }) {
  const [waitingWorker, setWaitingWorker] = useState(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker)
            }
          })
        })
      })
    }
  }, [])

  return (
    <>
      {waitingWorker && (
        <div style={{
          position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, background: '#374151', color: 'white', padding: '12px 24px',
          borderRadius: '12px', fontSize: '0.9rem', display: 'flex', gap: '12px', alignItems: 'center',
          fontFamily: "'Cairo', sans-serif"
        }}>
          <span>⚠️ تحديث جديد متاح</span>
          <button onClick={() => { waitingWorker.postMessage({ type: 'SKIP_WAITING' }); window.location.reload() }}
            style={{
              background: 'var(--primary-gradient)', color: 'white', border: 'none',
              padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
            }}>
            تحديث الآن
          </button>
        </div>
      )}
      {children}
    </>
  )
}

function Root() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <SWUpdater>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
            </Routes>
          </SWUpdater>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
