import React, { useState } from 'react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, Sprout, Milk, ArrowRight, ShoppingCart, X, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CheckoutModal from '../../pages/cart/CheckoutModal';

const CartPage = () => {
    const navigate = useNavigate();
    const {
        cartItems, cartCount, mushroomItems, dairyItems,
        mushroomTotal, dairyTotal, subtotal, tax, gstPercentage, grandTotal,
        removeFromCart, updateQuantity, clearCart, shippingFee
    } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', message: '', onConfirm: null,
    });

    const openConfirm = ({ title, message, onConfirm }) =>
        setConfirmDialog({ isOpen: true, title, message, onConfirm });
    const closeConfirm = () =>
        setConfirmDialog((d) => ({ ...d, isOpen: false }));

    const handleRemoveItem = (id, category, name) => openConfirm({
        title: 'Remove from Cart?',
        message: `Are you sure you want to remove "${name}" from your cart?`,
        onConfirm: () => { removeFromCart(id, category); closeConfirm(); },
    });

    const handleClearCart = () => openConfirm({
        title: 'Clear Entire Cart?',
        message: 'This will remove all items from your cart. Are you sure?',
        onConfirm: () => { clearCart(); closeConfirm(); },
    });

    // Empty Cart State - Flipkart Style Refined
    if (cartItems.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#f8f9fa] flex items-center justify-center">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto flex flex-col items-center py-16"
                    >
                        {/* Simple Shopping Bag Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="w-24 h-24 border-4 border-slate-200 rounded-3xl flex items-center justify-center bg-slate-50/50">
                                <ShoppingBag size={48} strokeWidth={2.5} className="text-slate-300" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <h2 className="text-3xl font-black text-slate-700 tracking-tight mb-3">Your Cart is Empty</h2>
                        <p className="text-sm font-semibold text-slate-400 mb-10 w-full max-w-sm">
                            Add some delicious products to your cart!
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            className="px-10 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3"
                        >
                            Start Exploring
                            <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </main>
        );
    }

    const CartItem = ({ item }) => (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 p-3 sm:p-6 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 transition-all group relative"
        >
            <Link to={`/product/${item.id}`} className="flex flex-col sm:flex-row items-center gap-5 flex-1 group/link cursor-pointer min-w-0 pointer-events-auto">
                {/* Product Image */}
                <div className="w-24 h-24 bg-slate-50 rounded-[1.8rem] overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 group-hover/link:scale-105 transition-transform">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain p-3 drop-shadow-xl" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-2 justify-center sm:justify-start">
                        <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                            {item.category || 'GROCERY'}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                            {item.tag}
                        </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight group-hover/link:text-amber-600 transition-colors truncate w-full">{item.name}</h4>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">₹{item.price} / {item.unit}</p>
                </div>
            </Link>

            {/* Quantity & Price */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-8 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100/60">
                <div className="flex items-center gap-2 sm:gap-3 bg-[#111827] rounded-full px-2 py-1 sm:py-1.5 shadow-sm">
                    <button
                        onClick={() => updateQuantity(item.id, item.category, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:text-amber-500 transition-colors"
                    >
                        <Minus size={12} />
                    </button>
                    <span className="text-xs sm:text-sm font-black text-white min-w-[20px] sm:min-w-[24px] text-center">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.category, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:text-amber-500 transition-colors"
                    >
                        <Plus size={12} />
                    </button>
                </div>

                <div className="text-right sm:text-center min-w-[70px] sm:min-w-[80px]">
                    <span className="text-[18px] sm:text-[22px] font-black text-slate-900 tracking-tighter">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</p>
                </div>

                <button
                    onClick={() => handleRemoveItem(item.id, item.category, item.name)}
                    className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl bg-[#fff2f2] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white transition-all shadow-sm shrink-0"
                >
                    <Trash2 size={14} sm:size={16} strokeWidth={2.5} />
                </button>
            </div>
        </motion.div>
    );

    return (
        <>
            <main className="min-h-screen bg-white pt-24 sm:pt-28 pb-32">
                <div className="container mx-auto px-2 sm:px-4 lg:px-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-baseline justify-between mb-6 gap-4 border-b border-slate-100 pb-6"
                    >
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-[32px] font-black text-slate-900 tracking-tighter italic leading-none">
                                Cart.
                            </h1>
                            <span className="text-slate-400 text-[24px] font-black tracking-tighter">({cartCount} items)</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleClearCart}
                                className="px-6 py-2.5 bg-slate-50 text-slate-400 text-[14px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
                            >
                                Clear Entire Cart
                            </button>
                        </div>
                    </motion.div>
                    
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Left: Cart Items */}
                        <div className="flex-1 space-y-8">
                            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100">
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {cartItems.map((item) => (
                                            <CartItem key={`${item.category}-${item.id}`} item={item} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                                <div className="w-full lg:w-[420px] shrink-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#111827] text-white rounded-[1.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 lg:p-12 sticky top-28 shadow-2xl shadow-slate-200"
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1f2937] border border-white/5 flex items-center justify-center">
                                        <ShoppingCart size={22} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-[28px] font-black tracking-widest italic font-sans">Summary.</h3>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center opacity-60">
                                        <span className="text-[14px] font-black uppercase tracking-widest font-mono">Subtotal</span>
                                        <span className="text-[16px] font-black">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="flex justify-between items-center opacity-60">
                                        <span className="text-[14px] font-black uppercase tracking-widest font-mono">Tax / GST ({gstPercentage}%)</span>
                                        <span className="text-[16px] font-black">₹{tax.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-[14px] font-black uppercase tracking-widest font-mono text-amber-500">Delivery</span>
                                        <span className={`text-[12px] font-black text-white px-3 py-1 rounded-full uppercase ${shippingFee > 0 ? 'bg-slate-700' : 'bg-amber-600'}`}>
                                            {shippingFee > 0 ? `₹${shippingFee.toLocaleString('en-IN')}` : 'Free'}
                                        </span>
                                    </div>

                                    <div className="pt-8 border-t border-white/10">
                                        <div>
                                            <p className="text-[14px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Grand Total</p>
                                            <p className="text-[32px] font-black tracking-tighter leading-none text-amber-500">₹{grandTotal.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowCheckout(true)}
                                    className="w-full mt-10 py-4 sm:py-5 bg-amber-600 text-[#111827] rounded-full text-sm sm:text-[16px] font-black uppercase tracking-wider sm:tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 shadow-[0_20px_40px_rgba(217,119,6,0.2)] hover:bg-white transition-all group"
                                >
                                    Confirm Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>

                                <div className="mt-8 flex items-center justify-center gap-4 opacity-30 group cursor-default">
                                    <Sparkles size={12} className="group-hover:animate-spin" />
                                    <p className="text-[8px] font-black uppercase tracking-widest">100% Secure Transaction</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Checkout Modal */}
            <AnimatePresence>
                {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
            </AnimatePresence>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText="Yes, Remove"
                onConfirm={confirmDialog.onConfirm}
                onCancel={closeConfirm}
            />
        </>
    );
};

export default CartPage;

