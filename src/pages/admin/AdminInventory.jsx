import React, { useState, useEffect, useMemo } from 'react';
import { PackageSearch, AlertTriangle, TrendingDown, BoxSelect, PackageCheck, X, Plus, Upload, Trash2, Box, Layers, ShoppingCart, Activity, Search, RotateCcw, ArrowRight, MoreVertical, Warehouse } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import { realtimeDb as db, storage } from '../../firebase';
import { ref, onValue, update, push, set, remove } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.6) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const DEFAULT_CATEGORIES = [
    "Select Category",
    "grocery",
    "fruits",
    "veg",
    "dairy",
    "snacks",
    "beverages",
    "personal_care",
    "household",
    "wellness",
    "baby",
    "dry_fruits"
];

const AdminInventory = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newStock, setNewStock] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', discount: '', description: '', image: null, stock: '', category: '', specification: '', highlights: ''
    });
    const [syncError, setSyncError] = useState(null);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editProduct, setEditProduct] = useState({
        name: '', price: '', discount: '', description: '', image: null, stock: '', category: '', specification: '', highlights: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusTab, setStatusTab] = useState('All');
    const [categories, setCategories] = useState([]);

    const allCategoryOptions = useMemo(() => {
        // Source 1: Dynamic Categories from DB
        const dynamicNames = categories.map(c => c.name);

        // Source 2: Categories currently used in products
        const productCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

        // Source 3: Always include Hardcoded Defaults as fallbacks/primary choices
        const baseDefaults = DEFAULT_CATEGORIES;

        // Combined and Deduplicated List
        const combined = Array.from(new Set([
            ...baseDefaults, 
            ...dynamicNames, 
            ...productCategories
        ]));

        return combined.sort((a, b) => {
            if (a === "Select Category") return -1;
            if (b === "Select Category") return 1;
            return a.localeCompare(b);
        });
    }, [categories, products]);

    useScrollLock(isUpdateModalOpen || isAddModalOpen || isClearModalOpen || isDeleteModalOpen);

    // Sync Products and Orders
    useEffect(() => {
        const productsRef = ref(db, 'products');
        const ordersRef = ref(db, 'orders');
        const categoriesRef = ref(db, 'categories');

        // Safety Timeout
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        const unsubProducts = onValue(productsRef, (snapshot) => {
            clearTimeout(safetyTimeout);
            const data = snapshot.val() || {};
            const productList = Object.keys(data).map(key => ({
                ...data[key],
                firebaseId: key
            })).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            setProducts(productList);
            setIsLoading(false);
        });

        const unsubOrders = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val() || {};
            const orderList = Object.values(data);
            setOrders(orderList);
        });

        const unsubCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.entries(data).map(([key, val]) => ({
                    ...val,
                    firebaseId: key
                }));
                setCategories(list);
                // Update default category for newProduct if it's currently hardcoded and choices exist
                if (list.length > 0) {
                    setNewProduct(prev => ({ ...prev, category: prev.category || list[0].name }));
                }
            } else {
                setCategories([]);
            }
        });

        return () => {
            unsubProducts();
            unsubOrders();
            unsubCategories();
        };
    }, []);

    // Calculate committed stock for each product
    const getCommittedStock = (productId) => {
        return orders
            .filter(o => o.status === 'Pending' || o.status === 'Placed' || o.status === 'Confirmed')
            .reduce((acc, order) => {
                const item = order.items?.find(i => i.firebaseId === productId || i.id === productId);
                return acc + (item ? (item.quantity || 0) : 0);
            }, 0);
    };

    const handleClearEntireList = async () => {
        setIsClearing(true);
        try {
            await remove(ref(db, 'products'));
            setIsClearModalOpen(false);
        } catch (err) {
            console.error("Clear list failed:", err);
            alert("❌ Failed to clear inventory: " + err.message);
        } finally {
            setIsClearing(false);
        }
    };

    const handleUpdateClick = (item) => {
        setSelectedItem(item);
        setEditProduct({
            name: item.name || '',
            price: item.price || '',
            discount: item.discount || 0,
            description: item.description || '',
            stock: item.stock || '',
            category: item.category || 'Dairy Product',
            specification: item.specification || '',
            highlights: item.highlights || '',
            image: null
        });
        setIsUpdateModalOpen(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProduct(prev => ({ ...prev, image: file }));
        }
    };

    const handleProductUpdate = async (e) => {
        e.preventDefault();
        if (isPublishing) return;
        setIsPublishing(true);

        const stockNum = parseInt(editProduct.stock, 10);
        let status = 'Active';
        if (stockNum === 0) status = 'Out of Stock';
        else if (stockNum < 10) status = 'Low Stock';

        let imageUrl = selectedItem.img || '';
        if (editProduct.image) {
            try {
                const compressedImage = await compressImage(editProduct.image);
                imageUrl = compressedImage;
            } catch (err) {
                console.error("Image processing failed:", err);
                setIsPublishing(false);
                return;
            }
        }

        const productData = {
            ...selectedItem,
            name: editProduct.name,
            category: editProduct.category,
            price: parseFloat(editProduct.price),
            stock: stockNum,
            status: status,
            img: imageUrl,
            description: editProduct.description,
            specification: editProduct.specification,
            highlights: editProduct.highlights,
            discount: editProduct.discount || 0,
            updatedAt: new Date().toISOString()
        };

        try {
            await update(ref(db, `products/${selectedItem.firebaseId}`), productData);
            setIsUpdateModalOpen(false);
            setSelectedItem(null);
        } catch (err) {
            console.error("Update product failed:", err);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleProductDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await remove(ref(db, `products/${itemToDelete.firebaseId}`));
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            console.error("Delete product failed:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProduct(prev => ({ ...prev, image: file }));
        }
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        if (isPublishing) return;
        setIsPublishing(true);

        let imageUrl = '';
        if (newProduct.image) {
            try {
                imageUrl = await compressImage(newProduct.image);
            } catch (err) {
                console.error("Image processing failed:", err);
                setIsPublishing(false);
                return;
            }
        }

        const stockNum = parseInt(newProduct.stock, 10);
        const productData = {
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            stock: stockNum,
            status: stockNum === 0 ? 'Out of Stock' : stockNum < 10 ? 'Low Stock' : 'Active',
            img: imageUrl,
            description: newProduct.description,
            specification: newProduct.specification,
            highlights: newProduct.highlights,
            discount: newProduct.discount || 0,
            createdAt: new Date().toISOString()
        };

        try {
            await push(ref(db, 'products'), productData);
            setIsAddModalOpen(false);
            setNewProduct({
                name: '', price: '', discount: '', description: '', image: null, stock: '', category: 'Vegetables', specification: '', highlights: ''
            });
        } catch (err) {
            console.error("Add product failed:", err);
        } finally {
            setIsPublishing(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const s = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                (p.name || '').toLowerCase().includes(s) ||
                (p.category || '').toLowerCase().includes(s) ||
                (p.firebaseId || '').toLowerCase().includes(s);

            return matchesSearch;
        });
    }, [products, searchQuery]);

    const handleQuickStockUpdate = async (product, delta) => {
        const currentStock = parseInt(product.stock || 0);
        const nextStock = Math.max(0, currentStock + delta);
        const status = nextStock === 0 ? 'Out of Stock' : nextStock < 10 ? 'Low Stock' : 'Active';

        try {
            await update(ref(db, `products/${product.firebaseId}`), {
                stock: nextStock,
                status: status,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Quick stock update failed:", err);
        }
    };


    const stats = useMemo(() => {
        const lowStockItems = products.filter(p => p.stock > 0 && p.stock < 10);
        const outOfStockItems = products.filter(p => !p.stock || p.stock === 0);
        const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

        return {
            totalProducts: products.length,
            lowStock: lowStockItems,
            outOfStock: outOfStockItems,
            inventoryValue
        };
    }, [products]);

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 px-2">
                {[
                    { label: 'TOTAL ITEMS', value: stats.totalProducts, icon: <PackageCheck size={20} />, color: 'emerald' },
                    { label: 'LOW STOCK', value: stats.lowStock.length, icon: <TrendingDown size={20} />, color: 'amber' },
                    { label: 'OUT OF STOCK', value: stats.outOfStock.length, icon: <AlertTriangle size={20} />, color: 'rose' },
                    { label: 'INVENTORY VALUE', value: `₹${(stats.inventoryValue / 1000).toFixed(1)}k`, icon: <BoxSelect size={20} />, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:border-amber-500/20 transition-all">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h3 className="text-2xl font-black text-[#111827]">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Inventory Card */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mx-2">
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                            <Warehouse size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#111827]">Inventory Control</h2>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-end">
                        <div className="relative w-full md:max-w-xs">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search SKU or Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50/80 border-none rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 placeholder:text-slate-400 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Plus size={16} strokeWidth={3} />
                                New Item
                            </button>
                        </div>

                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Item</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">On Hand</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Committed</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Available</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent shadow-lg"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Inventory...</span>
                                    </div>
                                </td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="6" className="py-24 text-center text-slate-300 font-black uppercase tracking-widest text-xs">No entries match your search criteria</td></tr>
                            ) : filteredProducts.map((item) => {
                                const committed = getCommittedStock(item.firebaseId);
                                const available = Math.max(0, (item.stock || 0) - committed);

                                return (
                                    <tr key={item.firebaseId} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                    {item.img ? (
                                                        <img src={item.img} alt={item.name} className="w-10 h-10 object-contain rounded-lg" />
                                                    ) : (
                                                        item.category === 'Vegetables' ? '🥦' : item.category === 'Fruits' ? '🍎' : '📦'
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-[#111827] block text-sm group-hover:text-amber-600 transition-colors">{item.name}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 block">{item.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleQuickStockUpdate(item, -1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors font-black"
                                                >
                                                    -
                                                </button>
                                                <span className={`text-sm font-black min-w-[30px] ${item.stock < 10 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
                                                    {item.stock}
                                                </span>
                                                <button
                                                    onClick={() => handleQuickStockUpdate(item, 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-600 rounded-lg transition-colors font-black"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <span className={`text-sm font-black ${committed > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{committed}</span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <span className={`text-sm font-black ${available < 10 ? 'text-amber-500' : 'text-amber-600'}`}>{available}</span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${available === 0 ? 'bg-rose-50 text-rose-500' :
                                                available < 10 ? 'bg-amber-50 text-amber-500' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                {available === 0 ? 'OUT OF STOCK' : available < 10 ? 'LOW STOCK' : 'IN STOCK'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateClick(item)}
                                                    className="w-8 h-8 flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg border border-amber-100 transition-colors active:scale-95"
                                                    title="Update Item"
                                                >
                                                    <PackageSearch size={14} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-100 transition-colors active:scale-95"
                                                    title="Delete Item"
                                                >
                                                    <Trash2 size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Product Modal Overlay */}
            {isUpdateModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsUpdateModalOpen(false)}></div>

                    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in custom-scrollbar">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-20">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Update Product</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Modify the details of the selected item.</p>
                            </div>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        <form onSubmit={handleProductUpdate} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Left Column: Image Upload */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Image (Leave empty to keep current)</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative overflow-hidden">
                                            {editProduct.image ? (
                                                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                                                    <span className="text-4xl mb-2">📸</span>
                                                    <span className="text-sm font-semibold text-slate-600 px-4 text-center truncate w-full">
                                                        {editProduct.image.name}
                                                    </span>
                                                </div>
                                            ) : selectedItem.img ? (
                                                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                                                    <img src={selectedItem.img} alt={selectedItem.name} className="w-3/4 h-3/4 object-contain" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-400 group-hover:text-amber-600 transition-colors">
                                                    <Upload size={32} className="mb-3" />
                                                    <span className="text-sm font-semibold">Click to upload new image</span>
                                                    <span className="text-xs font-medium mt-1">SVG, PNG, JPG or GIF</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleEditImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Highlights (Comma separated)</label>
                                        <textarea
                                            name="highlights"
                                            value={editProduct.highlights}
                                            onChange={handleEditInputChange}
                                            rows="4"
                                            placeholder="e.g. Organic, Freshly Picked, Rich in Calcium"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all resize-none custom-scrollbar"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Right Column: Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Row 1 */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Name <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editProduct.name}
                                            onChange={handleEditInputChange}
                                            placeholder="e.g. Fresh Cow Milk"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Row 2: Category & Quantity */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="text-rose-500">*</span></label>
                                            <select
                                                name="category"
                                                value={editProduct.category}
                                                onChange={handleEditInputChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all appearance-none"
                                            >
                                                {allCategoryOptions.length > 0 ? (
                                                    allCategoryOptions.map((catName) => (
                                                        <option key={catName} value={catName}>
                                                            {catName}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">No Categories Available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (Stock) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={editProduct.stock}
                                                onChange={handleEditInputChange}
                                                min="0"
                                                placeholder="e.g. 100"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Pricing */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editProduct.price}
                                                onChange={handleEditInputChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:font-medium"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Discount (%)</label>
                                            <input
                                                type="number"
                                                name="discount"
                                                value={editProduct.discount}
                                                onChange={handleEditInputChange}
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4: Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={editProduct.description}
                                            onChange={handleEditInputChange}
                                            rows="3"
                                            placeholder="Enter complete product description..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                                        ></textarea>
                                    </div>

                                    {/* Row 5: Specification */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Specifications</label>
                                        <textarea
                                            name="specification"
                                            value={editProduct.specification}
                                            onChange={handleEditInputChange}
                                            rows="3"
                                            placeholder="Brand: Unnati Mart\nWeight: 500g\nStorage: Keep Refrigerated"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/30 disabled:opacity-75 flex items-center gap-2"
                                >
                                    {isPublishing ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Single Product Confirmation Modal */}
            {isDeleteModalOpen && itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => !isDeleting && setIsDeleteModalOpen(false)}></div>

                    <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in p-6">
                        <div className="flex items-center gap-4 mb-4 text-rose-600">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Trash2 size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Delete Product?</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">{itemToDelete.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mb-6">
                            Are you sure you want to delete this product from the inventory? This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleProductDelete}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/30 disabled:opacity-70 flex items-center gap-2"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Product Modal Overlay */}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsAddModalOpen(false)}></div>

                    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in custom-scrollbar">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-20">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Add New Product</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Fill in the details to restock or list a new item.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        <form onSubmit={handleAddProductSubmit} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Left Column: Image Upload */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative overflow-hidden">
                                            {newProduct.image ? (
                                                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                                                    <span className="text-4xl mb-2">📸</span>
                                                    <span className="text-sm font-semibold text-slate-600 px-4 text-center truncate w-full">
                                                        {newProduct.image.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                    <Upload size={32} className="mb-3" />
                                                    <span className="text-sm font-semibold">Click to upload image</span>
                                                    <span className="text-xs font-medium mt-1">SVG, PNG, JPG or GIF</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Highlights (Comma separated)</label>
                                        <textarea
                                            name="highlights"
                                            value={newProduct.highlights}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="e.g. Organic, Freshly Picked, Rich in Calcium"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Right Column: Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Row 1 */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Name <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Fresh Cow Milk"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Row 2: Category & Quantity */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="text-rose-500">*</span></label>
                                            <select
                                                name="category"
                                                value={newProduct.category}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all appearance-none"
                                            >
                                                {allCategoryOptions.length > 0 ? (
                                                    allCategoryOptions.map((catName) => (
                                                        <option key={catName} value={catName}>
                                                            {catName}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">No Categories Available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (Stock) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={newProduct.stock}
                                                onChange={handleInputChange}
                                                min="0"
                                                placeholder="e.g. 100"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Pricing */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={newProduct.price}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:font-medium"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Discount (%)</label>
                                            <input
                                                type="number"
                                                name="discount"
                                                value={newProduct.discount}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4: Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={newProduct.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Enter complete product description..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                                        ></textarea>
                                    </div>

                                    {/* Row 5: Specification */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Specifications</label>
                                        <textarea
                                            name="specification"
                                            value={newProduct.specification}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Brand: Unnati Mart\nWeight: 500g\nStorage: Keep Refrigerated"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-75 flex items-center gap-2"
                                >
                                    {isPublishing ? 'Publishing...' : 'Publish Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Clear Entire List Confirmation Modal */}
            {isClearModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => !isClearing && setIsClearModalOpen(false)}></div>

                    <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in p-6">
                        <div className="flex items-center gap-4 mb-4 text-rose-600">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Trash2 size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Clear Entire Inventory?</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mb-6">
                            Are you sure you want to delete all products from the inventory? This will remove all items from the database list immediately.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={isClearing}
                                onClick={() => setIsClearModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isClearing}
                                onClick={handleClearEntireList}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/30 disabled:opacity-70 flex items-center gap-2"
                            >
                                {isClearing ? 'Clearing...' : 'Yes, Clear All'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            ` }} />

            {/* ERROR DIAGNOSTICS MODAL */}
            {syncError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md animate-fade-in" onClick={() => setSyncError(null)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl p-6 border-2 border-rose-200 animate-fade-in">
                        <div className="flex items-center gap-4 mb-4 text-red-600">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Database Access Blocked</h2>
                                <p className="text-xs font-bold text-slate-500">{syncError.message}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mb-6">
                            Your Firebase Realtime Database is rejecting reads. This is caused by locking Rules in your online Firebase Console account.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
                            <p className="text-xs font-black text-slate-700 mb-2">Step-by-Step Fix Instructions:</p>
                            <ol className="text-xs font-bold text-slate-600 list-decimal pl-4 space-y-3">
                                <li>Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-black">Firebase Console</a> website</li>
                                <li>Click <span className="text-slate-900 font-extrabold">Realtime Database</span> on top of left sidebar</li>
                                <li>Go to the <span className="text-slate-900 font-extrabold">Rules</span> tab at the top-center</li>
                                <li>Replace everything with this code accurately:
                                    <pre className="bg-slate-900 text-amber-400 p-3 rounded-lg mt-1 font-mono text-[10px] select-all shadow-inner">
                                        {`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
                                    </pre>
                                </li>
                                <li>Click the blue <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black">Publish</span> button at top right!</li>
                            </ol>
                        </div>

                        <button onClick={() => setSyncError(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-98">
                            Close and Retry Connection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;

