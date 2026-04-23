import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { getSeededReviewCount } from '../../utils/productUtils';

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
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group"
        >
            <Link
                to={`/product/${product.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block bg-white rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-6 lg:p-8 border border-slate-50 hover:border-amber-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(245,158,11,0.12)] transition-all cursor-pointer h-full relative overflow-hidden text-center"
            >
                {/* Heart / Wishlist Button at Top Right */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 group/heart transition-transform active:scale-125"
                >
                    <Heart 
                        size={20} 
                        className={`transition-all duration-300 ${isInWishlist(product.id, product.category) 
                            ? 'fill-rose-500 text-rose-500' 
                            : 'text-slate-200 hover:text-rose-400'}`} 
                    />
                </button>

                {/* Main Product Image */}
                <div className="relative aspect-square mb-2 sm:mb-8 p-4 sm:p-6 lg:p-8 flex items-center justify-center shrink-0">
                    <motion.img
                        src={product.img || product.image || product.compressedImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'; }}
                    />

                    {/* Discount Badge */}
                    {product.discount && (
                        <div className="absolute top-0 left-0 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                    {/* Name */}
                    <h4 className="text-sm sm:text-lg lg:text-xl font-black text-slate-900 leading-tight capitalize truncate px-1 sm:px-2 group-hover:text-amber-600 transition-colors">
                        {product.name.toLowerCase()}
                    </h4>

                    {/* Rating & Secondary Info (Mimicking reference) */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span className="text-slate-900">5.0</span>
                            <span className="text-slate-300 ml-0.5">({getSeededReviewCount(product.id)})</span>
                        </div>
                        <div className="w-[1px] h-3 bg-slate-100" />
                        <span>Premium</span>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex flex-col items-center gap-4 pt-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900">₹{product.price}</span>
                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {product.unit || 'Pc'}</span>
                        </div>
                        
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10 active:bg-amber-700 font-black text-[8px] sm:text-[10px] uppercase tracking-widest"
                        >
                            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                            Add to Cart
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
