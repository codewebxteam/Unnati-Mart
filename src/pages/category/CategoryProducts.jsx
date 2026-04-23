import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, SlidersHorizontal, Package, AlertTriangle } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ProductCard from '../../components/product/ProductCard';

const CategoryProducts = () => {
    const { categoryPath } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        const currentPath = categoryPath || location.pathname.split('/').pop();

        if (!currentPath) return;

        const productsRef = ref(db, 'products');
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 8000);

        const unsubscribe = onValue(productsRef, (snap) => {
            clearTimeout(safetyTimeout);
            const data = snap.val() || {};
            const allProducts = Object.keys(data).map(key => ({
                ...data[key],
                firebaseId: key,
                id: key // Essential for components using .id
            }));

            // Filter products by category mapping
            let filtered = [];
            if (currentPath === 'products') {
                filtered = allProducts;
                setCategoryName('All Products');
            } else {
                filtered = allProducts.filter(p => {
                    const prodCat = (p.category || '').toLowerCase();
                    const prodSlug = prodCat.replace(/[^a-z0-9]+/g, '_');
                    const pathSlug = currentPath.toLowerCase().replace(/[^a-z0-9]+/g, '_');

                    // Handle special legacy path mappings
                    const isVegMatch = (pathSlug === 'vegetables' && prodSlug === 'veg') || (pathSlug === 'veg' && prodSlug === 'vegetables');
                    const isPersonalCareMatch = (pathSlug === 'personal-care' || pathSlug === 'personal_care') && (prodSlug === 'personal_care' || prodSlug === 'personal-care');
                    const isDryFruitsMatch = (pathSlug === 'dry-fruits' || pathSlug === 'dry_fruits') && (prodSlug === 'dry_fruits' || prodSlug === 'dry-fruits');

                    return prodSlug === pathSlug || prodCat === currentPath.toLowerCase() || isVegMatch || isPersonalCareMatch || isDryFruitsMatch;
                });

                // Set the readable category name
                if (filtered.length > 0) {
                    setCategoryName(filtered[0].category);
                } else {
                    const name = currentPath
                        .split(/[-_]/)
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    setCategoryName(name);
                }
            }

            setProducts(filtered);
            setIsLoading(false);
        }, (err) => {
            clearTimeout(safetyTimeout);
            console.error("Storefront products sync error:", err);
            setSyncError(err);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [categoryPath, location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryPath]);

    return (
        <div className="min-h-screen bg-white pt-36 pb-20 px-4 md:px-8">
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
                                <p className="text-lg font-black text-slate-900 tracking-tight">
                                    {isLoading ? '...' : `${products.length} Products`}
                                </p>
                            </div>
                            <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-amber-600 transition-colors shadow-lg shadow-slate-900/10">
                                <SlidersHorizontal size={20} />
                            </button>
                        </motion.div>
                    </div>
                </header>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent shadow-lg mb-4"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Inventory...</span>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.firebaseId || product.id}
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

            {/* ERROR DIAGNOSTICS MODAL */}
            {syncError && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" onClick={() => setSyncError(null)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-[501] shadow-2xl p-6 border-2 border-rose-200 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-4 text-red-600">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Product Sync Issue</h2>
                                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{syncError.code === 'PERMISSION_DENIED' ? 'Access Denied' : 'Sync Failed'}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 font-mono text-[10px] text-slate-500 break-all">
                            {syncError.message}
                        </div>

                        {(syncError.message?.toLowerCase().includes('permission') || syncError.code === 'PERMISSION_DENIED') && (
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-6">
                                <p className="text-xs font-black text-amber-700 mb-2 uppercase tracking-wide">Action Required: Fix Firebase Rules</p>
                                <ol className="text-xs font-bold text-slate-600 list-decimal pl-4 space-y-2">
                                    <li>Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Firebase Console</a></li>
                                    <li>Go to <span className="font-black">Realtime Database Rules</span></li>
                                    <li>Ensure rules allow public read/write if you don't have auth configured yet:
                                        <pre className="bg-slate-900 text-amber-400 p-2 rounded mt-1 overflow-x-auto">
                                            {`{ ".read": true, ".write": true }`}
                                        </pre>
                                    </li>
                                    <li>Click <span className="font-black text-indigo-600">Publish</span></li>
                                </ol>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;

