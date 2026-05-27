import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '15px', fontFamily: "'Cairo', sans-serif",
          background: '#FBF8FD', padding: '20px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ color: '#7B2D8E', margin: 0 }}>عذراً، حدث خطأ غير متوقع</h2>
          <p style={{ color: '#6B7280', margin: 0 }}>يرجى إعادة تحميل الصفحة</p>
          <button onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #7B2D8E, #5B21B6)', color: 'white',
              border: 'none', padding: '12px 30px', borderRadius: '12px',
              fontSize: '1rem', fontWeight: 600, cursor: 'pointer'
            }}>
            إعادة تحميل
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
