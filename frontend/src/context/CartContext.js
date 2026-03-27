// ============================================
// context/CartContext.js - إدارة سلة التسوق
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // تحميل السلة من localStorage عند أول تشغيل
  const savedCart = localStorage.getItem('vc_cart');
  const initialCart = savedCart ? JSON.parse(savedCart) : [];

  const [cart, setCart]               = useState(initialCart);
  const [flyoutOpen, setFlyoutOpen]   = useState(false); // هل الـ drawer مفتوح؟

  // حفظ السلة في localStorage عند كل تغيير
  useEffect(function () {
    localStorage.setItem('vc_cart', JSON.stringify(cart));
  }, [cart]);

  // ---- إضافة منتج للسلة ----
  function addToCart(product, selectedColor, quantity) {
    // القيم الافتراضية
    const colorName = selectedColor?.name || product.colors?.[0]?.name || 'Default';
    const qty       = quantity || 1;

    // مفتاح فريد لكل منتج+لون (نفس المنتج بلون مختلف = عنصر منفصل)
    const itemKey = product._id + '-' + colorName;

    setCart(function (currentCart) {
      // ابحث عن المنتج في السلة
      const existingItem = currentCart.find(function (item) {
        return item.key === itemKey;
      });

      if (existingItem) {
        // المنتج موجود => زود الكمية
        return currentCart.map(function (item) {
          if (item.key === itemKey) {
            return { ...item, quantity: item.quantity + qty };
          }
          return item;
        });
      } else {
        // المنتج مش موجود => أضفه
        const newItem = {
          key:      itemKey,
          _id:      product._id,
          name:     product.name,
          price:    product.price,
          image:    product.images?.[0] || '',
          color:    colorName,
          quantity: qty,
        };
        return [...currentCart, newItem];
      }
    });

    // افتح الـ drawer
    setFlyoutOpen(true);
  }

  // ---- حذف منتج من السلة ----
  function removeFromCart(itemKey) {
    setCart(function (currentCart) {
      return currentCart.filter(function (item) {
        return item.key !== itemKey;
      });
    });
  }

  // ---- تغيير كمية منتج ----
  function updateQty(itemKey, newQty) {
    // لو الكمية صفر أو أقل، احذف المنتج
    if (newQty < 1) {
      removeFromCart(itemKey);
      return;
    }

    setCart(function (currentCart) {
      return currentCart.map(function (item) {
        if (item.key === itemKey) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  }

  // ---- تفريغ السلة (بعد الشراء مثلاً) ----
  function clearCart() {
    setCart([]);
  }

  // ---- حسابات مشتقة ----
  // عدد المنتجات الكلي في السلة
  let cartCount = 0;
  for (let i = 0; i < cart.length; i++) {
    cartCount += cart[i].quantity;
  }

  // المجموع الكلي
  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].quantity;
  }

  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    subtotal,
    flyoutOpen,
    setFlyoutOpen,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
