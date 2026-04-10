import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Minus, Plus, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import ShareModal from '../common/ShareModal';
import RecommendedProducts from './RecommendedProducts';
import { useEffect } from 'react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { dummyProducts } from '../../data/dummyProducts';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, addNotification } = useCart();
    const { user, openAuthModal } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isAdded, setIsAdded] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);

    const sizeOptions = {
        'Litre': [
            { label: "50ml", ratio: 0.05 },
            { label: "100ml", ratio: 0.1 },
            { label: "150ml", ratio: 0.15 },
            { label: "200ml", ratio: 0.2 },
            { label: "250ml", ratio: 0.25 },
            { label: "500ml", ratio: 0.5 },
            { label: "1L", ratio: 1 }
        ],
        'Kg': [
            { label: "50g", ratio: 0.05 },
            { label: "100g", ratio: 0.1 },
            { label: "150g", ratio: 0.15 },
            { label: "200g", ratio: 0.2 },
            { label: "250g", ratio: 0.25 },
            { label: "500g", ratio: 0.5 },
            { label: "1Kg", ratio: 1 }
        ],
        'Bottle': [
            { label: "Small", ratio: 0.5 },
            { label: "Regular", ratio: 1 }
        ]
    };

    const getActiveSize = () => {
        if (!product) return { label: '', ratio: 1 };
        const category = product.category?.toLowerCase() || '';
        const isSelectable = category.includes('dairy') || category.includes('mushroom');

        const options = isSelectable ? sizeOptions[product.unit] : null;
        if (options && selectedSize) {
            return selectedSize;
        }
        return options ? options[options.length - 1] : { label: product.unit, ratio: 1 };
    };

    useEffect(() => {
        let isMounted = true;
        let unsubscribe = () => { };

        setIsLoading(true);
        const productRef = ref(db, `products/${id}`);
        unsubscribe = onValue(productRef, (snapshot) => {
            if (!isMounted) return;
            const data = snapshot.val();
            
            // Fallback to dummy data if not in Firebase
            let finalData = data;
            if (!finalData) {
                const allDummyProducts = Object.values(dummyProducts).flat();
                finalData = allDummyProducts.find(p => p.id === id);
            }

            if (finalData) {
                // Parse highlights
                let parsedHighlights = [];
                if (typeof finalData.highlights === 'string') {
                    parsedHighlights = finalData.highlights.split(',').map(h => h.trim()).filter(Boolean);
                } else if (Array.isArray(finalData.highlights)) {
                    parsedHighlights = finalData.highlights;
                }

                // Parse specifications
                let parsedSpecs = [];
                const specsText = finalData.specification || finalData.specifications;
                if (typeof specsText === 'string') {
                    parsedSpecs = specsText.split('\n').map(line => {
                        const parts = line.split(':');
                        if (parts.length >= 2) {
                            return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
                        }
                        return null;
                    }).filter(Boolean);
                } else if (Array.isArray(specsText)) {
                    parsedSpecs = specsText;
                }

                setProduct({
                    ...finalData,
                    id: id,
                    img: finalData.img || 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500',
                    unit: finalData.unit || 'Kg',
                    highlights: parsedHighlights,
                    specifications: parsedSpecs,
                    longDescription: finalData.description || ''
                });
            } else {
                setProduct(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Fetch product error:", error);
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Loading Product Details...</h2>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Product Not Found.</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const getCartItem = () => {
        const activeSize = getActiveSize();
        return {
            ...product,
            id: activeSize.ratio !== 1 ? `${product.id}-${activeSize.label}` : product.id,
            name: activeSize.ratio !== 1 ? `${product.name} (${activeSize.label})` : product.name,
            price: Math.round(product.price * activeSize.ratio),
            unit: activeSize.label,
            originalId: product.id
        };
    };

    const handleAddToCart = () => {
        if (!user) {
            openAuthModal('login');
            return;
        }
        addToCart(getCartItem(), quantity);
        addNotification(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!user) {
            openAuthModal('login');
            return;
        }
        addToCart(getCartItem(), quantity);
        navigate('/cart');
    };

    const handleWishlistToggle = () => {
        if (!user) {
            openAuthModal('login');
            return;
        }
        toggleWishlist(product);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            }).catch(console.error);
        } else {
            setIsShareModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 lg:pt-32 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Navigation / Breadcrumbs */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Products</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Left Side: Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="aspect-square bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center overflow-hidden p-12 group">
                            <motion.img
                                src={product.img}
                                alt={product.name}
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                whileHover={{ scale: 1.1 }}
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-700"
                            />

                            {/* Image Badges */}
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{product.badge || 'NEW ARRIVAL'}</span>
                                </div>
                                <div className="flex gap-2 pointer-events-auto">
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={handleShare}
                                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Share2 size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={handleWishlistToggle}
                                        className={`w-12 h-12 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center transition-all ${isInWishlist(product.id, product.category)
                                            ? 'bg-rose-50 text-rose-500 border-rose-100'
                                            : 'bg-white text-slate-300 hover:text-rose-500'
                                            }`}
                                    >
                                        <Heart size={20} fill={isInWishlist(product.id, product.category) ? 'currentColor' : 'none'} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges below image */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {[
                                { icon: Truck, label: "Fast Shipping", sub: "Khalilabad" },
                                { icon: ShieldCheck, label: "Pure Quality", sub: "100% Organic" },
                                { icon: RefreshCw, label: "Daily Fresh", sub: "Farm Grown" }
                            ].map((item, i) => (
                                <div key={i} className="text-center p-4 bg-white rounded-3xl border border-slate-100">
                                    <item.icon size={20} className="mx-auto text-amber-600 mb-2" />
                                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Details Section */}
                    <div className="space-y-10">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                                    {product.category}
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className="fill-amber-500 text-amber-500" />
                                    ))}
                                    <span className="text-[10px] font-black text-slate-900 ml-1">5.0</span>
                                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">(12 REVIEWS)</span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6 italic break-words capitalize"
                            >
                                {product.name.toLowerCase()}.
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-baseline gap-4 mb-8"
                            >
                                <span className="text-5xl font-black text-amber-600 tracking-tighter">₹{Math.round(product.price * getActiveSize().ratio) * quantity}</span>
                                <span className="text-lg font-bold text-slate-300 line-through">₹{Math.round(product.price * 1.5 * getActiveSize().ratio) * quantity}</span>
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">35% OFF</span>
                                <span className="text-xs text-slate-400 font-bold ml-2">( / {getActiveSize().label} )</span>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-500 text-sm lg:text-base font-semibold leading-relaxed max-w-xl"
                            >
                                {product.description}
                            </motion.p>
                        </div>

                        {/* Controls Section */}
                        <div className="space-y-6 max-w-md">
                            {(product.category?.toLowerCase().includes('dairy') || product.category?.toLowerCase().includes('mushroom')) && sizeOptions[product.unit] && (
                                <div className="bg-white rounded-2xl p-4 border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Select Quantity / Volume</span>
                                    <div className="flex flex-wrap gap-2">
                                        {sizeOptions[product.unit].map((sizeObj) => {
                                            const isActive = getActiveSize().label === sizeObj.label;
                                            return (
                                                <button
                                                    key={sizeObj.label}
                                                    onClick={() => setSelectedSize(sizeObj)}
                                                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all border-2 ${isActive
                                                            ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/30'
                                                            : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                                                        }`}
                                                >
                                                    {sizeObj.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Qty</span>
                                    <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-white hover:text-amber-400 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-white hover:text-amber-400 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 ${isAdded
                                        ? 'bg-amber-600 text-white border-amber-600'
                                        : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white'
                                        }`}
                                >
                                    <ShoppingCart size={18} />
                                    {isAdded ? 'Added to Bag!' : 'Add to Bag'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBuyNow}
                                    className="flex-1 py-5 bg-amber-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-700 transition-all shadow-xl shadow-amber-500/20"
                                >
                                    Buy Now
                                </motion.button>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="pt-12">
                            <div className="flex gap-8 border-b border-slate-100 mb-8">
                                {['description', 'specifications', 'highlights'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-300'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[150px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === 'description' && (
                                            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                                                {product.longDescription || product.description}
                                            </p>
                                        )}
                                        {activeTab === 'specifications' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {(product.specifications || []).map((spec, i) => (
                                                    <div key={i} className="flex justify-between p-3 bg-white rounded-xl border border-slate-50">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {activeTab === 'highlights' && (
                                            <div className="flex flex-wrap gap-2">
                                                {(product.highlights || []).map((highlight, i) => (
                                                    <span key={i} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                                        {highlight}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <RecommendedProducts currentProductId={product.id} category={product.category} />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                product={product}
            />
        </div>
    );
};

export default ProductDetail;

