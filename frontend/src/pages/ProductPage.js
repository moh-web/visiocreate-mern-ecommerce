import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Newsletter from '../components/Newsletter';

const Stars = ({ rating, interactive = false, value = 0, onChange }) => {
  const display = interactive ? value : Math.round(rating || 0);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i}
          className={`bi ${i <= display ? 'bi-star-fill' : 'bi-star'}`}
          style={{ cursor: interactive ? 'pointer' : 'default', color: i <= display ? '#e8a030' : '#ccc', fontSize: interactive ? 22 : 'inherit' }}
          onClick={() => interactive && onChange && onChange(i)}
        ></i>
      ))}
    </span>
  );
};

const Countdown = () => {
  const [time, setTime] = useState({ d: 2, h: 12, m: 45, s: 5 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d = Math.max(0, d - 1); }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="countdown">
      {[['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']].map(([k, label]) => (
        <div key={k} className="countdown-unit">
          <span className="num">{String(time[k]).padStart(2, '0')}</span>
          <span className="label">{label}</span>
        </div>
      ))}
    </div>
  );
};

const TABS = [
  { key: 'additionalInfo', label: 'Additional Info' },
  { key: 'questions', label: 'Questions' },
  { key: 'reviews', label: 'Reviews' },
];

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [wishlist, setWishlist] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const handleAddToCart = () => {
    const color = product.colors?.[selectedColor] || null;
    addToCart(product, color, qty);
    showToast(`${product.name} added to cart`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { showToast('Please sign in to leave a review', 'error'); navigate('/signin'); return; }
    if (!reviewText.trim()) { showToast('Please write a comment', 'error'); return; }
    setSubmittingReview(true);
    try {
      await API.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      showToast('Review submitted successfully!');
      setReviewText('');
      setReviewRating(5);
      setShowReviewForm(false);
      await fetchProduct();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getImgSrc = (idx) => {
    if (product?.images?.[idx]) return `http://localhost:5000${product.images[idx]}`;
    return `https://placehold.co/480x480/f0f0ee/888888?text=${encodeURIComponent(product?.name || 'Product')}`;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  if (error) return (
    <div className="container py-5 text-center">
      <i className="bi bi-exclamation-circle" style={{ fontSize: 48, color: 'var(--vc-gray-500)' }}></i>
      <h3 className="mt-3">{error}</h3>
      <button className="btn-dark-vc mt-3" onClick={() => navigate('/shop')}>Back to Shop</button>
    </div>
  );

  if (!product) return null;

  return (
    <div>
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav className="breadcrumb-custom mb-4" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/shop">Shop</Link>
          <span className="mx-2">›</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <span className="mx-2">›</span>
          <span>{product.name}</span>
        </nav>

        <div className="row g-4 g-lg-5">
          {/* Gallery */}
          <div className="col-md-5">
            <div className="product-gallery">
              <div className="main-img">
                <img src={product.images[0]} alt={product.name}  style={{ maxHeight: 380, objectFit: 'contain', width: '100%' }} />
              </div>
              {product.images?.length > 0 && (
                <div className="thumbs mt-3">
                  {(product.images.length > 0 ? product.images : ['placeholder']).map((img, i) => (
                    <div key={i} className={`thumb ${selectedImg === i ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                      <img src={img ? `http://localhost:5000${img}` : `https://placehold.co/72x72/f0f0ee/888?text=+`} alt={`View ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-7">
            <div className="product-detail-info">
              <div className="rating-row">
                <Stars rating={product.rating} />
                <span className="count ms-2">{product.numReviews} Review{product.numReviews !== 1 ? 's' : ''}</span>
              </div>

              <h1>{product.name}</h1>

              <div className="price-row">
                <span className="price">${Number(product.price).toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="original ms-2">${Number(product.originalPrice).toFixed(2)}</span>
                )}
                {product.discount > 0 && (
                  <span className="badge ms-2" style={{ background: '#2a9a4a', fontSize: 12 }}>-{product.discount}%</span>
                )}
              </div>

              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 20 }}>{product.description}</p>

              {product.originalPrice && (
                <div className="mb-4">
                  <div style={{ fontSize: 13, color: 'var(--vc-gray-500)', marginBottom: 8, fontWeight: 500 }}>Offer expires in:</div>
                  <Countdown />
                </div>
              )}

              {product.measurements && (
                <div className="mb-3">
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--vc-gray-500)', marginBottom: 4 }}>Measurements</div>
                  <div style={{ fontSize: 14 }}>{product.measurements}</div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div className="mb-4">
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--vc-gray-500)', marginBottom: 6 }}>
                    Choose Color
                  </div>
                  <div style={{ fontSize: 14, marginBottom: 10, fontWeight: 500 }}>{product.colors[selectedColor]?.name}</div>
                  <div className="color-picker">
                    {product.colors.map((c, i) => (
                      <div key={i} className={`color-swatch ${selectedColor === i ? 'active' : ''}`}
                        onClick={() => setSelectedColor(i)}
                        title={c.name}>
                        {c.image
                          ? <img src={c.images[0]} alt={c.name}  />
                          : <div style={{ width: '100%', height: '100%', background: c.hex || '#ddd', borderRadius: 5 }}></div>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Qty + Wishlist */}
              <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
                <div className="qty-control">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <button
                  className={`btn-wishlist${wishlist ? ' active' : ''}`}
                  onClick={() => setWishlist(w => !w)}>
                  <i className={`bi ${wishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  {wishlist ? ' Wishlisted' : ' Wishlist'}
                </button>
              </div>

              <button className="btn-addcart mb-4" onClick={handleAddToCart}>
                <i className="bi bi-bag-plus me-2"></i>Add to Cart
              </button>

              <div style={{ fontSize: 12, color: 'var(--vc-gray-500)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span><strong style={{ color: 'var(--vc-dark)' }}>SKU:</strong> {product.sku || 'N/A'}</span>
                <span><strong style={{ color: 'var(--vc-dark)' }}>Category:</strong> {product.category}</span>
                {product.stock !== undefined && (
                  <span style={{ color: product.stock > 0 ? 'var(--vc-green)' : '#e05050' }}>
                    <i className={`bi ${product.stock > 0 ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs mt-5">
          <div className="nav-tabs">
            {TABS.map(tab => (
              <button key={tab.key}
                className={`nav-link${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {/* Additional Info Tab */}
            {activeTab === 'additionalInfo' && (
              <div>
                <table style={{ fontSize: 14, width: '100%', maxWidth: 500 }}>
                  <tbody>
                    {[
                      ['Measurements', product.measurements || 'N/A'],
                      ['Category', product.category],
                      ['SKU', product.sku || 'N/A'],
                      ['Stock', product.stock ? `${product.stock} units` : '0 units'],
                      ['Discount', product.discount ? `${product.discount}%` : 'None'],
                    ].map(([label, value]) => (
                      <tr key={label} style={{ borderBottom: '1px solid var(--vc-border)' }}>
                        <td style={{ padding: '10px 16px 10px 0', fontWeight: 600, color: '#333', width: 150 }}>{label}</td>
                        <td style={{ padding: '10px 0', color: '#555' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div className="empty-state">
                <i className="bi bi-question-circle" style={{ fontSize: 48, color: 'var(--vc-gray-500)', display: 'block', marginBottom: 12 }}></i>
                <p style={{ color: 'var(--vc-gray-500)' }}>No questions yet. Be the first to ask!</p>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Review header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <Stars rating={product.rating} />
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{Number(product.rating).toFixed(1)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--vc-gray-500)' }}>
                      {product.numReviews} Review{product.numReviews !== 1 ? 's' : ''} for <strong>{product.name}</strong>
                    </div>
                  </div>
                  <button className="btn-dark-vc" onClick={() => setShowReviewForm(f => !f)}>
                    <i className="bi bi-pencil me-2"></i>Write Review
                  </button>
                </div>

                {/* Review form */}
                {showReviewForm && (
                  <form onSubmit={handleReview} className="mb-4 p-4" style={{ background: 'var(--vc-gray-100)', borderRadius: 12 }}>
                    <h6 style={{ fontWeight: 600, marginBottom: 12 }}>Your Review</h6>
                    <div className="mb-3">
                      <label style={{ fontSize: 12, color: 'var(--vc-gray-500)', display: 'block', marginBottom: 6 }}>Rating</label>
                      <Stars interactive value={reviewRating} onChange={setReviewRating} />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: 12, color: 'var(--vc-gray-500)', display: 'block', marginBottom: 6 }}>Comment</label>
                      <textarea className="vc-input" rows={4} placeholder="Share your experience with this product..."
                        value={reviewText} onChange={e => setReviewText(e.target.value)} required
                        style={{ resize: 'vertical' }} />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn-dark-vc" disabled={submittingReview}>
                        {submittingReview ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        Submit Review
                      </button>
                      <button type="button" className="btn-outline-vc" onClick={() => setShowReviewForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* Review list */}
                {!product.reviews || product.reviews.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-chat-dots" style={{ fontSize: 48, color: 'var(--vc-gray-500)', display: 'block', marginBottom: 12 }}></i>
                    <p style={{ color: 'var(--vc-gray-500)' }}>No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 style={{ fontWeight: 600, margin: 0 }}>{product.reviews.length} Review{product.reviews.length !== 1 ? 's' : ''}</h6>
                      <select style={{ border: '1px solid var(--vc-border)', borderRadius: 6, padding: '6px 12px', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}>
                        <option>Newest</option>
                        <option>Oldest</option>
                        <option>Highest Rated</option>
                      </select>
                    </div>
                    {product.reviews.map((r, i) => (
                      <div key={i} className="review-item">
                        <div className="d-flex gap-3">
                          <img className="avatar" style={{ flexShrink: 0 }}
                            src={r.avatar
                              ? `http://localhost:5000${r.avatar}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name || 'User')}&background=e0e0de&color=888&size=40`}
                            alt={r.name} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="reviewer-name">{r.name}</div>
                            <Stars rating={r.rating} />
                            {r.createdAt && (
                              <div style={{ fontSize: 11, color: 'var(--vc-gray-500)', marginTop: 2 }}>
                                {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                            )}
                            <div className="comment mt-2">{r.comment}</div>
                            <div className="action-btns mt-2">
                              <button><i className="bi bi-hand-thumbs-up me-1"></i>Like</button>
                              <button><i className="bi bi-reply me-1"></i>Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};

export default ProductPage;
