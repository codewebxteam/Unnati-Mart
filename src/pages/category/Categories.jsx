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
    'grocery': { name: 'Grocery & Staples', sub: 'Daily Essentials', img: grainsImg, color: 'bg-amber-600', path: '/grocery', textColor: 'text-white' },
    'fruits': { name: 'Fresh Fruits', sub: 'Nature\'s Sweetness', img: fruitsImg, color: 'bg-orange-500', path: '/fruits', textColor: 'text-white' },
    'veg': { name: 'Vegetables', sub: 'Farm Fresh', img: vegImg, color: 'bg-amber-600', path: '/vegetables', textColor: 'text-white' },
    'dairy': { name: 'Dairy & Bakery', sub: 'Freshly Baked', img: dairyImg, color: 'bg-blue-500', path: '/dairy', textColor: 'text-white' },
    'snacks': { name: 'Packaged Food & Snacks', sub: 'Quick Bites', img: snacksImg, color: 'bg-amber-500', path: '/snacks', textColor: 'text-white' },
    'beverages': { name: 'Beverages', sub: 'Cool & Refreshing', img: beveragesImg, color: 'bg-cyan-500', path: '/beverages', textColor: 'text-white' },
    'personal_care': { name: 'Personal Care & Hygiene', sub: 'Self Care', img: personalCareImg, color: 'bg-pink-500', path: '/personal-care', textColor: 'text-white' },
    'household': { name: 'Household & Cleaning Products', sub: 'Home Essentials', img: householdImg, color: 'bg-indigo-500', path: '/household', textColor: 'text-white' },
    'wellness': { name: 'Health & Wellness', sub: 'Stay Healthy', img: wellnessImg, color: 'bg-teal-500', path: '/wellness', textColor: 'text-white' },
    'baby': { name: 'Baby Care Products', sub: 'For Little Ones', img: babyImg, color: 'bg-purple-500', path: '/baby', textColor: 'text-white' },
    'dry_fruits': { name: 'Dry Fruits & nuts', sub: 'Healthy & Crunchy', img: nutsImg, color: 'bg-rose-500', path: '/dry-fruits', textColor: 'text-white' }
};

const Categories = () => {
    const navigate = useNavigate();
    const [dbProducts, setDbProducts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                    color: 'bg-amber-600',
                    textColor: 'text-white'
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


                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12">
                    <AnimatePresence mode="popLayout">
                        {finalCategories.map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    layout: { type: "spring", stiffness: 300, damping: 30 }
                                }}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(cat.path)}
                                className={`group relative aspect-[4/5] ${cat.color} rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300 transition-all duration-500 flex flex-col`}
                            >
                                {/* Text Header - FLEX ITEM 1 */}
                                <div className="p-4 sm:p-6 relative z-20 shrink-0">
                                    <h3 className={`text-sm min-[375px]:text-base sm:text-xl md:text-2xl font-black ${cat.textColor} tracking-tighter leading-tight sm:leading-[1.1] mb-0.5 sm:mb-1 line-clamp-2`}>
                                        {cat.name}
                                    </h3>
                                    <p className={`text-[8px] sm:text-[10px] font-bold ${cat.textColor} opacity-70 uppercase tracking-widest`}>
                                        {cat.sub}
                                    </p>
                                </div>

                                {/* Image container - FLEX ITEM 2 (Pushed to bottom) */}
                                <div className="mt-auto px-3 pb-3 sm:px-4 sm:pb-4 relative z-10 overflow-hidden">
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: -2 }}
                                        className="relative w-full aspect-square bg-white/95 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 shadow-2xl flex items-center justify-center overflow-hidden"
                                    >
                                        <img
                                            src={cat.img}
                                            alt={cat.name}
                                            className="w-full h-full object-contain brightness-110 drop-shadow-xl transition-transform duration-700 group-hover:rotate-3"
                                        />
                                    </motion.div>
                                </div>

                                {/* Overlays should be absolute */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default Categories;

