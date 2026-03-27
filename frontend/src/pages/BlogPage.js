import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import Newsletter from '../components/Newsletter';

const PLACEHOLDER_BLOGS = Array.from({ length: 9 }, (_, i) => ({
  _id: `ph-${i}`,
  title: i === 0 ? '7 ways to decor your home like a professional'
    : i === 1 ? 'Inside a beautiful kitchen organization'
    : i === 2 ? 'Decor your bedroom for your children'
    : 'Modern texas home is beautiful and completely kid-friendly',
  createdAt: '2023-10-16T00:00:00.000Z',
  image: null,
  isPlaceholder: true,
}));

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const LIMIT = 9;

  const fetchBlogs = useCallback(async (tab, pg, append = false) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: LIMIT };
      if (tab === 'featured') params.featured = 'true';
      const { data } = await API.get('/blog', { params });
      const fetched = data.blogs || [];
      setTotal(data.total || 0);
      if (append) setBlogs(prev => [...prev, ...fetched]);
      else setBlogs(fetched);
      setHasMore(fetched.length === LIMIT && (append ? (blogs.length + fetched.length) : fetched.length) < (data.total || 0));
    } catch (err) {
      console.error('Blog fetch error:', err);
      if (!append) setBlogs([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPage(1);
    setBlogs([]);
    fetchBlogs(activeTab, 1, false);
  }, [activeTab, fetchBlogs]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(activeTab, nextPage, true);
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  const displayBlogs = !loading && blogs.length === 0 ? PLACEHOLDER_BLOGS : blogs;

  return (
    <div>
      <div className="container">
        {/* Hero */}
        <div className="blog-hero mt-3">
          <div className="overlay"></div>
          <div className="content">
            <div style={{ fontSize: 13, color: 'var(--vc-gray-500)', marginBottom: 8 }}>
              <Link to="/" style={{ color: 'inherit' }}>Home</Link>
              <span className="mx-2">›</span>
              <span style={{ color: 'var(--vc-dark)' }}>Blog</span>
            </div>
            <h1>Our Blog</h1>
            <p>Home ideas and design inspiration</p>
          </div>
        </div>

        {/* Tabs + Sort */}
        <div className="d-flex justify-content-between align-items-end mb-1 flex-wrap gap-2">
          <div className="blog-filter-tabs">
            <button className={`tab${activeTab === 'all' ? ' active' : ''}`} onClick={() => handleTabChange('all')}>
              All Blog
            </button>
            <button className={`tab${activeTab === 'featured' ? ' active' : ''}`} onClick={() => handleTabChange('featured')}>
              Featured
            </button>
          </div>
          <div className="d-flex align-items-center gap-2 pb-1">
            <span style={{ fontSize: 13, color: 'var(--vc-gray-500)' }}>Sort by</span>
            <select style={{ border: '1px solid var(--vc-border)', borderRadius: 6, padding: '6px 10px', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
            <div className="view-toggle">
              {['bi-grid-3x3-gap', 'bi-grid', 'bi-layout-split', 'bi-list-ul'].map((icon, i) => (
                <button key={i}><i className={`bi ${icon}`}></i></button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading && blogs.length === 0 ? (
          <div className="row g-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="col-md-4">
                <div style={{ borderRadius: 12, overflow: 'hidden', opacity: 0.5 }}>
                  <div style={{ aspectRatio: '4/3', background: 'var(--vc-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner-border spinner-border-sm" style={{ color: 'var(--vc-gray-400)' }}></div>
                  </div>
                  <div style={{ padding: '12px 0' }}>
                    <div style={{ height: 12, background: 'var(--vc-gray-200)', borderRadius: 4, width: '90%', marginBottom: 6 }}></div>
                    <div style={{ height: 10, background: 'var(--vc-gray-200)', borderRadius: 4, width: '50%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {displayBlogs.map((blog, idx) => (
              <div key={blog._id || idx} className="col-md-4">
                <div
                  className="blog-card"
                  onClick={() => !blog.isPlaceholder && navigate(`/blog/${blog._id}`)}
                  style={{ cursor: blog.isPlaceholder ? 'default' : 'pointer' }}>
                  <div className="img-wrap">
                    {blog.image ? (
                      <img
                        src={`http://localhost:5000${blog.image}`}
                        alt={blog.title}
                        onError={e => { e.target.parentElement.innerHTML = `<div style="background:hsl(${30+idx*15},15%,${88-idx*3}%);height:100%;min-height:200px;display:flex;align-items:center;justify-content:center"><i class="bi bi-image" style="font-size:36px;opacity:0.2"></i></div>`; }}
                      />
                    ) : (
                      <div style={{
                        background: `hsl(${30 + idx * 15}, 15%, ${88 - (idx % 5) * 3}%)`,
                        height: '100%', minHeight: 200,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className="bi bi-image" style={{ fontSize: 36, opacity: 0.2 }}></i>
                      </div>
                    )}
                  </div>
                  <h5 style={{ marginTop: 14, marginBottom: 4, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, lineHeight: 1.5 }}>
                    {blog.title}
                  </h5>
                  <div className="date">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  {!blog.isPlaceholder && (
                    <div className="read-more mt-2" style={{ fontSize: 13, fontWeight: 500 }}>Read More →</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More */}
        {hasMore && !loading && (
          <div className="text-center mt-4">
            <button className="show-more-btn" onClick={handleLoadMore}>Show more</button>
          </div>
        )}
        {loading && blogs.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <div className="spinner-border spinner-border-sm"></div>
          </div>
        )}

        {/* Total count */}
        {total > 0 && (
          <p className="text-center mt-3" style={{ fontSize: 13, color: 'var(--vc-gray-500)' }}>
            Showing {displayBlogs.filter(b => !b.isPlaceholder).length} of {total} articles
          </p>
        )}
      </div>

      <Newsletter />
    </div>
  );
};

export default BlogPage;
