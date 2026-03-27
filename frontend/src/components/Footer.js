// ============================================
// components/Footer.js - الفوتر
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="vc-footer">
      <div className="container">

        {/* الصف الأول: اللوجو + روابط + سوشيال */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

          {/* اللوجو */}
          <div className="d-flex align-items-center">
            <span className="brand">VisioCreate.</span>
            <span className="tagline">Gift &amp; Decoration Store</span>
          </div>

          {/* روابط التنقل */}
          <ul className="footer-links mb-0">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/shop?featured=true">Product</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>

          {/* أيقونات السوشيال */}
          <div className="social-links">
            <a href="#instagram" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#facebook" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#youtube" aria-label="YouTube">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>

        {/* فاصل */}
        <hr className="divider" />

        {/* الصف الثاني: كوبيرايت + سياسة الخصوصية */}
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <span className="copyright">
            Copyright © 2024 VisioCreate. All rights reserved
          </span>
          <div>
            <a href="#privacy" className="legal-links">Privacy Policy</a>
            <a href="#terms"   className="legal-links">Terms of Use</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
