import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ConfirmDialog from '../common/ConfirmDialog';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', message: '', onConfirm: null,
    });

    const openConfirm = ({ title, message, onConfirm }) =>
        setConfirmDialog({ isOpen: true, title, message, onConfirm });
    const closeConfirm = () =>
        setConfirmDialog((d) => ({ ...d, isOpen: false }));

    const handleRemove = (item) => openConfirm({
        title: 'Remove from Wishlist?',
        message: `Are you sure you want to remove "${item.name}" from your wishlist?`,
        onConfirm: () => { removeFromWishlist(item.id, item.category); closeConfirm(); },
    });

    if (wishlistItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={32} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Your Wishlist is Empty.</h3>
                <p className="text-sm text-slate-500 font-semibold mt-2">Start adding Earth's purest products to your wishlist!</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8">Saved Items.</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.map((item) => (
                            <motion.div
                                layout
                                key={`${item.category}-${item.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-slate-50 rounded-3xl p-5 border border-slate-100 hover:bg-white hover:shadow-xl transition-all flex gap-5"
                            >
                                {/* Product Image */}
                                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center p-2 border border-slate-100 overflow-hidden shrink-0">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-all duration-500" />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">₹{item.price} / {item.unit}</p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4">
                                        <button
                                            onClick={() => {
                                                addToCart(item, 1);
                                                removeFromWishlist(item.id, item.category);
                                            }}
                                            className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-600 transition-all"
                                        >
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item)}
                                            className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                            title="Remove from Wishlist"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

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

export default Wishlist;

