// ============================================
// pages/SignInPage.js - تسجيل الدخول والتسجيل
// ============================================

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function SignInPage() {
  const { login, register, loading } = useAuth();
  const { showToast }  = useToast();
  const navigate       = useNavigate();
  const location       = useLocation();

  // الصفحة اللي كان يحاول يفتحها قبل ما يتحول لهنا
  const fromPage = location.state?.from?.pathname || '/';

  // هل نعرض فورم الدخول أم التسجيل؟
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // بيانات الفورم
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [remember,  setRemember]  = useState(false);

  // رسائل الأخطاء
  const [errors, setErrors] = useState({});

  // ---- التحقق من البيانات ----
  function validateForm() {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLoginMode) {
      if (!firstName.trim()) newErrors.firstName = 'First name is required';
      if (!lastName.trim())  newErrors.lastName  = 'Last name is required';
    }

    setErrors(newErrors);

    // إرجاع true لو مفيش أخطاء
    return Object.keys(newErrors).length === 0;
  }

  // ---- إرسال الفورم ----
  async function handleSubmit(e) {
    e.preventDefault();

    // التحقق أولاً
    if (!validateForm()) return;

    let result;

    if (isLoginMode) {
      result = await login(email.trim(), password);
    } else {
      result = await register(firstName.trim(), lastName.trim(), email.trim(), password);
    }

    if (result.success) {
      showToast(isLoginMode ? 'Welcome back!' : 'Account created successfully!');
      navigate(fromPage, { replace: true });
    } else {
      showToast(result.message, 'error');
    }
  }

  // ---- التبديل بين تسجيل الدخول والتسجيل ----
  function switchMode() {
    setIsLoginMode(!isLoginMode);
    setErrors({});
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="auth-page">

      {/* ---- الجانب الأيسر: صورة ---- */}
      <div className="auth-visual">
        <div style={{
          width: '100%', height: '100%', minHeight: '100vh',
          background: 'linear-gradient(160deg, #b8a898 0%, #8a7060 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <i className="bi bi-house-heart" style={{ fontSize: 100, color: 'rgba(255,255,255,0.18)' }}></i>
        </div>
        <div className="brand-overlay">VisioCreate</div>
      </div>

      {/* ---- الجانب الأيمن: الفورم ---- */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">

          <h2>{isLoginMode ? 'Sign In' : 'Sign Up'}</h2>

          <p className="subtitle">
            {isLoginMode ? "Don't have an account yet? " : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--vc-teal)', fontWeight: 600, fontFamily: 'var(--font-sans)' }}
            >
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* حقول الاسم (للتسجيل فقط) */}
            {!isLoginMode && (
              <div className="row g-3 mb-1">
                <div className="col-6">
                  <div className="auth-input-group">
                    <label>First Name</label>
                    <div className="auth-input-wrap">
                      <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={function (e) { setFirstName(e.target.value); }}
                      />
                    </div>
                    {errors.firstName && <div style={{ fontSize: 11, color: '#e05050', marginTop: 4 }}>{errors.firstName}</div>}
                  </div>
                </div>
                <div className="col-6">
                  <div className="auth-input-group">
                    <label>Last Name</label>
                    <div className="auth-input-wrap">
                      <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={function (e) { setLastName(e.target.value); }}
                      />
                    </div>
                    {errors.lastName && <div style={{ fontSize: 11, color: '#e05050', marginTop: 4 }}>{errors.lastName}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* حقل الإيميل */}
            <div className="auth-input-group">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={function (e) { setEmail(e.target.value); }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div style={{ fontSize: 11, color: '#e05050', marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* حقل الباسورد */}
            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLoginMode ? 'Your password' : 'Min. 6 characters'}
                  value={password}
                  onChange={function (e) { setPassword(e.target.value); }}
                  autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                />
                {/* زرار إظهار/إخفاء الباسورد */}
                <button
                  type="button"
                  className="eye-btn"
                  onClick={function () { setShowPassword(!showPassword); }}
                >
                  <i className={'bi ' + (showPassword ? 'bi-eye-slash' : 'bi-eye')}></i>
                </button>
              </div>
              {errors.password && <div style={{ fontSize: 11, color: '#e05050', marginTop: 4 }}>{errors.password}</div>}
            </div>

            {/* Remember me + Forgot password (تسجيل الدخول فقط) */}
            {isLoginMode && (
              <div className="auth-options">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={function (e) { setRemember(e.target.checked); }}
                    style={{ accentColor: 'var(--vc-dark)' }}
                  />
                  Remember me
                </label>
                <span style={{ color: 'var(--vc-dark)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  Forgot password?
                </span>
              </div>
            )}

            {/* زرار الإرسال */}
            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Please wait...</>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default SignInPage;
