// ============================================
// context/AuthContext.js - إدارة بيانات المستخدم
// ============================================
// Context = طريقة لمشاركة البيانات بين كل الكومبوننتس
// بدون ما نحتاج نبعت props في كل مرة

import React, { createContext, useContext, useState } from 'react';
import API from '../utils/api';

// 1. إنشاء الـ Context
const AuthContext = createContext();

// 2. الـ Provider = الكومبوننت اللي بيغلف التطبيق ويوفر البيانات
export function AuthProvider({ children }) {
  // تحميل بيانات المستخدم من localStorage عند أول تشغيل
  const savedUser = localStorage.getItem('vc_user');
  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  const [user, setUser]       = useState(initialUser);
  const [loading, setLoading] = useState(false);

  // ---- تسجيل الدخول ----
  async function login(email, password) {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const userData = response.data;

      // حفظ البيانات في الـ state وفي localStorage
      setUser(userData);
      localStorage.setItem('vc_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      return { success: false, message: message };
    } finally {
      setLoading(false);
    }
  }

  // ---- تسجيل حساب جديد ----
  async function register(firstName, lastName, email, password) {
    setLoading(true);
    try {
      const response = await API.post('/auth/register', {
        firstName, lastName, email, password,
      });
      const userData = response.data;

      setUser(userData);
      localStorage.setItem('vc_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, message: message };
    } finally {
      setLoading(false);
    }
  }

  // ---- تسجيل الخروج ----
  function logout() {
    setUser(null);
    localStorage.removeItem('vc_user');
  }

  // ---- تحديث بيانات المستخدم (بعد تعديل الحساب) ----
  function updateUser(newData) {
    // دمج البيانات القديمة مع الجديدة
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('vc_user', JSON.stringify(updatedUser));
  }

  // البيانات والدوال المتاحة لكل الكومبوننتس
  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook: لاستخدام الـ Context بسهولة
// بدل ما تكتب: const { user } = useContext(AuthContext)
// بتكتب:       const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
