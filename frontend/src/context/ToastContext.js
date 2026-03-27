// ============================================
// context/ToastContext.js - الإشعارات (Toast)
// ============================================
// Toast = رسالة صغيرة تظهر في الشاشة لثواني ثم تختفي

import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]); // قائمة الإشعارات الحالية

  // ---- إظهار إشعار جديد ----
  function showToast(message, type) {
    // type = 'success' أو 'error'
    const toastType = type || 'success';

    // إنشاء ID فريد باستخدام الوقت
    const toastId = Date.now();

    // إضافة الإشعار للقائمة
    setToasts(function (currentToasts) {
      return [...currentToasts, { id: toastId, message: message, type: toastType }];
    });

    // حذف الإشعار بعد 3 ثوان
    setTimeout(function () {
      setToasts(function (currentToasts) {
        return currentToasts.filter(function (toast) {
          return toast.id !== toastId;
        });
      });
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* عرض الإشعارات في الزاوية السفلية اليمنى */}
      <div className="toast-container">
        {toasts.map(function (toast) {
          const iconClass = toast.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle';
          return (
            <div key={toast.id} className="vc-toast">
              <i className={'bi ' + iconClass}></i>
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
