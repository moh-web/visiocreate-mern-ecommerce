// ============================================
// components/Navbar.js - شريط التنقل العلوي
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import FlyoutCart from './FlyoutCart';

function Navbar() {
  const { user, logout }               = useAuth();
  const { cartCount, setFlyoutOpen, flyoutOpen } = useCart();
  const navigate = useNavigate();

  // حالات الـ UI
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchOpen, setSearchOpen]             = useState(false);
  const [searchText, setSearchText]             = useState('');
  const [dropdownOpen, setDropdownOpen]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);

  // مرجع لقائمة المستخدم (نستخدمه لإغلاقها عند الضغط خارجها)
  const dropdownRef = useRef(null);

  // إغلاق القائمة عند الضغط في أي مكان خارجها
  useEffect(function () {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    // cleanup: إزالة الـ listener عند تدمير الكومبوننت
    return function () {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // تنفيذ البحث
  function handleSearch(e) {
    e.preventDefault();
    if (searchText.trim()) {
      navigate('/shop?search=' + encodeURIComponent(searchText));
      setSearchOpen(false);
      setSearchText('');
    }
  }

  // تسجيل الخروج
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate('/');
  }

  return (
    <>
      {/* ---- شريط الإعلان ---- */}
      {showAnnouncement && (
        <div className="announcement-bar">
          <i className="bi bi-envelope me-2"></i>
          <strong>30% off storewide — Limited time!</strong>{' '}
          <Link to="/shop">Shop Now →</Link>
          <button className="close-btn" onClick={function () { setShowAnnouncement(false); }}>
            ×
          </button>
        </div>
      )}

      {/* ---- الناف بار ---- */}
      <nav className="vc-navbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">

            {/* اللوجو */}
            <Link to="/" className="brand">VisioCreate</Link>

            {/* روابط التنقل (ديسكتوب فقط) */}
            <div className="d-none d-md-flex align-items-center">
              <NavLink to="/"       className={function ({ isActive }) { return 'nav-link' + (isActive ? ' active' : ''); }} end>Home</NavLink>
              <NavLink to="/shop"   className={function ({ isActive }) { return 'nav-link' + (isActive ? ' active' : ''); }}>Shop</NavLink>
              <NavLink to="/shop?featured=true" className="nav-link">Product</NavLink>
              <NavLink to="/contact" className={function ({ isActive }) { return 'nav-link' + (isActive ? ' active' : ''); }}>Contact Us</NavLink>
            </div>

            {/* أيقونات اليمين */}
            <div className="nav-icons d-flex align-items-center gap-1">

              {/* البحث */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="d-flex align-items-center">
                  <input
                    autoFocus
                    value={searchText}
                    onChange={function (e) { setSearchText(e.target.value); }}
                    placeholder="Search products..."
                    style={{ border: 'none', borderBottom: '1.5px solid #ccc', outline: 'none', padding: '4px 8px', fontSize: 13, width: 160, fontFamily: 'var(--font-sans)' }}
                  />
                  <button
                    type="button"
                    onClick={function () { setSearchOpen(false); setSearchText(''); }}
                    style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888', padding: '0 4px' }}
                  >
                    ×
                  </button>
                </form>
              ) : (
                <button onClick={function () { setSearchOpen(true); }}>
                  <i className="bi bi-search"></i>
                </button>
              )}

              {/* قائمة المستخدم */}
              {user ? (
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  {/* زرار فتح القائمة */}
                  <button
                    onClick={function () { setDropdownOpen(!dropdownOpen); }}
                    style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: 18, color: 'var(--vc-dark)' }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </button>

                  {/* القائمة المنسدلة */}
                  {dropdownOpen && (
                    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid var(--vc-border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180, zIndex: 2000, overflow: 'hidden' }}>

                      {/* اسم المستخدم */}
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--vc-border)', fontSize: 13, color: 'var(--vc-gray-500)' }}>
                        <strong style={{ color: 'var(--vc-dark)', display: 'block' }}>
                          {user.firstName} {user.lastName}
                        </strong>
                        {user.email}
                      </div>

                      {/* روابط الحساب */}
                      {[
                        { to: '/account',          label: 'My Account', icon: 'bi-person' },
                        { to: '/account/orders',   label: 'My Orders',  icon: 'bi-bag' },
                        { to: '/account/wishlist', label: 'Wishlist',   icon: 'bi-heart' },
                        { to: '/account/address',  label: 'Address',    icon: 'bi-geo-alt' },
                      ].map(function (item) {
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={function () { setDropdownOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--vc-dark)' }}
                            onMouseEnter={function (e) { e.currentTarget.style.background = 'var(--vc-gray-100)'; }}
                            onMouseLeave={function (e) { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <i className={'bi ' + item.icon}></i>
                            {item.label}
                          </Link>
                        );
                      })}

                      {/* زرار تسجيل الخروج */}
                      <div style={{ borderTop: '1px solid var(--vc-border)' }}>
                        <button
                          onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#e05050', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                          onMouseEnter={function (e) { e.currentTarget.style.background = '#fff5f5'; }}
                          onMouseLeave={function (e) { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* لو مش مسجل دخول، اعرض أيقونة الشخص */
                <Link to="/signin">
                  <button title="Sign In">
                    <i className="bi bi-person"></i>
                  </button>
                </Link>
              )}

              {/* أيقونة السلة مع عدد المنتجات */}
              <button
                onClick={function () { setFlyoutOpen(true); }}
                style={{ position: 'relative' }}
                title="Cart"
              >
                <i className="bi bi-bag"></i>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>

              {/* هامبرغر للموبايل */}
              <button
                className="d-md-none"
                onClick={function () { setMobileMenuOpen(!mobileMenuOpen); }}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '4px 8px', color: 'var(--vc-dark)' }}
              >
                <i className={mobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'}></i>
              </button>
            </div>
          </div>

          {/* قائمة الموبايل */}
          {mobileMenuOpen && (
            <div style={{ borderTop: '1px solid var(--vc-border)', marginTop: 12, paddingTop: 8, paddingBottom: 8 }}>
              {[
                { to: '/',        label: 'Home',       end: true },
                { to: '/shop',    label: 'Shop' },
                { to: '/contact', label: 'Contact Us' },
              ].map(function (item) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={function () { setMobileMenuOpen(false); }}
                    className={function ({ isActive }) { return 'nav-link d-block' + (isActive ? ' active' : ''); }}
                    style={{ padding: '10px 0' }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          )}

        </div>
      </nav>

      {/* السلة الجانبية */}
      {flyoutOpen && (
        <FlyoutCart onClose={function () { setFlyoutOpen(false); }} />
      )}
    </>
  );
}

export default Navbar;
