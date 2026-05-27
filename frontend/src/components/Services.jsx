const categories = [
  {
    icon: '💎', title: 'خدمات التجميل',
    items: [
      { icon: '💎', title: 'فينير الأسنان', desc: 'قشور تجميلية رقيقة توضع على السطح الأمامي للأسنان لتحسين المظهر واللون والشكل بسرعة', tag: 'نتائج فورية', popular: true },
      { icon: '⭐', title: 'ابتسامة هوليود', desc: 'تصميم ابتسامة متكاملة وفقاً لمعايير الجمال العالمية لتتناسب مع ملامح وجهك', tag: 'تصميم مخصص' },
      { icon: '✨', title: 'تبييض الأسنان', desc: 'باستخدام مواد مبيضة آمنة وتقنية الليزر للحصول على أسنان أكثر بياضاً ولمعاناً', tag: 'آمن وفعال' },
      { icon: '🖌️', title: 'حشوات تجميلية', desc: 'حشوات بلون الأسنان لترميم الأسنان المتضررة مع الحفاظ على المظهر الجمالي الطبيعي', tag: 'بلون السن' },
    ]
  },
  {
    icon: '🦷', title: 'العلاج العام',
    items: [
      { icon: '🦷', title: 'حشوات الأسنان', desc: 'علاج التسوس باستخدام أفضل مواد الحشو الدائمة لاستعادة وظيفة وشكل السن', tag: 'متينة' },
      { icon: '🔬', title: 'علاج العصب', desc: 'إزالة العصب المصاب وتنظيف قناة الجذر تحت تخدير موضعي للحفاظ على السن من الخلع', tag: 'الحفاظ على السن' },
      { icon: '🌿', title: 'علاج اللثة', desc: 'علاج التهابات ونزيف اللثة وإزالة الجير والترسبات للحفاظ على صحة الفم واللثة', tag: 'صحة اللثة' },
      { icon: '🫧', title: 'تنظيف الأسنان', desc: 'إزالة الرواسب والجير والبقع السطحية باستخدام تقنية التنظيف بالموجات فوق الصوتية', tag: 'بدون ألم' },
    ]
  },
  {
    icon: '🏗️', title: 'التعويضات والتركيبات',
    items: [
      { icon: '🦷', title: 'زراعة الأسنان', desc: 'تعويض الأسنان المفقودة بزرعات التيتانيوم الآمنة لتثبيت تاج أو جسر ثابت', tag: 'حل دائم' },
      { icon: '👑', title: 'تيجان وجسور', desc: 'تركيبات ثابتة من البورسلان أو الزيركون لتعويض الأسنان المتضررة أو المفقودة', tag: 'مظهر طبيعي' },
      { icon: '😁', title: 'أطقم الأسنان', desc: 'أطقم كاملة وجزئية متحركة مصنوعة خصيصاً لتعويض الأسنان المفقودة', tag: 'حسب الطلب' },
      { icon: '🔄', title: 'إصلاح التركيبات', desc: 'إصلاح وصيانة التيجان والجسور والأطقم المكسورة أو التالفة', tag: 'صيانة' },
    ]
  },
  {
    icon: '📐', title: 'التقويم وجراحة الفم',
    items: [
      { icon: '📐', title: 'تقويم الأسنان', desc: 'علاج عدم انتظام الأسنان وتطابق الفكين باستخدام أحدث أجهزة التقويم الثابت والمتحرك', tag: 'لجميع الأعمار' },
      { icon: '🏥', title: 'خلع الأسنان', desc: 'خلع الأسنان المتضررة أو المطمورة تحت تأثير التخدير الموضعي وبأقل ألم ممكن', tag: 'تحت التخدير' },
      { icon: '🩺', title: 'الفحص والتشخيص', desc: 'فحص شامل للفم والأسنان مع التشخيص المبكر للمشاكل ووضع خطة علاجية مناسبة', tag: 'فحص شامل' },
      { icon: '🛡️', title: 'علاج الحساسية', desc: 'علاج حساسية الأسنان باستخدام مواد طبية مخصصة لتخفيف الألم الناتج عن المشروبات الباردة والساخنة', tag: 'تخفيف الألم' },
    ]
  }
]

export default function Services() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="section services" id="services" style={{ background: 'var(--bg-white)', padding: '100px 5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--primary-soft)', color: 'var(--primary)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '15px'
          }}>
            <i className="fas fa-tooth"></i> خدماتنا
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '15px', color: 'var(--text-dark)' }}>
            جميع خدمات <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>طب الأسنان</span>
          </h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            نقدم مجموعة شاملة ومتكاملة من الخدمات العلاجية والتجميلية بأيدي كوادر طبية مختصة
          </p>
        </div>

        {categories.map((cat, ci) => (
          <div key={ci} className="services-category fade-up" style={{ marginBottom: '10px', marginTop: ci > 0 ? '40px' : 0 }}>
            <div className="services-cat-header" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-soft)'
            }}>
              <span style={{ fontSize: '1.6rem' }}>{cat.icon}</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)' }}>{cat.title}</h3>
            </div>
            <div className="services-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px'
            }}>
              {cat.items.map((svc, si) => (
                <div key={si} className="service-card fade-up" style={{
                  background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', padding: '35px 25px',
                  textAlign: 'center', transition: 'var(--transition)',
                  border: '1px solid rgba(123,45,142,0.05)', position: 'relative', overflow: 'hidden',
                  cursor: 'default'
                }}>
                  <div style={{
                    content: '', position: 'absolute', top: 0, left: 0, right: 0,
                    height: '4px', background: 'var(--primary-gradient)',
                    transform: 'scaleX(0)', transition: 'var(--transition)',
                    transformOrigin: 'right'
                  }} />
                  {svc.popular && (
                    <div className="service-popular" style={{
                      position: 'absolute', top: '15px', left: '15px',
                      background: 'var(--accent)', color: '#1A1A2E',
                      padding: '4px 12px', borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem', fontWeight: 700
                    }}>الأكثر طلباً</div>
                  )}
                  <div className="service-icon" style={{
                    width: '70px', height: '70px', background: 'var(--primary-soft)',
                    borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem', color: 'var(--primary)',
                    transition: 'var(--transition)'
                  }}>{svc.icon}</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{svc.title}</h3>
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '20px' }}>{svc.desc}</p>
                  <span className="service-tag" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: 'var(--primary-soft)', color: 'var(--primary)',
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', fontWeight: 600
                  }}>{svc.tag}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '45px' }} className="fade-up">
          <a href="#booking" onClick={(e) => { e.preventDefault(); scrollTo('booking') }}
            className="btn btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 32px', borderRadius: 'var(--radius-full)', fontWeight: 600,
              fontSize: '1rem', textDecoration: 'none', cursor: 'pointer', border: 'none',
              background: 'var(--primary-gradient)', color: 'white',
              boxShadow: '0 8px 30px rgba(123,45,142,0.4)',
              transition: 'var(--transition)', fontFamily: 'inherit'
            }}>
            <i className="fas fa-calendar-check"></i> احجز استشارتك الآن
          </a>
        </div>
      </div>
    </section>
  )
}
