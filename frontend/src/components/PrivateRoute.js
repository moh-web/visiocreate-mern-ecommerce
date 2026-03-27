// ============================================
// components/PrivateRoute.js - حماية الصفحات
// ============================================
// لو المستخدم مش مسجل دخول، بيحوله لصفحة تسجيل الدخول

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user }   = useAuth();
  const location   = useLocation(); // الصفحة الحالية

  // لو مش مسجل دخول
  if (!user) {
    // حوله لصفحة الدخول
    // نحفظ الصفحة الحالية في state عشان نرجعه بعد الدخول
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // لو مسجل دخول، عرض الصفحة المطلوبة
  return children;
}

export default PrivateRoute;
