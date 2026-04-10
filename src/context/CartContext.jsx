import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { realtimeDb as db } from '../firebase';
import { ref, onValue } from 'firebase/database';
const CartContext = createContext();
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;

    case 'ADD_TO_CART': {
      const existing = state.find(
        (item) =>
          item.id === action.payload.id &&
          item.category === action.payload.category
      );

      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id &&
            item.category === action.payload.category
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }

      return [...state, { ...action.payload }];
    }

    case 'REMOVE_FROM_CART':
      return state.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.category === action.payload.category
          )
      );

    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id &&
          item.category === action.payload.category
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [gstPercentage, setGstPercentage] = React.useState(0);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = React.useState(500);
  const [flatDeliveryFee, setFlatDeliveryFee] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);

  const addNotification = useCallback((product) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, {
      id,
      productName: product.name,
      category: product.category || 'Grocery',
      type: 'success'
    }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const gstValue = parseFloat(data.gstPercentage);
        setGstPercentage(isNaN(gstValue) ? 0 : gstValue);
        setFreeDeliveryThreshold(parseFloat(data.freeDeliveryThreshold) || 500);
        setFlatDeliveryFee(parseFloat(data.flatDeliveryFee) || 0);
      }
    });
    return () => unsubscribe();
  }, []);

  const isLoadedRef = useRef(false);

  useEffect(() => {
    isLoadedRef.current = false;

    if (user) {
      const key = `unnatimart_cart_${user.id}`;
      const saved = localStorage.getItem(key);
      dispatch({ type: 'SET_CART', payload: saved ? JSON.parse(saved) : [] });
    } else {
      dispatch({ type: 'SET_CART', payload: [] });
    }

    Promise.resolve().then(() => {
      isLoadedRef.current = true;
    });
  }, [user]);
  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (!user) return;

    const key = `unnatimart_cart_${user.id}`;
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  }, []);

  const removeFromCart = useCallback((id, category) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, category } });
  }, []);

  const updateQuantity = useCallback((id, category, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, category, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const tax = useMemo(
    () => Math.round(subtotal * (gstPercentage / 100) * 100) / 100,
    [subtotal, gstPercentage]
  );

  const shippingFee = useMemo(
    () => 0, // Delivery is now free for all orders as per user request
    []
  );

  const grandTotal = useMemo(
    () => subtotal + tax + shippingFee,
    [subtotal, tax, shippingFee]
  );

  const value = {
    cartItems,
    cartCount,
    subtotal,
    tax,
    gstPercentage,
    shippingFee,
    grandTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    notifications,
    addNotification,
  };

  return (
    <CartContext.Provider value={value}>
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

export default CartContext;