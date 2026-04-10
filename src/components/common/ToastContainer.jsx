import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ToastContainer = () => {
    const { notifications } = useCart();

    return (
        <div className="fixed top-24 right-4 sm:right-8 z-[200] pointer-events-none flex flex-col gap-3 w-full max-w-[400px]">
            <AnimatePresence>
                {notifications.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-amber-100 shadow-2xl shadow-amber-500/10 rounded-2xl p-4 flex items-start gap-4 overflow-hidden relative group"
                    >
                        {/* Progress Bar */}
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-0.5 bg-amber-500/30"
                        />

                        {/* Icon */}
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                            <ShoppingCart size={20} className="text-amber-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Added to Cart</span>
                                <CheckCircle2 size={12} className="text-emerald-500" />
                            </div>
                            <h4 className="text-sm font-black text-slate-900 truncate capitalize">
                                {toast.productName.toLowerCase()}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">
                                Category: <span className="text-slate-600">{toast.category}</span>
                            </p>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
