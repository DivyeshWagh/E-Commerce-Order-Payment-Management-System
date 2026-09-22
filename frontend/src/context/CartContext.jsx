import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const cartData = await cartService.getCart(user.userId);
      setCart(cartData);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !user?.userId) {
      addToast('Please login to add items to cart', 'error');
      return false;
    }
    try {
      const updatedCart = await cartService.addToCart(user.userId, productId, quantity);
      setCart(updatedCart);
      addToast('Product added to cart!', 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart (check stock)';
      addToast(msg, 'error');
      return false;
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (!user?.userId) return;
    try {
      const updatedCart = await cartService.updateItemQuantity(user.userId, itemId, quantity);
      setCart(updatedCart);
      addToast('Cart updated', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update item quantity';
      addToast(msg, 'error');
    }
  };

  const removeItem = async (productId) => {
    if (!user?.userId) return;
    try {
      const updatedCart = await cartService.removeItem(user.userId, productId);
      setCart(updatedCart);
      addToast('Item removed from cart', 'info');
    } catch (err) {
      addToast('Failed to remove item', 'error');
    }
  };

  const clearCartState = () => {
    setCart(null);
  };

  const cartItemsCount = cart?.items ? [...cart.items].reduce((acc, item) => acc + item.quantity, 0) : 0;
  const cartTotal = cart?.items ? [...cart.items].reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemsCount,
        cartTotal,
        fetchCart,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
