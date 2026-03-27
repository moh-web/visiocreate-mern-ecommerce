import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../utils/api';
import CheckoutSteps from '../components/CheckoutSteps';

const CheckoutPage = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Values passed from CartPage
  const {
    shippingId = 'free',
    shippingCost = 0,
    couponDiscount = 0,
    couponCode = '',
    total: passedTotal,
  } = location.state || {};

  const total = passedTotal ?? (subtotal + shippingCost - couponDiscount);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    email: user?.email || '',
    street: user?.address?.street || '',
    country: user?.address?.country || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expDate: '',
    cvc: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--vc-gray-500)' }}>Add products before checking out.</p>
        <Link to="/shop" className="btn-dark-vc" style={{ display: 'inline-block', marginTop: 16 }}>Shop Now</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.country || !form.city) {
      showToast('Please fill in all required shipping fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(i => ({
          product: i._id,
          name: i.name,
          image: i.image,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
        })),
        contactInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
        },
        shippingAddress: {
          street: form.street,
          country: form.country,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
        paymentMethod: form.paymentMethod,
        shippingMethod: shippingId,
        shippingCost,
        subtotal,
        discount: couponDiscount,
        couponCode,
        total,
      };
      const { data } = await API.post('/orders', orderData);
      clearCart();
      navigate('/order-complete', { state: { order: data } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getImg = (item) => item.image
    ? `http://localhost:5000${item.image}`
    : `https://placehold.co/52x52/f0f0ee/888?text=${encodeURIComponent((item.name || 'P')[0])}`;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Check Out</h1>
      <CheckoutSteps currentStep={2} />

      <form onSubmit={handleSubmit}>
        <div className="row g-4 mt-2">

          {/* Left column: forms */}
          <div className="col-lg-7">

            {/* Contact Info */}
            <div className="checkout-card">
              <h5>Contact Information</h5>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label-sm">First Name</label>
                  <input className="vc-input" placeholder="First name" value={form.firstName}
                    onChange={e => set('firstName', e.target.value)} required />
                </div>
                <div className="col-6">
                  <label className="form-label-sm">Last Name</label>
                  <input className="vc-input" placeholder="Last name" value={form.lastName}
                    onChange={e => set('lastName', e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label-sm">Phone Number</label>
                  <input className="vc-input" placeholder="Phone number" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label-sm">Email Address</label>
                  <input className="vc-input" type="email" placeholder="Your Email" value={form.email}
                    onChange={e => set('email', e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="checkout-card">
              <h5>Shipping Address</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-sm">Street Address *</label>
                  <input className="vc-input" placeholder="Street Address" value={form.street}
                    onChange={e => set('street', e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label-sm">Country *</label>
                  <select className="vc-select" value={form.country} onChange={e => set('country', e.target.value)} required>
                    <option value="">Select Country</option>
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Vietnam', 'Egypt', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label-sm">Town / City *</label>
                  <input className="vc-input" placeholder="Town / City" value={form.city}
                    onChange={e => set('city', e.target.value)} required />
                </div>
                <div className="col-6">
                  <label className="form-label-sm">State</label>
                  <input className="vc-input" placeholder="State" value={form.state}
                    onChange={e => set('state', e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label-sm">Zip Code</label>
                  <input className="vc-input" placeholder="Zip Code" value={form.zipCode}
                    onChange={e => set('zipCode', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-card">
              <h5>Payment Method</h5>
              {['Credit Card', 'PayPal'].map(pm => (
                <div key={pm}
                  className={`payment-option${form.paymentMethod === pm ? ' selected' : ''}`}
                  onClick={() => set('paymentMethod', pm)}>
                  <input type="radio" readOnly checked={form.paymentMethod === pm} onChange={() => {}} />
                  <span style={{ fontSize: 14, flex: 1 }}>{pm === 'Credit Card' ? 'Pay by Card Credit' : 'PayPal'}</span>
                  <i className={`bi ${pm === 'Credit Card' ? 'bi-credit-card' : 'bi-paypal'}`}></i>
                </div>
              ))}

              {form.paymentMethod === 'Credit Card' && (
                <div className="row g-3 mt-2">
                  <div className="col-12">
                    <label className="form-label-sm">Card Number</label>
                    <input className="vc-input" placeholder="1234 1234 1234 1234"
                      value={form.cardNumber} onChange={e => set('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} />
                  </div>
                  <div className="col-6">
                    <label className="form-label-sm">Expiration Date</label>
                    <input className="vc-input" placeholder="MM/YY" value={form.expDate}
                      onChange={e => set('expDate', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label-sm">CVC</label>
                    <input className="vc-input" placeholder="CVC" value={form.cvc}
                      onChange={e => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Order Summary */}
          <div className="col-lg-4 offset-lg-1">
            <div className="cart-summary" style={{ position: 'sticky', top: 80 }}>
              <h5 style={{ fontFamily: 'var(--font-serif)', marginBottom: 20 }}>Order Summary</h5>

              {/* Items list */}
              <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 16 }}>
                {cart.map(item => (
                  <div key={item.key} className="d-flex gap-3 align-items-center mb-3">
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={getImg(item)}
                        alt={item.name}
                        style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8, background: 'var(--vc-gray-100)', padding: 4 }}
                        onError={e => { e.target.src = `https://placehold.co/52x52/f0f0ee/888?text=+`; }}
                      />
                      <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--vc-dark)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--vc-gray-500)' }}>Color: {item.color}</div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon display */}
              {couponCode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#2a9a4a', marginBottom: 8 }}>
                  <span><i className="bi bi-tag me-1"></i>{couponCode}</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <hr style={{ margin: '12px 0' }} />
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                <span>Shipping</span>
                <span style={{ color: shippingCost === 0 ? '#2a9a4a' : 'inherit' }}>
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 pt-2" style={{ fontWeight: 700, fontSize: 17, borderTop: '1px solid var(--vc-border)' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button type="submit" className="btn-place-order" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</>
                  : 'Place Order'
                }
              </button>

              <Link to="/cart" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--vc-gray-500)' }}>
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
