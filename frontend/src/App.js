// ============================================
// App.js - إعداد الـ Router والصفحات
// ============================================

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// المكونات العامة
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// الصفحات
import HomePage          from './pages/HomePage';
import ShopPage          from './pages/ShopPage';
import ProductPage       from './pages/ProductPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrderCompletePage from './pages/OrderCompletePage';
import BlogPage          from './pages/BlogPage';
import ContactPage       from './pages/ContactPage';
import SignInPage        from './pages/SignInPage';
import MyAccountPage     from './pages/MyAccountPage';

// ---- Scroll to top عند تغيير الصفحة ----
// مكون مساعد يرجع للأعلى عند الانتقال لصفحة جديدة
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(function () {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // ما بيعرضش أي UI
}

// ---- Layout: الناف بار + المحتوى + الفوتر ----
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '60vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

// ---- التطبيق الرئيسي ----
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* صفحة تسجيل الدخول - بدون ناف بار وفوتر */}
        <Route
          path="/signin"
          element={<SignInPage />}
        />

        {/* الصفحات العامة - مع ناف بار وفوتر */}
        <Route path="/"        element={<Layout><HomePage /></Layout>} />
        <Route path="/shop"    element={<Layout><ShopPage /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
        <Route path="/cart"    element={<Layout><CartPage /></Layout>} />
        <Route path="/blog"    element={<Layout><BlogPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

        {/* الصفحات المحمية - تحتاج تسجيل دخول */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Layout><CheckoutPage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order-complete"
          element={
            <PrivateRoute>
              <Layout><OrderCompletePage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Layout><MyAccountPage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/account/:section"
          element={
            <PrivateRoute>
              <Layout><MyAccountPage /></Layout>
            </PrivateRoute>
          }
        />

        {/* صفحة 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="container py-5 text-center">
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '6rem', color: 'var(--vc-gray-300)' }}>404</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', marginTop: 8 }}>Page not found</h2>
                <p style={{ color: 'var(--vc-gray-500)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-dark-vc" style={{ display: 'inline-block' }}>Go Home</a>
              </div>
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
