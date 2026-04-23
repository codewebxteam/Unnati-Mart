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
        // 1. Get unique category names strictly from categories node (Admin Panel)
        const dynamicNames = dbCategories.map(c => c.name).filter(Boolean);

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
        <div className="min-h-screen bg-slate-50/80 pt-28 pb-32 px-4 md:px-8 relative overflow-hidden">
            {/* Background Aesthetic Blobs */}
            <div className="absolute top-40 -left-20 w-96 h-96 bg-amber-50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-20 -right-10 w-72 h-72 bg-blue-50/50 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
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


                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-12 mb-12">
                    <AnimatePresence mode="popLayout">
                        {(showAll ? finalCategories : finalCategories.slice(0, visibleLimit)).map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    delay: idx * 0.05,
                                    duration: 0.5,
                                    layout: { type: "spring", stiffness: 300, damping: 30 }
                                }}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(cat.path)}
                                className="group relative bg-white rounded-3xl sm:rounded-[3rem] p-4 sm:p-7 lg:p-10 cursor-pointer border-2 border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_40px_100px_-20px_rgba(245,158,11,0.2)] transition-all duration-700 hover:border-amber-100 flex flex-col items-center text-center overflow-hidden"
                            >
                                {/* Subtle Background Accent */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                
                                {/* Wishlist-like icon placeholder */}
                                <div className="absolute top-8 right-8 text-slate-200 group-hover:text-amber-300 transition-colors duration-500">
                                    <Sparkles size={20} fill="currentColor" />
                                </div>

                                {/* Category Image Container */}
                                <div className="relative w-full aspect-square mb-4 sm:mb-10 p-4 sm:p-5 lg:p-8 bg-slate-50 rounded-2xl sm:rounded-[2.5rem] group-hover:bg-amber-50 group-hover:scale-105 transition-all duration-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]">
                                    <motion.img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-1000 group-hover:scale-110 group-hover:-rotate-3"
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="relative z-10 w-full">
                                    <h3 className="text-sm sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight mb-1 sm:mb-2 group-hover:text-amber-600 transition-colors truncate px-1 sm:px-2">
                                        {cat.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-amber-500" />
                                            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Premium
                                            </span>
                                        </div>
                                        <div className="w-[1px] h-3 bg-slate-100" />
                                        <span className="text-[8px] sm:text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                            Handpicked
                                        </span>
                                    </div>
                                </div>

                                {/* Hover CTA (Arrow) */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                    className="absolute bottom-8 right-10 w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-amber-500/30"
                                >
                                    <ChevronRight size={20} />
                                </motion.div>
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

