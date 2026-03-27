import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';

const CATEGORIES = ['All Rooms', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Outdoor'];
const PRICE_RANGES = [
  { label: 'All Price', min: null, max: null },
  { label: '$0.00 - $99.99', min: 0, max: 99.99 },
  { label: '$100.00 - $199.99', min: 100, max: 199.99 },
  { label: '$200.00 - $299.99', min: 200, max: 299.99 },
  { label: '$300.00 - $399.99', min: 300, max: 399.99 },
  { label: '$400.00+', min: 400, max: null },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid3');

  const category = searchParams.get('category') || 'All Rooms';
  const priceIdx = parseInt(searchParams.get('priceIdx') || '0');
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const LIMIT = 9;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const range = PRICE_RANGES[priceIdx] || PRICE_RANGES[0];
        const params = { page, limit: LIMIT };
        if (sort) params.sort = sort;
        if (category !== 'All Rooms') params.category = category;
        if (priceIdx > 0 && range.min !== null) params.minPrice = range.min;
        if (priceIdx > 0 && range.max !== null) params.maxPrice = range.max;
        if (search) params.search = search;

        const { data } = await API.get('/products', { params });
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Shop fetch error:', err);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, priceIdx, sort, search, page]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, String(value));
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const colClass = {
    grid4: 'col-6 col-md-4 col-lg-3',
    grid3: 'col-6 col-md-4',
    list: 'col-12',
  }[viewMode] || 'col-6 col-md-4';

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div className="container">
        {/* Shop Hero */}
        <div className="shop-hero mt-3" style={{ textAlign: 'center' }}>
          <div className="overlay"></div>
          <div className="content">
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link>
              <span className="mx-2">›</span>
              <span>Shop</span>
            </div>
            <h1>Shop Page</h1>
            <p>Let's design the place you always imagined.</p>
          </div>
        </div>

        {/* Search result notice */}
        {search && (
          <div className="d-flex align-items-center gap-2 my-3 p-3" style={{ background: 'var(--vc-gray-100)', borderRadius: 8, fontSize: 14 }}>
            <i className="bi bi-search"></i>
            <span>Search results for "<strong>{search}</strong>"</span>
            <button onClick={() => { const next = new URLSearchParams(searchParams); next.delete('search'); setSearchParams(next); }}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vc-gray-500)', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        )}

        <div className="row g-4 mt-1">
          {/* ---- Sidebar Filter ---- */}
          <div className="col-md-3 d-none d-md-block">
            <div className="filter-sidebar">
              <h6>Categories</h6>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-link${category === cat ? ' active' : ''}`}
                  onClick={() => setParam('category', cat)}>
                  {cat}
                </button>
              ))}

              <hr style={{ margin: '20px 0' }} />

              <h6>Price</h6>
              {PRICE_RANGES.map((range, i) => (
                <div key={i} className="price-item" onClick={() => setParam('priceIdx', i)} style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    readOnly
                    checked={priceIdx === i}
                    style={{ cursor: 'pointer' }}
                    onChange={() => {}}
                  />
                  <span style={{ marginLeft: 8 }}>{range.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Product Grid ---- */}
          <div className="col-md-9">
            {/* Sort bar */}
            <div className="sort-bar mb-3">
              <span className="result-title">
                {category === 'All Rooms' ? 'All Products' : category}
                <span style={{ color: 'var(--vc-gray-500)', fontSize: 13, marginLeft: 6 }}>({total})</span>
              </span>
              <div className="d-flex align-items-center gap-2">
                <select
                  className="sort-select"
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}>
                  <option value="">Sort by</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="view-toggle">
                  {[['grid3', 'bi-grid-3x3-gap'], ['grid4', 'bi-grid'], ['list', 'bi-list-ul']].map(([mode, icon]) => (
                    <button
                      key={mode}
                      className={viewMode === mode ? 'active' : ''}
                      onClick={() => setViewMode(mode)}
                      title={mode}>
                      <i className={`bi ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile filters */}
            <div className="d-md-none d-flex gap-2 mb-3">
              <select
                style={{ flex: 1, border: '1px solid var(--vc-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff' }}
                value={category}
                onChange={e => setParam('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                style={{ flex: 1, border: '1px solid var(--vc-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff' }}
                value={priceIdx}
                onChange={e => setParam('priceIdx', e.target.value)}>
                {PRICE_RANGES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
              </select>
            </div>

            {/* Products */}
            {loading ? (
              <div className="row g-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={colClass}>
                    <div className="product-card" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                      <div className="card-img-wrap">
                        <div style={{ width: '100%', aspectRatio: '1', background: 'var(--vc-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="spinner-border spinner-border-sm" style={{ color: 'var(--vc-gray-400)' }}></div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div style={{ height: 10, background: 'var(--vc-gray-200)', borderRadius: 4, width: '70%', marginBottom: 8 }}></div>
                        <div style={{ height: 10, background: 'var(--vc-gray-200)', borderRadius: 4, width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--vc-gray-500)' }}>
                <i className="bi bi-search" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}></i>
                <h5 style={{ color: 'var(--vc-dark)' }}>No products found</h5>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn-dark-vc mt-2" onClick={() => setSearchParams({})}>Clear Filters</button>
              </div>
            ) : (
              <div className="row g-3">
                {products.map(p => (
                  <div key={p._id} className={colClass}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setParam('page', page - 1)}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === page ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setParam('page', p)}>
                    {p}
                  </button>
                ))}
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setParam('page', page + 1)}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default ShopPage;
