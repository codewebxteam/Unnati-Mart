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
            className="group bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 mb-4 flex items-center justify-center overflow-hidden p-4 sm:p-8">
                <motion.img
                    src={product.img}
                    alt={product.name}
                    whileHover={{ scale: 1.1 }}
                    className="w-full h-full object-contain drop-shadow-md"
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-3 right-3 p-2.5 rounded-xl border border-white shadow-sm backdrop-blur-md transition-all ${isInWishlist(product.id, product.category)
                            ? 'bg-rose-50 text-rose-500 border-rose-100'
                            : 'bg-white/80 text-slate-300 hover:text-rose-500'
                        }`}
                >
                    <Heart size={16} fill={isInWishlist(product.id, product.category) ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Info */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{product.tag || 'Fresh'}</span>
                    <div className="flex items-center gap-1">
                        <Star size={8} className="fill-amber-500 text-amber-500" />
                        <span className="text-[9px] font-black text-slate-900">5.0</span>
                    </div>
                </div>

                <h4 className="text-sm sm:text-lg font-black text-slate-900 leading-tight truncate capitalize">
                    {product.name.toLowerCase()}
                </h4>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900">₹{product.price}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Per {product.unit}</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-amber-600 transition-colors"
                    >
                        <ShoppingCart size={16} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
