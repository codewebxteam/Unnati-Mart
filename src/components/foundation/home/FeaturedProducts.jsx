import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../product/ProductCard';

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
        <section className="py-20 bg-slate-50/50 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header Section - Matched to Reference */}
                <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-8 mb-16">
                    <div className="max-w-xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-4 block"
                        >
                            Our Items
                        </motion.span>
                        
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]"
                        >
                            Always healthy <span className="text-amber-600">grocery</span> in our Grocery Shop.
                        </motion.h2>
                    </div>

                    {/* Decorative Arrows from Reference */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:text-amber-600 hover:border-amber-100 transition-all">
                            <ChevronRight size={24} className="rotate-180" />
                        </button>
                        <button className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-amber-600 transition-all shadow-xl shadow-slate-200">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-16">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} />
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
