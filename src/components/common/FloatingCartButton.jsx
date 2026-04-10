import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FloatingCartButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();

    // Don't show on cart page itself
    if (location.pathname === '/cart') return null;

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/cart')}
            className="fixed bottom-28 md:bottom-8 right-6 z-[55] w-14 h-14 bg-amber-500 text-white rounded-full shadow-2xl shadow-amber-200 flex items-center justify-center hover:bg-amber-600 transition-colors"
        >
            <ShoppingBag size={22} />
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    >
                        {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default FloatingCartButton;
