// ============================================
// components/ProductCard.js - كارد المنتج
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// ---- مكون صغير لعرض النجوم ----
function StarRating({ rating }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(rating || 0)) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
  }

  return <span className="stars">{stars}</span>;
}

// ---- الكومبوننت الرئيسي ----
function ProductCard({ product }) {
  const navigate    = useNavigate();
  const { addToCart }  = useCart();
  const { showToast }  = useToast();

  // تحديد مصدر الصورة
  let imageSrc = '';
  if (product.images && product.images.length > 0) {
    imageSrc = 'http://localhost:5000' + product.images[0];
  } else {
    // صورة placeholder لو مفيش صورة
    imageSrc = 'https://placehold.co/300x300/f0f0ee/888888?text=' + encodeURIComponent(product.name || 'Product');
  }

  // فتح صفحة المنتج
  function handleCardClick() {
    navigate('/product/' + product._id);
  }

  // إضافة للسلة (بدون فتح صفحة المنتج)
  function handleAddToCart(e) {
    e.stopPropagation(); // منع فتح صفحة المنتج
    addToCart(product);
    showToast(product.name + ' added to cart');
  }

  // لو الصورة فشلت في التحميل
  function handleImageError(e) {
    e.target.src = 'https://placehold.co/300x300/f0f0ee/888888?text=No+Image';
  }

  return (
    <div className="product-card" onClick={handleCardClick}>

      {/* ---- قسم الصورة ---- */}
      <div className="card-img-wrap">

        {/* شارات NEW و الخصم */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 1 }}>
          {product.isNew && (
            <span className="badge badge-new">NEW</span>
          )}
          {product.discount > 0 && (
            <span className="badge badge-discount">-{product.discount}%</span>
          )}
        </div>

        {/* الصورة */}
        <img
          src={imageSrc}
          alt={product.name}
          onError={handleImageError}
        />

        {/* زرار "Add to cart" يظهر عند hover */}
        <div className="add-to-cart-overlay" onClick={handleAddToCart}>
          <i className="bi bi-bag-plus me-2"></i>
          Add to cart
        </div>

        {/* زرار المفضلة */}
        <button
          className="wishlist-btn"
          onClick={function (e) { e.stopPropagation(); }}
          aria-label="Add to wishlist"
        >
          <i className="bi bi-heart"></i>
        </button>
      </div>

      {/* ---- قسم المعلومات ---- */}
      <div className="card-body">
        <StarRating rating={product.rating} />
        <div className="product-name">{product.name}</div>
        <div className="d-flex align-items-center gap-2 mt-1">
          <span className="price">${Number(product.price).toFixed(2)}</span>
          {product.originalPrice && (
            <span className="price-original">${Number(product.originalPrice).toFixed(2)}</span>
          )}
        </div>
      </div>

    </div>
  );
}

export default ProductCard;
