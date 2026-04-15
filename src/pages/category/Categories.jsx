import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';

// Assets
import vegImg from '../../assets/categories/vegetables.png';
import fruitsImg from '../../assets/categories/fruits.png';
import grainsImg from '../../assets/categories/grains.png';
import nutsImg from '../../assets/categories/nuts.png';
import dairyImg from '../../assets/categories/dairy.png';
import babyImg from '../../assets/categories/baby.png';
import snacksImg from '../../assets/categories/snacks.png';
import beveragesImg from '../../assets/categories/beverages.png';
import personalCareImg from '../../assets/categories/personal_care.png';
import householdImg from '../../assets/categories/household.png';
import wellnessImg from '../../assets/categories/wellness.png';

// Metadata Map for Premium Styling
const CATEGORY_METADATA = {
    'grocery': { name: 'Grocery & Staples', sub: 'Daily Essentials', img: grainsImg, gradient: 'from-amber-700 via-amber-600 to-yellow-500', path: '/grocery' },
    'fruits': { name: 'Fresh Fruits', sub: 'Nature\'s Sweetness', img: fruitsImg, gradient: 'from-red-700 via-red-500 to-orange-400', path: '/fruits' },
    'veg': { name: 'Vegetables', sub: 'Farm Fresh', img: vegImg, gradient: 'from-green-800 via-green-600 to-emerald-400', path: '/vegetables' },
    'dairy': { name: 'Dairy & Bakery', sub: 'Freshly Baked', img: dairyImg, gradient: 'from-blue-700 via-blue-500 to-sky-400', path: '/dairy' },
    'snacks': { name: 'Packaged Food & Snacks', sub: 'Quick Bites', img: snacksImg, gradient: 'from-orange-700 via-amber-500 to-yellow-400', path: '/snacks' },
    'beverages': { name: 'Beverages', sub: 'Cool & Refreshing', img: beveragesImg, gradient: 'from-cyan-700 via-cyan-500 to-teal-400', path: '/beverages' },
    'personal_care': { name: 'Personal Care & Hygiene', sub: 'Self Care', img: personalCareImg, gradient: 'from-pink-700 via-pink-500 to-rose-400', path: '/personal-care' },
    'household': { name: 'Household & Cleaning', sub: 'Home Essentials', img: householdImg, gradient: 'from-indigo-700 via-indigo-500 to-violet-400', path: '/household' },
    'wellness': { name: 'Health & Wellness', sub: 'Stay Healthy', img: wellnessImg, gradient: 'from-teal-700 via-teal-500 to-emerald-400', path: '/wellness' },
    'baby': { name: 'Baby Care Products', sub: 'For Little Ones', img: babyImg, gradient: 'from-purple-700 via-purple-500 to-fuchsia-400', path: '/baby' },
    'dry_fruits': { name: 'Dry Fruits & Nuts', sub: 'Healthy & Crunchy', img: nutsImg, gradient: 'from-rose-800 via-rose-600 to-amber-500', path: '/dry-fruits' }
};

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
        // 1. Start with all base categories from metadata
        const baseCategories = Object.entries(CATEGORY_METADATA).map(([id, data]) => ({
            ...data,
            id
        }));

        // 2. Get unique category names from products and categories node
        const fromProducts = Array.from(new Set(dbProducts.map(p => p.category).filter(Boolean)));
        const fromCategories = dbCategories.map(c => c.name).filter(Boolean);
        const dynamicNames = Array.from(new Set([...fromProducts, ...fromCategories]));

        // 3. Merge dynamic names into the list
        let combined = [...baseCategories];

        dynamicNames.forEach(name => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            
            // Find the category record in the database if it exists
            const dbCat = dbCategories.find(c => (c.name || '').toLowerCase() === name.toLowerCase());
            
            // Skip hidden categories
            if (dbCat && dbCat.status === 'Hidden') return;

            const customImg = dbCat?.image || dbCat?.img; // Handle both likely naming conventions
            const customSub = dbCat?.description || 'Premium Selection';

            // Check if this category already exists in base list (by name or ID)
            const baseIndex = combined.findIndex(c => 
                c.name.toLowerCase() === name.toLowerCase() || 
                c.id === slug ||
                (CATEGORY_METADATA[c.id] && CATEGORY_METADATA[c.id].name.toLowerCase() === name.toLowerCase())
            );

            if (baseIndex !== -1) {
                // Update base category with custom image/sub if provided
                if (customImg) combined[baseIndex].img = customImg;
                if (dbCat?.description) combined[baseIndex].sub = dbCat.description;
            } else {
                // Add as new dynamic category
                combined.push({
                    id: slug,
                    name: name,
                    sub: customSub,
                    img: customImg || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop',
                    path: `/category/${slug}`,
                    gradient: 'from-amber-700 via-amber-600 to-yellow-500'
                });
            }
        });

        return combined.sort((a, b) => a.name.localeCompare(b.name));
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

