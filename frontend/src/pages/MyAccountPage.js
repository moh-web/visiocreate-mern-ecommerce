// ============================================
// pages/MyAccountPage.js - صفحة حسابي
// ============================================

import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../utils/api';

// ============================================
// قسم: تفاصيل الحساب
// ============================================
function AccountDetails() {
  const { user, updateUser } = useAuth();
  const { showToast }        = useToast();

  // بيانات الفورم - مملوءة بالبيانات الحالية
  const [firstName,   setFirstName]   = useState(user?.firstName   || '');
  const [lastName,    setLastName]    = useState(user?.lastName    || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email,       setEmail]       = useState(user?.email       || '');
  const [isSaving,    setIsSaving]    = useState(false);

  // بيانات تغيير الباسورد
  const [oldPassword, setOldPassword]     = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [repeatPass,  setRepeatPass]      = useState('');
  const [isChangingPw, setIsChangingPw]   = useState(false);

  // ---- حفظ بيانات الحساب ----
  async function handleSaveProfile(e) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await API.put('/users/profile', {
        firstName:   firstName,
        lastName:    lastName,
        displayName: displayName,
        email:       email,
      });

      updateUser(response.data);
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  // ---- تغيير الباسورد ----
  async function handleChangePassword(e) {
    e.preventDefault();

    if (newPassword !== repeatPass) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsChangingPw(true);
    try {
      await API.put('/users/change-password', {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      showToast('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setRepeatPass('');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error changing password', 'error');
    } finally {
      setIsChangingPw(false);
    }
  }

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: 28 }}>Account Details</h4>

      {/* فورم البيانات الشخصية */}
      <form onSubmit={handleSaveProfile}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label-sm">First Name *</label>
            <input
              className="vc-input"
              value={firstName}
              onChange={function (e) { setFirstName(e.target.value); }}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label-sm">Last Name *</label>
            <input
              className="vc-input"
              value={lastName}
              onChange={function (e) { setLastName(e.target.value); }}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label-sm">Display Name</label>
          <input
            className="vc-input"
            value={displayName}
            onChange={function (e) { setDisplayName(e.target.value); }}
            placeholder="How your name appears in reviews"
          />
          <div style={{ fontSize: 11, color: 'var(--vc-gray-500)', marginTop: 4 }}>
            This will be shown in reviews and account section
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label-sm">Email *</label>
          <input
            className="vc-input"
            type="email"
            value={email}
            onChange={function (e) { setEmail(e.target.value); }}
            required
          />
        </div>

        <button type="submit" className="btn-dark-vc" disabled={isSaving}>
          {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
          Save Changes
        </button>
      </form>

      <hr style={{ margin: '36px 0' }} />

      {/* فورم تغيير الباسورد */}
      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: 28 }}>Password</h4>
      <form onSubmit={handleChangePassword}>
        <div className="mb-3">
          <label className="form-label-sm">Old Password</label>
          <input
            className="vc-input"
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={function (e) { setOldPassword(e.target.value); }}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label-sm">New Password</label>
          <input
            className="vc-input"
            type="password"
            placeholder="New password (min. 6 characters)"
            value={newPassword}
            onChange={function (e) { setNewPassword(e.target.value); }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label-sm">Repeat New Password</label>
          <input
            className="vc-input"
            type="password"
            placeholder="Repeat new password"
            value={repeatPass}
            onChange={function (e) { setRepeatPass(e.target.value); }}
            required
          />
        </div>
        <button type="submit" className="btn-dark-vc" disabled={isChangingPw}>
          {isChangingPw ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
          Change Password
        </button>
      </form>
    </div>
  );
}

