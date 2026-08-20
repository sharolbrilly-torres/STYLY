import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ProductColor } from '../models/types';

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode: string;
  couponApplied: boolean;
  couponError: string;
  total: number;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  addToCart: (product: Product, selectedSize: string, selectedColor: ProductColor, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 150000;
const STANDARD_SHIPPING_FEE = 14000;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart_items', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const addToCart = (product: Product, selectedSize: string, selectedColor: ProductColor, quantity = 1) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const current = updated[existingIndex];
        const newQty = Math.min(current.quantity + quantity, product.stockCount);
        updated[existingIndex] = { ...current, quantity: newQty };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0] || '',
          gender: product.gender,
          selectedSize,
          selectedColor,
          quantity: Math.min(quantity, product.stockCount),
          stockAvailable: product.stockCount
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQty, item.stockAvailable) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponApplied(false);
    setCouponCode('');
    setCouponDiscountPercent(0);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    setCouponError('');

    if (cleanCode === 'AURA10') {
      setCouponCode('AURA10');
      setCouponDiscountPercent(10);
      setCouponApplied(true);
      return true;
    } else if (cleanCode === 'ELEGANCIA20') {
      setCouponCode('ELEGANCIA20');
      setCouponDiscountPercent(20);
      setCouponApplied(true);
      return true;
    } else if (cleanCode === 'VERDEOLIVA' || cleanCode === 'ROSAPALO') {
      setCouponCode(cleanCode);
      setCouponDiscountPercent(15);
      setCouponApplied(true);
      return true;
    } else {
      setCouponError('Cupón no válido o expirado. Prueba con AURA10 o ELEGANCIA20');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
    setCouponApplied(false);
    setCouponError('');
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.round((subtotal * couponDiscountPercent) / 100);
  const shippingFee = (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        shippingFee,
        discount,
        couponCode,
        couponApplied,
        couponError,
        total,
        isCartOpen,
        isCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setIsCartOpen,
        setIsCheckoutOpen,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
