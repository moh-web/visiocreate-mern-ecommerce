// ============================================
// utils/api.js - إعداد Axios للتواصل مع الباك اند
// ============================================

import axios from 'axios';

// إنشاء نسخة من axios تبدأ تلقائياً بـ /api
const API = axios.create({
  baseURL: '/api',
});

// ---- Interceptor: إضافة التوكن لكل طلب تلقائياً ----
// بيشتغل قبل إرسال أي طلب
API.interceptors.request.use(function (config) {
  // جلب بيانات المستخدم من localStorage
  const savedUser = localStorage.getItem('vc_user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  // لو في توكن، نضيفه في الـ Header
  if (user && user.token) {
    config.headers.Authorization = 'Bearer ' + user.token;
  }

  return config;
});

export default API;
