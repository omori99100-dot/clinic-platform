export default function WhatsAppFloat() {
  return (
    <a href="https://wa.me/9647721123444?text=مرحباً%20دكتور،%20أرغب%20بحجز%20موعد"
      target="_blank" rel="noopener noreferrer" aria-label="واتساب"
      style={{
        position: 'fixed', bottom: '25px', left: '25px', zIndex: 999,
        width: '60px', height: '60px', background: '#25D366',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '1.8rem',
        boxShadow: '0 8px 30px rgba(37,211,102,0.4)',
        textDecoration: 'none', animation: 'pulse-whatsapp 2s infinite',
        transition: 'var(--transition)'
      }}>
      <i className="fab fa-whatsapp"></i>
    </a>
  )
}
