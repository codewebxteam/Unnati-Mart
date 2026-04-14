import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart, addNotification } = useCart();
    const { user, openAuthModal } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            openAuthModal('login');
            return;
        }
        addToCart(product, 1);
        addNotification(product);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
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
            className="group"
        >
            <Link
                to={`/product/${product.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer h-full"
            >
                {/* Image Container */}
                <div className="relative aspect-square rounded-2xl bg-slate-50 mb-3 sm:mb-4 flex items-center justify-center overflow-hidden p-2 sm:p-6 lg:p-8 shrink-0">
                    <motion.img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        whileHover={{ scale: 1.1 }}
                        className="w-full h-full object-contain drop-shadow-md"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-white shadow-sm backdrop-blur-md transition-all z-10 ${isInWishlist(product.id, product.category)
                                ? 'bg-rose-50 text-rose-500 border-rose-100'
                                : 'bg-white/80 text-slate-300 hover:text-rose-500'
                            }`}
                    >
                        <Heart size={14} className="sm:w-4 sm:h-4" fill={isInWishlist(product.id, product.category) ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Info */}
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-600 uppercase tracking-widest">{product.tag || 'Fresh'}</span>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            <Star size={7} className="sm:w-2 sm:h-2 fill-amber-500 text-amber-500" />
                            <span className="text-[8px] sm:text-[9px] font-black text-slate-900">5.0</span>
                        </div>
                    </div>

                    <h4 className="text-[13px] sm:text-lg font-black text-slate-900 leading-tight truncate capitalize">
                        {product.name.toLowerCase()}
                    </h4>

                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                        <div className="flex flex-col">
                            <span className="text-base sm:text-xl font-black text-slate-900 leading-none">₹{product.price}</span>
                            <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Per {product.unit}</span>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-amber-600 transition-colors z-10 shrink-0 ml-2"
                        >
                            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
