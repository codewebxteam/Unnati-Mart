import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart, addNotification } = useCart();
    const { user, openAuthModal } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!user) {
            openAuthModal('login');
            return;
        }
        addToCart(product, 1);
        addNotification(product);
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        if (!user) {
            openAuthModal('login');
            return;
        }
        toggleWishlist(product);
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            onClick={() => {
                navigate(`/product/${product.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer h-full flex flex-col"
        >
            {/* Image Container */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 mb-3 flex items-center justify-center overflow-hidden p-2 sm:p-6 shrink-0">
                <motion.img
                    src={product.img}
                    alt={product.name}
                    whileHover={{ scale: 1.1 }}
                    className="w-full h-full object-contain drop-shadow-md"
                />

                {/* Wishlist Button - Shrinked for mobile */}
                <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-white shadow-sm backdrop-blur-md transition-all ${isInWishlist(product.id, product.category)
                            ? 'bg-rose-50 text-rose-500 border-rose-100'
                            : 'bg-white/80 text-slate-300 hover:text-rose-500'
                        }`}
                >
                    <Heart size={14} className="sm:w-4 sm:h-4" fill={isInWishlist(product.id, product.category) ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Info */}
            <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-600 uppercase tracking-widest">{product.tag || 'Fresh'}</span>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            <Star size={7} className="sm:w-2 sm:h-2 fill-amber-500 text-amber-500" />
                            <span className="text-[8px] sm:text-[9px] font-black text-slate-900">5.0</span>
                        </div>
                    </div>

                    <h4 className="text-[13px] sm:text-base font-black text-slate-900 leading-tight capitalize">
                        {product.name.toLowerCase()}
                    </h4>
                </div>

                <div className="flex items-center justify-between pt-1 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-base sm:text-xl font-black text-slate-900 leading-none">₹{product.price}</span>
                        <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Per {product.unit}</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-amber-600 transition-colors shrink-0 ml-2"
                    >
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
