import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    showToast('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div>
      <div className="container py-5">
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: 'var(--vc-gray-500)', marginBottom: 24 }}>
          <span>Home</span> › <span style={{ color: 'var(--vc-dark)' }}>Contact Us</span>
        </div>

        {/* Hero Text */}
        <div style={{ maxWidth: 600, marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', lineHeight: 1.2, marginBottom: 20 }}>
            We believe in sustainable decor. We're passionate about life at home.
          </h1>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
            Our features timeless furniture, with natural fabrics, curved lines, plenty of mirrors and classic design, which can be incorporated into any decor project. The pieces enchant for their sobriety, to last for generations, faithful to the shapes of each period, with a touch of the present
          </p>
        </div>

        {/* About Us Section */}
        <div className="row g-0 mb-5" style={{ background: 'var(--vc-gray-100)', borderRadius: 16, overflow: 'hidden' }}>
          <div className="col-md-5">
            <div style={{ height: 300, background: 'linear-gradient(135deg, #c9b8a0, #a89078)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-house-heart" style={{ fontSize: 64, color: 'rgba(255,255,255,0.5)' }}></i>
            </div>
          </div>
          <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 16 }}>About Us</h3>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 8 }}>
              VisioCreate is a gift & decorations store based in HCMC, Vietnam. Est since 2019.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 20 }}>
              Our customer service is always prepared to support you 24/7
            </p>
            <a href="/shop" style={{ fontWeight: 600, fontSize: 14, color: 'var(--vc-dark)' }}>Shop Now →</a>
          </div>
        </div>

        {/* Contact Heading */}
        <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Contact Us</h2>

        {/* Contact Cards */}
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <div className="contact-card">
              <i className="bi bi-geo-alt"></i>
              <div className="type">Address</div>
              <div className="value">234 Hai Trieu, Ho Chi Minh City,<br />Viet Nam</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-card">
              <i className="bi bi-telephone"></i>
              <div className="type">Contact Us</div>
              <div className="value">+84 234 567 890</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-card">
              <i className="bi bi-envelope"></i>
              <div className="type">Email</div>
              <div className="value">hello@VisioCreate.com</div>
            </div>
          </div>
        </div>

        {/* Form + Map */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-sm">Full Name</label>
                <input className="vc-input" placeholder="Your Name" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label-sm">Email Address</label>
                <input className="vc-input" type="email" placeholder="Your Email" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label-sm">Message</label>
                <textarea className="vc-input" rows={5} placeholder="Your message" value={form.message} onChange={e => set('message', e.target.value)} required style={{ resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" className="btn-dark-vc" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                Send Message
              </button>
            </form>
          </div>
          <div className="col-md-6">
            <div style={{ borderRadius: 12, overflow: 'hidden', height: '100%', minHeight: 300, background: 'var(--vc-gray-200)' }}>
              <iframe
                title="VisioCreate Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.698!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMzLjYiTiAxMDbCsDQxJzUyLjgiRQ!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s"
                width="100%" height="100%" style={{ border: 0, minHeight: 300 }}
                allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Features Strip */}
        <div className="features-strip" style={{ margin: '0 0 40px' }}>
          <div className="row">
            {[
              { icon: 'bi-truck', title: 'Free Shipping', sub: 'Order above $200' },
              { icon: 'bi-cash-coin', title: 'Money-back', sub: '30 days guarantee' },
              { icon: 'bi-lock', title: 'Secure Payments', sub: 'Secured by Stripe' },
              { icon: 'bi-telephone', title: '24/7 Support', sub: 'Phone and Email support' },
            ].map(f => (
              <div key={f.title} className="col-6 col-md-3 mb-3 mb-md-0">
                <div className="feature-item">
                  <i className={`bi ${f.icon}`}></i>
                  <div><div className="title">{f.title}</div><div className="subtitle">{f.sub}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
