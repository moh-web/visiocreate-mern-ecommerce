// ============================================
// index.js - نقطة البداية للفرونت اند
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap CSS والـ Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// الـ CSS الخاص بالمشروع
import './index.css';

// التطبيق الرئيسي
import App from './App';

// الـ Contexts (إدارة الحالة العامة)
import { AuthProvider } from './context/AuthContext'; // بيانات المستخدم
import { CartProvider } from './context/CartContext'; // سلة التسوق
import { ToastProvider } from './context/ToastContext'; // الإشعارات

// إنشاء جذر التطبيق ووضعه في الـ div#root في index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/*
      ترتيب الـ Providers مهم:
      AuthProvider  - يحيط بالكل عشان كل حاجة تقدر تعرف المستخدم
      CartProvider  - يحيط بالكل عشان السلة متاحة في كل مكان
      ToastProvider - يحيط بالكل عشان الإشعارات تظهر في كل مكان
    */}
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
