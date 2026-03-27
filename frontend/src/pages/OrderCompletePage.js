import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const OrderCompletePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle" style={{ fontSize: 48, color: 'var(--vc-gray-500)', display: 'block', marginBottom: 16 }}></i>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>No order found</h2>
        <p style={{ color: 'var(--vc-gray-500)' }}>You may have already seen this page or navigated here directly.</p>
        <Link to="/" className="btn-dark-vc" style={{ display: 'inline-block', marginTop: 16 }}>Go Home</Link>
      </div>
    );
  }

  const getImg = (item) => item.image
    ? `http://localhost:5000${item.image}`
    : `https://placehold.co/72x72/f0f0ee/888?text=${encodeURIComponent((item.name || 'P')[0])}`;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Complete!</h1>
      <CheckoutSteps currentStep={3} />

      <div className="order-complete-card mt-5">
        {/* Celebration header */}
        <div style={{ fontSize: 32, marginBottom: 4 }}>🎉</div>
        <p style={{ color: 'var(--vc-gray-500)', fontSize: 14, marginBottom: 8 }}>Thank you!</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 28 }}>
          Your order has been received
        </h2>

        {/* Product thumbnails */}
        {order.items?.length > 0 && (
          <div className="order-imgs mb-4">
            {order.items.slice(0, 4).map((item, i) => (
              <div key={i} className="order-img-wrap">
                <img
                  src={getImg(item)}
                  alt={item.name}
                  onError={e => { e.target.src = `https://placehold.co/72x72/f0f0ee/888?text=+`; }}
                />
                <span className="qty-badge">{item.quantity}</span>
              </div>
            ))}
            {order.items.length > 4 && (
              <div style={{ width: 72, height: 72, borderRadius: 8, background: 'var(--vc-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--vc-gray-500)', fontWeight: 600 }}>
                +{order.items.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Order details table */}
        <div style={{ borderTop: '1px solid var(--vc-border)', paddingTop: 20, marginBottom: 24, textAlign: 'left' }}>
          {[
            ['Order code:', order.orderCode],
            ['Date:', new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ['Total:', `$${Number(order.total).toFixed(2)}`],
            ['Payment method:', order.paymentMethod],
          ].map(([label, value]) => (
            <div key={label} className="order-detail-row">
              <span className="label">{label}</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button className="btn-addcart" style={{ minWidth: 180 }} onClick={() => navigate('/account/orders')}>
            <i className="bi bi-bag me-2"></i>Purchase History
          </button>
          <Link to="/shop" className="btn-outline-vc" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
