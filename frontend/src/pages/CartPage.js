import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const SHIPPING_OPTIONS = [
  { id: 'free', label: 'Free shipping', cost: 0, display: '$0.00' },
  { id: 'express', label: 'Express shipping', cost: 15, display: '+$15.00' },
  { id: 'pickup', label: 'Pick Up', cost: 0, display: 'Free', note: 'Collect in store' },
];

const VALID_COUPONS = { 'SAVE25': 25, 'SAVE10': 10, 'WELCOME': 15 };

const CartPage = () => {
  const { cart, removeFromCart, updateQty, subtotal } = useCart();
  const [shippingId, setShippingId] = useState('free');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shippingId)?.cost || 0;
  const couponDiscount = appliedCoupon ? (VALID_COUPONS[appliedCoupon] || 0) : 0;
  const total = Math.max(0, subtotal + shippingCost - couponDiscount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
      setCoupon('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const getImg = (item) => item.image
    ? `http://localhost:5000${item.image}`
    : `https://placehold.co/64x64/f0f0ee/888888?text=${encodeURIComponent((item.name || 'P')[0])}`;

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="text-center mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Cart</h1>
        <CheckoutSteps currentStep={1} />
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--vc-gray-500)' }}>
          <i className="bi bi-bag" style={{ fontSize: 64, display: 'block', marginBottom: 16 }}></i>
          <h4 style={{ color: 'var(--vc-dark)', marginBottom: 8 }}>Your cart is empty</h4>
          <p>Add some products to get started</p>
          <Link to="/shop" className="btn-dark-vc" style={{ display: 'inline-block', marginTop: 16 }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Cart</h1>
      <CheckoutSteps currentStep={1} />

      <div className="row g-4 mt-2">
        {/* Cart Items */}
        <div className="col-lg-7">
          <table className="cart-table w-100">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-center">Quantity</th>
                <th className="text-end">Price</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.key}>
                  <td style={{ minWidth: 200 }}>
                    <div className="d-flex gap-3 align-items-start">
                      <img
                        className="cart-item-img"
                        src={getImg(item)}
                        alt={item.name}
                        onError={e => { e.target.src = `https://placehold.co/64x64/f0f0ee/888?text=+`; }}
                      />
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-color">Color: {item.color}</div>
                        <button className="cart-remove-btn" onClick={() => removeFromCart(item.key)}>
                          <i className="bi bi-x me-1"></i>Remove
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-inline-flex qty-control">
                      <button onClick={() => updateQty(item.key, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.key, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td className="text-end" style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
                    ${Number(item.price).toFixed(2)}
                  </td>
                  <td className="text-end" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Coupon */}
          <div className="coupon-section mt-4">
            <h6 style={{ fontWeight: 700 }}>Have a coupon?</h6>
            <p style={{ fontSize: 13, color: 'var(--vc-gray-500)', marginBottom: 12 }}>
              Add your code for an instant cart discount
            </p>
            {appliedCoupon ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f0faf4', border: '1.5px solid #2a9a4a', borderRadius: 8 }}>
                <i className="bi bi-tag-fill" style={{ color: '#2a9a4a' }}></i>
                <span style={{ fontSize: 14, color: '#2a9a4a', fontWeight: 600 }}>"{appliedCoupon}" — -${couponDiscount}.00 off</span>
                <button onClick={removeCoupon} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#e05050', cursor: 'pointer', fontSize: 13 }}>Remove</button>
              </div>
            ) : (
              <>
                <div className="coupon-input">
                  <i className="bi bi-tag ms-3" style={{ color: 'var(--vc-gray-500)' }}></i>
                  <input
                    placeholder="Coupon Code (try SAVE25)"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  />
                  <button onClick={applyCoupon}>Apply</button>
                </div>
                {couponError && <div style={{ fontSize: 12, color: '#e05050', marginTop: 6 }}>{couponError}</div>}
              </>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-lg-4 offset-lg-1">
          <div className="cart-summary">
            <h5 style={{ fontFamily: 'var(--font-serif)', marginBottom: 20 }}>Cart Summary</h5>

            {/* Shipping options */}
            {SHIPPING_OPTIONS.map(s => (
              <div
                key={s.id}
                className={`shipping-option${shippingId === s.id ? ' selected' : ''}`}
                onClick={() => setShippingId(s.id)}>
                <input type="radio" readOnly checked={shippingId === s.id} onChange={() => {}} />
                <label style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }}>
                  <span>{s.label}{s.note && <span style={{ fontSize: 11, color: 'var(--vc-gray-500)', marginLeft: 6 }}>({s.note})</span>}</span>
                  <span style={{ fontWeight: 500 }}>{s.display}</span>
                </label>
              </div>
            ))}

            <hr style={{ margin: '16px 0' }} />

            {/* Totals */}
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {shippingCost > 0 && (
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                <span>Shipping</span>
                <span>+${shippingCost.toFixed(2)}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14, color: '#2a9a4a' }}>
                <span>Discount ({appliedCoupon})</span>
                <span>-${couponDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-4 pt-2" style={{ fontWeight: 700, fontSize: 17, borderTop: '1px solid var(--vc-border)' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn-addcart w-100"
              onClick={() => navigate('/checkout', { state: { shippingId, shippingCost, couponDiscount, couponCode: appliedCoupon, total } })}>
              Checkout
            </button>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--vc-gray-500)' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
