import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { useCart } from '../../../context/CartContext';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const productsRef = ref(db, 'products');
        // We fetch more than 8 then slice and reverse manually to ensure we get the latest ones
        // correctly if we want "Newest First"
        const unsubscribe = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const productList = Object.entries(data).map(([id, values]) => ({
                    id,
                    ...values
                }));
                
                // Sort by ID descending (Firebase push IDs are chronological)
                const sorted = productList.sort((a, b) => b.id.localeCompare(a.id));
                
                // Take only 8
                setProducts(sorted.slice(0, 8));
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-400 animate-pulse font-black uppercase tracking-widest text-xs">Curating your selection...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-6"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Featured Collection</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6"
                    >
                        CURATED <span className="text-amber-500">FOR YOU</span>
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-sm lg:text-base text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Discover a handpicked selection of our finest products across all categories. 
                        Uncompromising quality, brought straight to your home.
                    </motion.p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Product Image */}
                            <div 
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="relative aspect-square rounded-[2rem] bg-slate-50 overflow-hidden mb-6 cursor-pointer"
                            >
                                <img
                                    src={product.img || product.compressedImage || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'; }}
                                />
                                {product.discount && (
                                    <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                                        -{product.discount}%
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="px-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="text-[10px] font-black">5.0</span>
                                    </div>
                                </div>
                                
                                <h3 
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="text-lg font-black text-slate-900 mb-4 line-clamp-1 cursor-pointer group-hover:text-amber-600 transition-colors"
                                >
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xl font-black text-slate-900 leading-none">₹{product.price}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Per {product.unit || 'Unit'}</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg active:scale-90 group/btn"
                                    >
                                        <ShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/products')}
                        className="px-10 py-5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-4 hover:bg-amber-600 transition-all shadow-2xl shadow-slate-200 group"
                    >
                        Explore More Products
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
