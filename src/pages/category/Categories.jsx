import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

// Assets
import vegImg from '../../assets/categories/vegetables.png';
import fruitsImg from '../../assets/categories/fruits.png';
import grainsImg from '../../assets/categories/grains.png';
import meatImg from '../../assets/categories/meat.png';
import fishImg from '../../assets/categories/fish.png';
import nutsImg from '../../assets/categories/nuts.png';
import dairyImg from '../../assets/categories/dairy.png';
import babyImg from '../../assets/categories/baby.png';
import snacksImg from '../../assets/categories/snacks.png';
import beveragesImg from '../../assets/categories/beverages.png';
import personalCareImg from '../../assets/categories/personal_care.png';
import householdImg from '../../assets/categories/household.png';
import wellnessImg from '../../assets/categories/wellness.png';
const Categories = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = React.useState(false);

    const categories = [
        {
            id: 'grocery',
            name: 'Grocery & Staples',
            sub: 'Daily Essentials',
            img: grainsImg,
            path: '/grocery',
            color: 'bg-amber-600',
            textColor: 'text-white'
        },
        {
            id: 'fruits',
            name: 'Fresh Fruits',
            sub: 'Nature\'s Sweetness',
            img: fruitsImg,
            path: '/fruits',
            color: 'bg-orange-500',
            textColor: 'text-white'
        },
        {
            id: 'veg',
            name: 'Vegetables',
            sub: 'Farm Fresh',
            img: vegImg,
            path: '/vegetables',
            color: 'bg-amber-600',
            textColor: 'text-white'
        },
        {
            id: 'dairy',
            name: 'Dairy & Bakery',
            sub: 'Freshly Baked',
            img: dairyImg,
            path: '/dairy',
            color: 'bg-blue-500',
            textColor: 'text-white'
        },
        {
            id: 'snacks',
            name: 'Packaged Food & Snacks',
            sub: 'Quick Bites',
            img: snacksImg,
            path: '/snacks',
            color: 'bg-amber-500',
            textColor: 'text-white'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            sub: 'Cool & Refreshing',
            img: beveragesImg,
            path: '/beverages',
            color: 'bg-cyan-500',
            textColor: 'text-white'
        },
        {
            id: 'personal_care',
            name: 'Personal Care & Hygiene',
            sub: 'Self Care',
            img: personalCareImg,
            path: '/personal-care',
            color: 'bg-pink-500',
            textColor: 'text-white'
        },
        {
            id: 'household',
            name: 'Household & Cleaning Products',
            sub: 'Home Essentials',
            img: householdImg,
            path: '/household',
            color: 'bg-indigo-500',
            textColor: 'text-white'
        },
        {
            id: 'wellness',
            name: 'Health & Wellness',
            sub: 'Stay Healthy',
            img: wellnessImg,
            path: '/wellness',
            color: 'bg-teal-500',
            textColor: 'text-white'
        },
        {
            id: 'baby',
            name: 'Baby Care Products',
            sub: 'For Little Ones',
            img: babyImg,
            path: '/baby',
            color: 'bg-purple-500',
            textColor: 'text-white'
        },
        {
            id: 'dry_fruits',
            name: 'Dry Fruits & nuts',
            sub: 'Healthy & Crunchy',
            img: nutsImg,
            path: '/dry-fruits',
            color: 'bg-rose-500',
            textColor: 'text-white'
        }
    ];

    const displayedCategories = showAll ? categories : categories.slice(0, 8);

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
                        {displayedCategories.map((cat, idx) => (
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

                {!showAll && categories.length > 8 && (
                    <div className="flex justify-center mt-12 pb-12">
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAll(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 text-[12px] font-black uppercase tracking-widest text-slate-900 rounded-full shadow-lg shadow-slate-100/50 hover:bg-slate-900 hover:text-white transition-all group"
                        >
                            See All Categories <ChevronRight size={16} className="text-amber-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;

