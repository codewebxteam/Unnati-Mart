import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';



const Categories = () => {
    const navigate = useNavigate();
    const [dbProducts, setDbProducts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [visibleLimit, setVisibleLimit] = useState(window.innerWidth >= 768 ? 8 : 6);

    // Update limit on resize
    useEffect(() => {
        const handleResize = () => setVisibleLimit(window.innerWidth >= 768 ? 8 : 6);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const categoriesRef = ref(db, 'categories');

        const unsubP = onValue(productsRef, (snap) => {
            const data = snap.val() || {};
            setDbProducts(Object.values(data));
            setIsLoading(false);
        });

        const unsubC = onValue(categoriesRef, (snap) => {
            const data = snap.val() || {};
            setDbCategories(Object.values(data));
        });

        return () => {
            unsubP();
            unsubC();
        };
    }, []);

    const finalCategories = useMemo(() => {
        // 1. Get unique category names from products and categories node
        const fromProducts = Array.from(new Set(dbProducts.map(p => p.category).filter(Boolean)));
        const fromCategories = dbCategories.map(c => c.name).filter(Boolean);
        const dynamicNames = Array.from(new Set([...fromProducts, ...fromCategories]));

        let combined = [];

        dynamicNames.forEach(name => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            
            // Find the category record in the database if it exists
            const dbCat = dbCategories.find(c => (c.name || '').toLowerCase() === name.toLowerCase());
            
            // Skip hidden categories
            if (dbCat && dbCat.status === 'Hidden') return;

            const customImg = dbCat?.image || dbCat?.img; 
            const customSub = dbCat?.description || 'Premium Selection';

            combined.push({
                id: slug,
                name: name,
                sub: customSub,
                img: customImg || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop',
                path: `/category/${slug}`,
                gradient: 'from-amber-700 via-amber-600 to-yellow-500', // Default fallback gradient
                createdAt: dbCat?.createdAt
            });
        });

        // Sort by createdAt descending (Newest First), fallback to alphabetical if missing
        return combined.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            
            if (timeA !== timeB) {
                return timeB - timeA; // Newest first
            }
            return a.name.localeCompare(b.name);
        });
    }, [dbProducts, dbCategories]);



    return (
        <div className="min-h-screen bg-white pt-28 pb-32 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 mb-4"
                    >
                        <Sparkles size={12} className="text-amber-500" />
                        Unnati Mart Marketplace
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none"
                    >
                        Explore <span className="text-amber-600 italic">Categories</span>
                    </motion.h1>
                </header>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-12">
                    <AnimatePresence mode="popLayout">
                        {(showAll ? finalCategories : finalCategories.slice(0, visibleLimit)).map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    opacity: { duration: 0.25 },
                                    layout: { type: "spring", stiffness: 300, damping: 30 }
                                }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(cat.path)}
                                className={`group relative aspect-[3/4] bg-gradient-to-br ${cat.gradient || 'from-amber-700 via-amber-600 to-yellow-500'} rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-0 hover:ring-2 hover:ring-white/40 ring-offset-0`}
                            >
                                {/* Product Image — fills the card */}
                                <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-6 pt-4 pb-20">
                                    <motion.img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                                    />
                                </div>

                                {/* Top-right arrow indicator */}
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75 border border-white/30">
                                    <ChevronRight size={16} className="text-white" />
                                </div>

                                {/* Bottom gradient overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500 pointer-events-none" />

                                {/* Text at the bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight mb-0.5 line-clamp-2 drop-shadow-lg">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase tracking-widest group-hover:hidden transition-all">
                                        {cat.sub}
                                    </p>
                                    {/* "Explore" pill appears on hover */}
                                    <div className="hidden group-hover:flex items-center gap-1.5 mt-1 transition-all">
                                        <span className="text-[9px] sm:text-[10px] font-black text-amber-400 uppercase tracking-widest">
                                            Explore Now
                                        </span>
                                        <ChevronRight size={12} className="text-amber-400 animate-pulse" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Explore More Button */}
                {!showAll && finalCategories.length > visibleLimit && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-12"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAll(true)}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-900 to-amber-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-600/20 hover:shadow-2xl hover:shadow-amber-600/30 transition-all duration-300"
                        >
                            <Sparkles size={16} />
                            Explore More Categories
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default Categories;

