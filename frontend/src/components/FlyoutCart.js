// ============================================
// components/FlyoutCart.js - سلة التسوق الجانبية
// ============================================
// تظهر من اليمين عند الضغط على أيقونة السلة

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function FlyoutCart({ onClose }) {
  const { cart, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  // تحديد صورة المنتج
  function getImageUrl(item) {
    if (item.image) {
      return 'http://localhost:5000' + item.image;
    }
    return 'https://placehold.co/64x64/f0f0ee/888?text=' + encodeURIComponent(item.name[0]);
  }

  // الانتقال لصفحة الدفع
  function handleCheckout() {
    onClose();
    navigate('/checkout');
  }

  // الانتقال لصفحة السلة الكاملة
  function handleViewCart() {
    onClose();
    navigate('/cart');
  }

  return (
    <>
      {/* خلفية شفافة داكنة - عند الضغط عليها تغلق السلة */}
      <div className="flyout-backdrop" onClick={onClose} />

      {/* السلة الجانبية */}
      <div className="flyout-cart">

        {/* الهيدر */}
        <div className="cart-header">
          <h4>Cart</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* قائمة المنتجات */}
        <div className="cart-items">
          {cart.length === 0 ? (
            /* رسالة لو السلة فارغة */
            <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--vc-gray-500)' }}>
              <i className="bi bi-bag" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}></i>
              <p style={{ margin: 0 }}>Your cart is empty</p>
            </div>
          ) : (
            /* عرض المنتجات */
            cart.map(function (item) {
              return (
                <div key={item.key} className="cart-item">
                  {/* صورة المنتج */}
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    onError={function (e) { e.target.src = 'https://placehold.co/64x64/f0f0ee/888?text=+'; }}
                  />

                  {/* بيانات المنتج */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="name">{item.name}</div>
                    <div className="color">Color: {item.color}</div>

                    {/* التحكم في الكمية */}
                    <div style={{ marginTop: 8 }}>
                      <div className="qty-control" style={{ transform: 'scale(0.82)', transformOrigin: 'left center' }}>
                        <button onClick={function () { updateQty(item.key, item.quantity - 1); }}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={function () { updateQty(item.key, item.quantity + 1); }}>+</button>
                      </div>
                    </div>
                  </div>

                  {/* السعر وزرار الحذف */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      className="remove"
                      onClick={function () { removeFromCart(item.key); }}
                      style={{ fontSize: 18, lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* الفوتر مع المجموع وأزرار الدفع */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="totals">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="totals grand">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button className="btn-checkout-full" onClick={handleCheckout}>
              Checkout
            </button>

            <button
              onClick={handleViewCart}
              style={{ display: 'block', width: '100%', marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, textDecoration: 'underline', color: 'var(--vc-dark)', fontFamily: 'var(--font-sans)' }}
            >
              View Cart
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default FlyoutCart;
