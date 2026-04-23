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
            whileHover={{ y: -6 }}
            className="group"
        >
            <Link
                to={`/product/${product.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block bg-white rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-5 border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer h-full relative overflow-hidden"
            >
                {/* Image Container */}
                <div className="relative aspect-square rounded-[1.5rem] sm:rounded-[2rem] bg-slate-50 mb-3 sm:mb-5 flex items-center justify-center overflow-hidden p-3 sm:p-8 shrink-0">
                    <motion.img
                        src={product.img || product.image || product.compressedImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        whileHover={{ scale: 1.05 }}
                        className="w-full h-full object-contain drop-shadow-sm select-none"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'; }}
                    />

                    {/* Wishlist Button - Scaled for mobile */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-3 rounded-full border border-white/20 shadow-lg backdrop-blur-xl transition-all duration-300 z-10 group/heart ${isInWishlist(product.id, product.category)
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                            }`}
                    >
                        <Heart 
                            size={14} 
                            className={`sm:w-5 sm:h-5 transition-transform duration-300 group-active/heart:scale-125 ${isInWishlist(product.id, product.category) ? 'fill-current' : 'fill-none'}`} 
                        />
                    </button>

                    {/* Discount Badge */}
                    {product.discount && (
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-rose-500 text-white text-[7px] sm:text-[10px] font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="px-1 sm:px-2 space-y-1.5 sm:space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[7px] sm:text-[10px] font-black text-amber-600 uppercase tracking-[0.15em] bg-amber-50 px-2 py-0.5 rounded-full">{product.category || 'Fresh'}</span>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            <Star size={8} className="sm:w-3 sm:h-3 fill-amber-500 text-amber-500" />
                            <span className="text-[8px] sm:text-[10px] font-black text-slate-900">5.0</span>
                        </div>
                    </div>

                    <h4 className="text-[11px] sm:text-lg font-black text-slate-900 leading-tight line-clamp-1 capitalize tracking-tight group-hover:text-amber-600 transition-colors">
                        {product.name.toLowerCase()}
                    </h4>

                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                        <div className="flex flex-col">
                            <span className="text-sm sm:text-xl font-black text-slate-900 leading-none">₹{product.price}</span>
                            <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Per {product.unit || 'Pc'}</span>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            className="w-7 h-7 sm:w-11 sm:h-11 bg-slate-900 text-white rounded-lg sm:rounded-2xl flex items-center justify-center hover:bg-amber-600 transition-all z-10 shrink-0 ml-1.5 shadow-lg shadow-slate-900/10 active:bg-amber-700"
                        >
                            <ShoppingCart size={12} className="sm:w-5 sm:h-5" />
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
