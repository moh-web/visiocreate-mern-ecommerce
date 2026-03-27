// ============================================
// components/Newsletter.js - الاشتراك في النشرة
// ============================================

import React, { useState } from 'react';

function Newsletter() {
  const [email, setEmail]         = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    if (email) {
      // هنا يمكن إضافة API call لحفظ الإيميل
      setIsSubmitted(true);
      setEmail('');
    }
  }

  return (
    <section className="newsletter-section">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2>Join Our Newsletter</h2>
        <p>Sign up for deals, new products and promotions</p>

        {/* لو تم الاشتراك، نعرض رسالة شكر */}
        {isSubmitted ? (
          <p style={{ color: 'var(--vc-teal)', fontWeight: 600, fontSize: 15 }}>
            ✓ Thank you for subscribing!
          </p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <i className="bi bi-envelope" style={{ color: '#aaa', marginRight: 8 }}></i>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={function (e) { setEmail(e.target.value); }}
              required
            />
            <button type="submit">Signup</button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
