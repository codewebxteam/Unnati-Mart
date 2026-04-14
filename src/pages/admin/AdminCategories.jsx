import React, { useState, useEffect } from 'react';
import { Tags, Plus, Search, Edit2, Trash2, Eye, EyeOff, Layers, Activity } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import CategoryModal from './CategoryModal';

const AdminCategories = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [statusTab, setStatusTab] = useState('All');

    // Fetch data
    useEffect(() => {
        const catRef = ref(db, 'categories');
        const prodRef = ref(db, 'products');

        const unsubCategories = onValue(catRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCategories(Object.entries(data).map(([key, val]) => ({
                    ...val,
                    firebaseId: key
                })));
            } else {
                setCategories([]);
            }
            setIsLoading(false);
        });



        const unsubProducts = onValue(prodRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setProducts(Object.values(data));
            }
        });

        return () => {
            unsubCategories();
            unsubProducts();
        };
    }, []);

    // Category Handlers
    const handleAddCategory = () => {
        setSelectedCategory(null);
        setIsCatModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsCatModalOpen(true);
    };

    const handleSaveCategory = async (formData) => {
        setIsCatModalOpen(false);
        try {
            if (selectedCategory) {
                const { firebaseId, ...dataToSave } = formData;
                await update(ref(db, `categories/${selectedCategory.firebaseId}`), dataToSave);
            } else {
                const newCatRef = push(ref(db, 'categories'));
                await set(newCatRef, {
                    ...formData,
                    firebaseId: newCatRef.key,
                    createdAt: new Date().toISOString()
                });
            }
        } catch (err) {
            console.error("Error saving category:", err);
            alert("Failed to save category");
            setIsCatModalOpen(true);
        }
    };

    const handleDeleteCategory = async (firebaseId) => {
        if (window.confirm('Delete this category?')) {
            try {
                await remove(ref(db, `categories/${firebaseId}`));
            } catch (err) {
                alert("Deletion failed");
            }
        }
    };



    const getProductCount = (categoryName) => {
        return products.filter(p => p.category === categoryName).length;
    };



    const filteredCategories = categories.filter(c => {
        const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusTab === 'All' || c.status === statusTab;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12 px-2">
            {/* Header Section */}
            <div className="bg-white rounded-[2.5rem] p-8 mb-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-amber-600 shadow-inner">
                        <Layers size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Categories</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Classification Management Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-200 active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Add Category
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white/50 rounded-[3rem] border border-slate-100 border-dashed animate-pulse">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Taxonomy...</p>
                </div>
            ) : (
                <>
            {/* Categories Grid Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        Categories
                        <span className="inline-flex items-center justify-center bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {filteredCategories.length} Active Layers
                        </span>
                    </h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Quick Find..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
                        {['All', 'Active', 'Hidden'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusTab(status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusTab === status 
                                    ? 'bg-amber-600 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-50 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                        <Tags size={40} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-widest">No results found</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Adjust your filters or add a new category to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                    {filteredCategories.map(cat => (
                        <div key={cat.firebaseId} className="group bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all border border-slate-50 relative overflow-hidden flex flex-col items-center text-center">


                            {/* Image/Icon */}
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform duration-500 ring-8 ring-white shadow-inner overflow-hidden">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain" />
                                ) : (
                                    <span className="text-4xl">{cat.icon || '📁'}</span>
                                )}
                            </div>

                            <h3 className="text-xl font-black text-[#111827] mb-1">{cat.name}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <Activity size={12} className="text-amber-500" />
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{getProductCount(cat.name)} Products Connected</span>
                            </div>

                            <div className="w-full flex items-center gap-3 mt-auto">
                                <button 
                                    onClick={() => handleEditCategory(cat)}
                                    className="flex-1 bg-slate-50 hover:bg-black hover:text-white text-slate-600 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteCategory(cat.firebaseId)}
                                    className="w-12 h-12 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all active:scale-95 flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {cat.status === 'Hidden' && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                                    <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg border border-amber-200">
                                        <EyeOff size={14} /> Hidden from Store
                                        <button onClick={() => handleEditCategory(cat)} className="ml-2 hover:underline">Reveal</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
                </>
            )}

            {/* Modals */}
            <CategoryModal 
                isOpen={isCatModalOpen}
                onClose={() => setIsCatModalOpen(false)}
                onSave={handleSaveCategory}
                category={selectedCategory}
            />



            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
            `}} />
        </div>
    );
};

export default AdminCategories;

