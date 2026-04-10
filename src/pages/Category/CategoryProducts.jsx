import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, SlidersHorizontal, Package } from 'lucide-react';
import { dummyProducts } from '../../data/dummyProducts';
import ProductCard from '../../components/product/ProductCard';

const CategoryProducts = () => {
    const { categoryPath } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const currentPath = categoryPath || window.location.pathname.split('/').pop();
        
        if (!currentPath) return;

        const categoryData = dummyProducts[currentPath];
        if (categoryData && categoryData.length > 0) {
            setProducts(categoryData);
            setCategoryName(categoryData[0].category);
        } else {
            // Transform common paths to readable names if data missing
            const name = (currentPath || '')
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            setCategoryName(name);
            setProducts([]);
        }
        window.scrollTo(0, 0);
    }, [categoryPath]);

    return (
        <div className="min-h-screen bg-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-12">
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/categories')}
                        className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Categories</span>
                    </motion.button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 mb-4"
                            >
                                <Sparkles size={12} />
                                Premium Selection
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none italic"
                            >
                                {categoryName.toLowerCase()}.
                            </motion.h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing</p>
                                <p className="text-lg font-black text-slate-900 tracking-tight">{products.length} Products</p>
                            </div>
                            <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-amber-600 transition-colors shadow-lg shadow-slate-900/10">
                                <SlidersHorizontal size={20} />
                            </button>
                        </motion.div>
                    </div>
                </header>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                            <Package size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Products Found</h2>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">
                            We're currently stocking up on new items for this category. Check back soon!
                        </p>
                        <button
                            onClick={() => navigate('/categories')}
                            className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors"
                        >
                            Explore other categories
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;