// ============================================
// قسم: طلباتي
// ============================================
function Orders() {
  const [orders, setOrders]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب طلبات المستخدم عند تحميل القسم
  useEffect(function () {
    async function fetchOrders() {
      try {
        const response = await API.get('/orders/my');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // تحديد لون حالة الطلب
  function getStatusColor(status) {
    if (status === 'delivered') return '#10b981';
    if (status === 'cancelled') return '#ef4444';
    if (status === 'shipped')   return '#8b5cf6';
    if (status === 'processing') return '#3b82f6';
    return '#888'; // pending
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: 28 }}>My Orders</h4>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--vc-gray-500)' }}>
          <i className="bi bi-bag-x" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}></i>
          <p>No orders yet</p>
          <NavLink to="/shop" className="btn-dark-vc" style={{ display: 'inline-block', marginTop: 8 }}>
            Start Shopping
          </NavLink>
        </div>
      ) : (
        <div>
          {orders.map(function (order) {
            const statusColor = getStatusColor(order.status);

            return (
              <div key={order._id} style={{ border: '1px solid var(--vc-border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>

                {/* هيدر الطلب */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{order.orderCode}</div>
                    <div style={{ fontSize: 12, color: 'var(--vc-gray-500)', marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: statusColor, background: statusColor + '20', padding: '4px 10px', borderRadius: 20, textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>${order.total?.toFixed(2)}</span>
                  </div>
                </div>

                {/* صور المنتجات */}
                <div className="d-flex gap-2 flex-wrap">
                  {order.items?.slice(0, 4).map(function (item, i) {
                    return (
                      <div key={i} style={{ position: 'relative' }}>
                        <img
                          src={item.image ? 'http://localhost:5000' + item.image : 'https://placehold.co/52x52/f0f0ee/888?text=+'}
                          alt={item.name}
                          style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8, background: 'var(--vc-gray-100)', padding: 4 }}
                        />
                        <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--vc-dark)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// قسم: المفضلة
// ============================================
function Wishlist() {
  const [wishlist, setWishlist]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast }             = useToast();
  const navigate                  = useNavigate();

  useEffect(function () {
    async function fetchWishlist() {
      try {
        const response = await API.get('/users/wishlist');
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  async function removeItem(productId) {
    try {
      await API.post('/users/wishlist/' + productId);
      setWishlist(function (current) {
        return current.filter(function (p) { return p._id !== productId; });
      });
      showToast('Removed from wishlist');
    } catch {
      showToast('Error removing item', 'error');
    }
  }

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div className="spinner-border"></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: 28 }}>
        My Wishlist ({wishlist.length})
      </h4>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--vc-gray-500)' }}>
          <i className="bi bi-heart" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}></i>
          <p>Your wishlist is empty</p>
          <button className="btn-dark-vc mt-2" onClick={function () { navigate('/shop'); }}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {wishlist.map(function (product) {
            return (
              <div key={product._id} className="col-6 col-md-4">
                <div style={{ position: 'relative' }}>
                  <div className="product-card" onClick={function () { navigate('/product/' + product._id); }}>
                    <div className="card-img-wrap">
                      <img
                        src={product.images?.[0] ? 'http://localhost:5000' + product.images[0] : 'https://placehold.co/200x200/f0f0ee/888?text=+'}
                        alt={product.name}
                        onError={function (e) { e.target.src = 'https://placehold.co/200x200/f0f0ee/888?text=+'; }}
                      />
                    </div>
                    <div className="card-body">
                      <div className="product-name">{product.name}</div>
                      <div className="price">${Number(product.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <button
                    onClick={function (e) { e.stopPropagation(); removeItem(product._id); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#e05050' }}
                  >
                    <i className="bi bi-heart-fill" style={{ fontSize: 12 }}></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// قسم: العنوان
// ============================================
function Address() {
  const { user, updateUser } = useAuth();
  const { showToast }        = useToast();

  const [street,    setStreet]    = useState(user?.address?.street  || '');
  const [city,      setCity]      = useState(user?.address?.city    || '');
  const [state,     setState]     = useState(user?.address?.state   || '');
  const [zipCode,   setZipCode]   = useState(user?.address?.zipCode || '');
  const [country,   setCountry]   = useState(user?.address?.country || '');
  const [isSaving,  setIsSaving]  = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await API.put('/users/profile', {
        address: { street, city, state, zipCode, country },
      });
      updateUser(response.data);
      showToast('Address saved successfully!');
    } catch (error) {
      showToast('Error saving address', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Vietnam', 'Egypt', 'Other'];

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: 28 }}>My Address</h4>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label-sm">Street Address</label>
          <input className="vc-input" placeholder="123 Main Street" value={street} onChange={function (e) { setStreet(e.target.value); }} />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label-sm">City</label>
            <input className="vc-input" placeholder="City" value={city} onChange={function (e) { setCity(e.target.value); }} />
          </div>
          <div className="col-md-6">
            <label className="form-label-sm">State / Province</label>
            <input className="vc-input" placeholder="State" value={state} onChange={function (e) { setState(e.target.value); }} />
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label-sm">Zip Code</label>
            <input className="vc-input" placeholder="Zip Code" value={zipCode} onChange={function (e) { setZipCode(e.target.value); }} />
          </div>
          <div className="col-md-6">
            <label className="form-label-sm">Country</label>
            <select className="vc-select" value={country} onChange={function (e) { setCountry(e.target.value); }}>
              <option value="">Select Country</option>
              {COUNTRIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
            </select>
          </div>
        </div>
        <button type="submit" className="btn-dark-vc" disabled={isSaving}>
          {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
          Save Address
        </button>
      </form>
    </div>
  );
}

// ============================================
// الصفحة الرئيسية للحساب
// ============================================
const NAV_LINKS = [
  { section: 'account',  path: '/account',          label: 'Account',  icon: 'bi-person',   isEnd: true },
  { section: 'address',  path: '/account/address',  label: 'Address',  icon: 'bi-geo-alt' },
  { section: 'orders',   path: '/account/orders',   label: 'Orders',   icon: 'bi-bag' },
  { section: 'wishlist', path: '/account/wishlist', label: 'Wishlist', icon: 'bi-heart' },
];

function MyAccountPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const params           = useParams();

  // الجزء الحالي من الـ URL: /account/orders -> section = "orders"
  const currentSection = params.section || 'account';

  // لو مش مسجل دخول، حول لصفحة الدخول
  if (!user) {
    navigate('/signin', { state: { from: { pathname: '/account' } } });
    return null;
  }

  // صورة الأفاتار
  const avatarSrc = user.avatar
    ? 'http://localhost:5000' + user.avatar
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.firstName + ' ' + user.lastName) + '&background=e0e0de&color=666666&size=72&bold=true';

  // عرض القسم المناسب حسب الـ URL
  function renderSection() {
    if (currentSection === 'orders')   return <Orders />;
    if (currentSection === 'wishlist') return <Wishlist />;
    if (currentSection === 'address')  return <Address />;
    return <AccountDetails />;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>
        My Account
      </h1>

      <div className="row g-4">

        {/* ---- الشريط الجانبي ---- */}
        <div className="col-md-3">
          <div className="account-sidebar">

            {/* صورة المستخدم والاسم */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <img
                src={avatarSrc}
                alt={user.firstName}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', marginBottom: 10 }}
                onError={function (e) { e.target.src = 'https://placehold.co/80x80/e0e0de/666?text=' + user.firstName[0]; }}
              />
              <div style={{ fontWeight: 600, fontSize: 15 }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 12, color: 'var(--vc-gray-500)', marginTop: 2 }}>{user.email}</div>
            </div>

            {/* روابط التنقل */}
            <ul className="account-nav">
              {NAV_LINKS.map(function (item) {
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.isEnd}
                      style={function ({ isActive }) {
                        return {
                          display:        'flex',
                          alignItems:     'center',
                          gap:            10,
                          padding:        '10px 12px',
                          borderRadius:   8,
                          fontSize:       14,
                          fontWeight:     isActive ? 600 : 400,
                          color:          isActive ? 'var(--vc-dark)' : 'var(--vc-gray-500)',
                          background:     isActive ? '#fff' : 'transparent',
                          textDecoration: 'none',
                        };
                      }}
                    >
                      <i className={'bi ' + item.icon}></i>
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}

              {/* زرار تسجيل الخروج */}
              <li>
                <button
                  onClick={function () { logout(); navigate('/'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, fontSize: 14, color: '#e05050', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginTop: 4 }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ---- منطقة المحتوى ---- */}
        <div className="col-md-9">
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px', border: '1px solid var(--vc-border)', minHeight: 400 }}>
            {renderSection()}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyAccountPage;
