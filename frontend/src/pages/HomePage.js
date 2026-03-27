// ============================================
// pages/HomePage.js - الصفحة الرئيسية
// ============================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';

// بيانات الـ Slider
const SLIDES = [
  {
    title: 'Transform Your Space, Elevate Your Life',
    desc:  'VisioCreate is a gift & decorations store based in HCMC, Vietnam. Est since 2019.',
    bg:    'linear-gradient(135deg, #2e5060 0%, #3a6a7a 100%)',
  },
  {
    title: 'Discover Modern Living Designs',
    desc:  'Handpicked furniture and decor for every room in your home.',
    bg:    'linear-gradient(135deg, #5c3a2a 0%, #7a5040 100%)',
  },
  {
    title: 'New Arrivals Every Week',
    desc:  'Fresh styles and seasonal collections updated regularly.',
    bg:    'linear-gradient(135deg, #2a3c50 0%, #3a5060 100%)',
  },
];

function HomePage() {
  const navigate = useNavigate();

  // ---- State ----
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newArrivals, setNewArrivals]   = useState([]);
  const [blogs, setBlogs]               = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  // ---- Auto-advance slider كل 5 ثواني ----
  useEffect(function () {
    const timer = setInterval(function () {
      setCurrentSlide(function (prev) {
        return (prev + 1) % SLIDES.length;
      });
    }, 5000);

    // cleanup: إيقاف الـ timer عند تدمير الكومبوننت
    return function () {
      clearInterval(timer);
    };
  }, []);

  // ---- جلب البيانات من الـ API ----
  useEffect(function () {
    async function fetchHomeData() {
      try {
        // جلب المنتجات الجديدة والمقالات في نفس الوقت
        const [productsResponse, blogsResponse] = await Promise.all([
  API.get('/products/new-arrivals'),
  API.get('/blog', { params: { limit: 3 } })
]);

        setNewArrivals(productsResponse.data || []);
        setBlogs(blogsResponse.data?.blogs || []);
      } catch (error) {
        console.error('Error fetching home data:', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeData();
  }, []); // [] = نشغلها مرة واحدة فقط عند التحميل

  // ---- التنقل في الـ Slider ----
  function goToPrevSlide() {
    setCurrentSlide(function (prev) {
      return (prev - 1 + SLIDES.length) % SLIDES.length;
    });
  }

  function goToNextSlide() {
    setCurrentSlide(function (prev) {
      return (prev + 1) % SLIDES.length;
    });
  }

  // مقالات placeholder لو قاعدة البيانات فارغة
  const PLACEHOLDER_BLOGS = [
    { title: '7 ways to decor your home', date: 'October 16, 2023' },
    { title: 'Kitchen organization tips',   date: 'October 16, 2023' },
    { title: 'Decor your bedroom',          date: 'October 16, 2023' },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : PLACEHOLDER_BLOGS;

  return (
    <div>
      <div className="container">

        {/* ==================== HERO SLIDER ==================== */}
        <div className="hero-slider" style={{ background: SLIDES[currentSlide].bg }}>
          <div className="hero-content">
            <h1>{SLIDES[currentSlide].title}</h1>
            <p>{SLIDES[currentSlide].desc}</p>
            <button className="btn-hero" onClick={function () { navigate('/shop'); }}>
              Shop Now →
            </button>
          </div>

          {/* أسهم التنقل */}
          <button className="hero-nav-btn left" onClick={goToPrevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="hero-nav-btn right" onClick={goToNextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>

          {/* نقاط المؤشر */}
          <div className="hero-dots">
            {SLIDES.map(function (slide, index) {
              return (
                <button
                  key={index}
                  className={'hero-dot' + (index === currentSlide ? ' active' : '')}
                  onClick={function () { setCurrentSlide(index); }}
                ></button>
              );
            })}
          </div>
        </div>

        {/* ==================== CATEGORY GRID ==================== */}
        <div className="category-grid mt-4">
          <div className="category-card large" onClick={function () { navigate('/shop?category=Living+Room'); }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #e8e4dc, #d4cec4)', borderRadius: 12 }}></div>
            <div style={{ position: 'relative' }}>
              <h3>Living Room</h3>
              <Link to="/shop?category=Living+Room" onClick={function (e) { e.stopPropagation(); }} style={{ fontSize: 13, fontWeight: 500 }}>
                Shop Now →
              </Link>
            </div>
          </div>

          <div className="category-card" onClick={function () { navigate('/shop?category=Bedroom'); }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #eee8e0, #ddd4c8)', borderRadius: 12 }}></div>
            <div style={{ position: 'relative' }}>
              <h3>Bedroom</h3>
              <Link to="/shop?category=Bedroom" onClick={function (e) { e.stopPropagation(); }} style={{ fontSize: 13, fontWeight: 500 }}>
                Shop Now →
              </Link>
            </div>
          </div>

          <div className="category-card" onClick={function () { navigate('/shop?category=Kitchen'); }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #ece6de, #dcd6cc)', borderRadius: 12 }}></div>
            <div style={{ position: 'relative' }}>
              <h3>Kitchen</h3>
              <Link to="/shop?category=Kitchen" onClick={function (e) { e.stopPropagation(); }} style={{ fontSize: 13, fontWeight: 500 }}>
                Shop Now →
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== NEW ARRIVALS ==================== */}
        <div className="section-header mt-5">
          <h2>New Arrivals</h2>
          <Link to="/shop">More Products →</Link>
        </div>

        {isLoading ? (
          /* Skeleton loading */
          <div className="row g-3">
            {[1, 2, 3, 4, 5].map(function (i) {
              return (
                <div key={i} className="col-6 col-md-4 col-lg">
                  <div className="product-card" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    <div className="card-img-wrap">
                      <div style={{ width: '100%', aspectRatio: '1', background: 'var(--vc-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="spinner-border spinner-border-sm"></div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ height: 10, background: 'var(--vc-gray-200)', borderRadius: 4, marginBottom: 8, width: '70%' }}></div>
                      <div style={{ height: 10, background: 'var(--vc-gray-200)', borderRadius: 4, width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : newArrivals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--vc-gray-500)' }}>
            <p>No products yet. <Link to="/shop">Browse all products</Link></p>
          </div>
        ) : (
          <div className="row g-3">
            {newArrivals.map(function (product) {
              return (
                <div key={product._id} className="col-6 col-md-4 col-lg">
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================== FEATURES STRIP ==================== */}
      <div className="container">
        <div className="features-strip">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="bi bi-truck"></i>
                <div>
                  <div className="title">Free Shipping</div>
                  <div className="subtitle">Order above $200</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="bi bi-arrow-counterclockwise"></i>
                <div>
                  <div className="title">Money-back</div>
                  <div className="subtitle">30 days guarantee</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="bi bi-shield-lock"></i>
                <div>
                  <div className="title">Secure Payments</div>
                  <div className="subtitle">Secured by Stripe</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="bi bi-telephone"></i>
                <div>
                  <div className="title">24/7 Support</div>
                  <div className="subtitle">Phone and Email support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PROMO BANNER ==================== */}
      <div className="container mb-2">
        <div className="promo-banner">
          <div className="promo-img">
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #c8b8a4, #a89878)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-house" style={{ fontSize: 100, color: 'rgba(255,255,255,0.2)' }}></i>
            </div>
          </div>
          <div className="promo-content">
            <div className="tag">SALE UP TO 35% OFF</div>
            <h2>HUNDREDS of New lower prices!</h2>
            <p style={{ fontSize: 14, color: 'var(--vc-gray-500)', lineHeight: 1.7, marginBottom: 24 }}>
              It's more affordable than ever to give every room in your home a stylish makeover
            </p>
            <button className="btn-dark-vc" onClick={function () { navigate('/shop'); }}>
              Shop Now →
            </button>
          </div>
        </div>
      </div>

      {/* ==================== ARTICLES ==================== */}
      <div className="container my-5">
        <div className="section-header">
          <h2>Articles</h2>
          <Link to="/blog">More Articles →</Link>
        </div>

        <div className="row g-4">
          {displayBlogs.map(function (blog, index) {
            return (
              <div key={blog._id || index} className="col-md-4">
                <div
                  className="blog-card"
                  style={{ cursor: blog._id ? 'pointer' : 'default' }}
                  onClick={function () { if (blog._id) navigate('/blog/' + blog._id); }}
                >
                  {/* صورة المقال */}
                  <div className="img-wrap">
                    {blog.image ? (
                      <img src={'http://localhost:5000' + blog.image} alt={blog.title} />
                    ) : (
                      <div style={{ background: 'hsl(' + (30 + index * 20) + ', 20%, 88%)', height: '100%', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-image" style={{ fontSize: 36, opacity: 0.2 }}></i>
                      </div>
                    )}
                  </div>

                  <h5 style={{ marginTop: 14, marginBottom: 4, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, lineHeight: 1.5 }}>
                    {blog.title}
                  </h5>

                  <div className="date">
                    {blog.date || (blog.createdAt && new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}
                  </div>

                  <span className="read-more mt-2" style={{ display: 'block' }}>Read More →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== NEWSLETTER ==================== */}
      <Newsletter />
    </div>
  );
}

export default HomePage;
