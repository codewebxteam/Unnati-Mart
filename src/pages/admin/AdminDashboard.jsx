import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, Users, ShoppingBag,
    DollarSign, Package, Clock, CheckCircle,
    ArrowRight, Filter, Download as DownloadIcon, RefreshCcw,
    ChevronRight, CreditCard, ShoppingCart, X, Database, AlertCircle, AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, push, set, remove } from 'firebase/database';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area
} from 'recharts';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isBulkListOpen, setIsBulkListOpen] = useState(false);
    const [viewAllBulk, setViewAllBulk] = useState(false);
    const [syncError, setSyncError] = useState(null);

    // Excel Export State
    const [exportSource, setExportSource] = useState('AdminOrder');
    const [exportTime, setExportTime] = useState('All Time');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    // Mock seeding logic
    const handleSeedData = async () => {
        if (!window.confirm('This will populate your database with mock data. Existing items might be duplicated. Proceed?')) return;

        try {
            // Seed Categories
            const catRef = ref(db, 'categories');
            const seedCategories = [
                { name: 'Fruits & Vegetables', slug: 'fruits-veg', image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400', status: 'Active' },
                { name: 'Dairy & Bakery', slug: 'dairy-bakery', image: 'https://images.unsplash.com/photo-1550583724-125581cc258b?w=400', status: 'Active' },
                { name: 'Men\'s Wear', slug: 'mens-wear', image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400', status: 'Active' },
                { name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', status: 'Active' },
                { name: 'Cookware', slug: 'cookware', image: 'https://images.unsplash.com/photo-1584990344319-7244ca704251?w=400', status: 'Active' }
            ];
            for (const cat of seedCategories) {
                const newCatRef = push(catRef);
                await set(newCatRef, { ...cat, firebaseId: newCatRef.key, createdAt: new Date().toISOString() });
            }

            // Seed Products
            const prodRef = ref(db, 'products');
            const products = [
                { name: 'Premium Organic Broccoli', price: 85, stock: 150, category: 'Vegetables', unit: '500g', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400' },
                { name: 'Fresh Green Spinach', price: 45, stock: 135, category: 'Vegetables', unit: '250g', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
                { name: 'Local Sweet Carrots', price: 60, stock: 120, category: 'Vegetables', unit: '1kg', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400' },
                { name: 'Organic Red Tomatoes', price: 40, stock: 105, category: 'Vegetables', unit: '1kg', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
                { name: 'Farm Fresh Red Apples', price: 180, stock: 90, category: 'Fruits', unit: '1kg', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?w=400' },
                { name: 'Sweet Valencia Oranges', price: 120, stock: 75, category: 'Fruits', unit: '1kg', img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400' },
                { name: 'Golden Bananas', price: 60, stock: 60, category: 'Fruits', unit: '1 doz', img: 'https://images.unsplash.com/photo-1571771894821-ad9b58864c9a?w=400' },
                { name: 'Fresh Pomegranate', price: 220, stock: 45, category: 'Fruits', unit: '1kg', img: 'https://images.unsplash.com/photo-1615484477771-3183778a873c?w=400' },
                { name: 'Premium Toor Dal', price: 160, stock: 30, category: 'Grocery & Staples', unit: '1kg', img: 'https://images.unsplash.com/photo-1585994192703-f3908889ff6a?w=400' },
                { name: 'Organic Moong Dal', price: 140, stock: 15, category: 'Grocery & Staples', unit: '1kg', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb75bb44?w=400' }
            ];
            for (const prod of products) {
                const status = prod.stock === 0 ? 'Out of Stock' : prod.stock < 10 ? 'Low Stock' : 'Active';
                await push(prodRef, { ...prod, status, createdAt: new Date().toISOString() });
            }

            // Seed Orders
            const ordersRef = ref(db, 'orders');
            const orders = [
                { customer: 'Rahul Sharma', email: 'rahul@example.com', grandTotal: 545, status: 'Pending', date: new Date(Date.now() - 3600000).toISOString(), payment: 'UPI' },
                { customer: 'Priya Verma', email: 'priya@example.com', grandTotal: 1280, status: 'Delivered', date: new Date(Date.now() - 86400000).toISOString(), payment: 'Credit Card' },
                { customer: 'Amit Singh', email: 'amit@example.com', grandTotal: 350, status: 'Cancelled', date: new Date(Date.now() - 172800000).toISOString(), payment: 'COD' }
            ];
            for (const order of orders) {
                await push(ordersRef, { ...order, orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase() });
            }

            // Seed Users
            const usersRef = ref(db, 'users');
            const usersMock = [
                { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', joinedAt: new Date(Date.now() - 2592000000).toISOString() },
                { name: 'Priya Verma', email: 'priya@example.com', phone: '9876543211', joinedAt: new Date(Date.now() - 5184000000).toISOString() }
            ];
            for (const user of usersMock) {
                await push(usersRef, user);
            }

            alert('Database seeded successfully!');
        } catch (err) {
            console.error('Seeding error:', err);
            alert('Failed to seed database.');
        }
    };

    const handleClearData = async () => {
        if (!window.confirm('WARNING: This will permanently delete ALL data (Products, Orders, Customers) from the database. Proceed?')) return;
        if (!window.confirm('Final Confirmation: Are you absolutely sure? This cannot be undone.')) return;

        try {
            await Promise.all([
                remove(ref(db, 'products')),
                remove(ref(db, 'orders')),
                remove(ref(db, 'users')),
                remove(ref(db, 'categories')),
                remove(ref(db, 'messages'))
            ]);
            alert('All database nodes cleared successfully!');
        } catch (err) {
            console.error('Clear error:', err);
            alert('Failed to clear database: ' + err.message);
        }
    };


    useEffect(() => {
        const ordersRef = ref(db, 'orders');
        const productsRef = ref(db, 'products');
        const usersRef = ref(db, 'users');
        const messagesRef = ref(db, 'messages');
        const categoriesRef = ref(db, 'categories');

        // Safety Timeout
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 8000);

        const unsubOrders = onValue(ordersRef, (snap) => {
            clearTimeout(safetyTimeout);
            const data = snap.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    ...data[key],
                    firebaseId: key,
                    orderId: data[key].orderId || data[key].id || key
                }));
                setOrders(list);
            } else {
                setOrders([]);
            }
            setIsLoading(false);
        }, (err) => {
            clearTimeout(safetyTimeout);
            console.error("Orders sync error:", err);
            setSyncError(err);
            setIsLoading(false);
        });

        const unsubProducts = onValue(productsRef, (snap) => setProducts(Object.values(snap.val() || {})), (err) => setSyncError(err));
        const unsubUsers = onValue(usersRef, (snap) => setUsers(Object.values(snap.val() || {})), (err) => setSyncError(err));
        const unsubCategories = onValue(categoriesRef, (snap) => setCategories(Object.values(snap.val() || {})), (err) => setSyncError(err));

        const unsubMessages = onValue(messagesRef, (snap) => {
            const data = snap.val();
            if (data) {
                setMessages(Object.keys(data).map(key => ({ ...data[key], id: key })));
            } else {
                setMessages([]);
            }
        }, (err) => setSyncError(err));

        return () => {
            unsubOrders();
            unsubProducts();
            unsubUsers();
            unsubCategories();
            unsubMessages();
        };
    }, []);

    const handleExportExcel = () => {
        let filteredData = [];
        let headers = [];

        const now = new Date();
        const getDateLimit = (period) => {
            const d = new Date();
            switch (period) {
                case 'Weekly': return new Date(d.setDate(d.getDate() - 7)).getTime();
                case 'Monthly': return new Date(d.setMonth(d.getMonth() - 1)).getTime();
                case 'Yearly': return new Date(d.setFullYear(d.getFullYear() - 1)).getTime();
                case 'Custom': return { start: customStartDate ? new Date(customStartDate).getTime() : 0, end: customEndDate ? new Date(customEndDate).getTime() : Infinity };
                default: return 0;
            }
        };

        const limit = getDateLimit(exportTime);

        if (exportSource === 'AdminOrder' || exportSource === 'AdminPayment') {
            filteredData = orders.filter(o => {
                if (!o.date) return false;
                const oDate = new Date(o.date).getTime();
                if (exportTime === 'Custom') {
                    return oDate >= limit.start && oDate <= limit.end;
                }
                return exportTime === 'All Time' ? true : oDate >= limit;
            });

            if (exportSource === 'AdminOrder') {
                headers = [["Order ID", "Customer", "Email", "Total", "Payment", "Status", "Date"]];
                filteredData = filteredData.map(o => [
                    o.orderId || o.id || 'N/A',
                    o.shippingAddress?.fullName || 'Anonymous',
                    o.email || 'N/A',
                    `₹${o.grandTotal || 0}`,
                    o.payment || 'N/A',
                    o.status || 'N/A',
                    new Date(o.date).toLocaleDateString()
                ]);
            } else {
                headers = [["Order ID", "Date", "Amount", "Method", "Status"]];
                filteredData = filteredData.map(o => [
                    o.orderId || o.id || 'N/A',
                    new Date(o.date).toLocaleDateString(),
                    `₹${o.grandTotal || 0}`,
                    o.payment || 'N/A',
                    o.status || 'N/A'
                ]);
            }
        }
        else if (exportSource === 'AdminCustomer') {
            const customerMap = {};
            orders.forEach(order => {
                const uid = order.userId || `guest_${order.firebaseId}`;
                if (!customerMap[uid]) {
                    customerMap[uid] = { name: order.shippingAddress?.fullName || 'Anonymous', email: order.email || 'N/A', orders: 0, spent: 0, joined: 'N/A' };
                }
                customerMap[uid].orders += 1;
                customerMap[uid].spent += (order.grandTotal || 0);
            });

            users.forEach(u => {
                const uid = u.id || u.uid;
                if (!customerMap[uid]) {
                    customerMap[uid] = { name: u.displayName || u.name || 'Anonymous', email: u.email || 'N/A', orders: 0, spent: 0, joined: u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A' };
                } else if (u.joinedAt) {
                    customerMap[uid].joined = new Date(u.joinedAt).toLocaleDateString();
                }
            });

            filteredData = Object.values(customerMap);
            headers = [["Name", "Email", "Total Orders", "Total Spent", "Joined Date"]];
            filteredData = filteredData.map(c => [c.name, c.email, c.orders, `₹${c.spent}`, c.joined]);
        }
        else if (exportSource === 'AdminInventory') {
            filteredData = products;
            headers = [["Name", "Category", "Price", "Stock", "Status"]];
            filteredData = filteredData.map(p => [
                p.name, p.category, `₹${p.price}`, p.stock, p.status || (p.stock > 0 ? 'In Stock' : 'Out of Stock')
            ]);
        }

        if (filteredData.length === 0) {
            alert("No data found for the selected filters.");
            return;
        }

        const ws = XLSX.utils.aoa_to_sheet([...headers, ...filteredData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${exportSource}_${exportTime.replace(' ', '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // Derived Statistics
    const stats = useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Sales Logic
        const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        const curWeekSales = orders
            .filter(o => new Date(o.date) >= oneWeekAgo)
            .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        const prevWeekSales = orders
            .filter(o => {
                const d = new Date(o.date);
                return d >= twoWeeksAgo && d < oneWeekAgo;
            })
            .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

        // Orders Logic
        const totalOrders = orders.length;
        const curWeekOrders = orders.filter(o => new Date(o.date) >= oneWeekAgo).length;
        const prevWeekOrders = orders.filter(o => {
            const d = new Date(o.date);
            return d >= twoWeeksAgo && d < oneWeekAgo;
        }).length;

        // Customers Logic
        const uniqueEmails = new Set(orders.map(o => o.email).filter(Boolean));
        const totalCustomers = Math.max(users.length, uniqueEmails.size);
        const curWeekUsers = users.filter(u => new Date(u.joinedAt) >= oneWeekAgo).length;
        const prevWeekUsers = users.filter(u => {
            const d = new Date(u.joinedAt);
            return d >= twoWeeksAgo && d < oneWeekAgo;
        }).length;

        const pendingOrders = orders.filter(o =>
            o.status?.toUpperCase() === 'PENDING' ||
            o.status?.toUpperCase() === 'PLACED' ||
            o.status?.toUpperCase() === 'PROCESSING'
        ).length;

        const calculateChange = (cur, prev) => {
            if (prev === 0) return cur > 0 ? '+100%' : '0%';
            const pct = ((cur - prev) / prev) * 100;
            return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
        };

        return {
            totalSales,
            totalOrders,
            totalCustomers,
            pendingOrders,
            changes: {
                sales: calculateChange(curWeekSales, prevWeekSales),
                orders: calculateChange(curWeekOrders, prevWeekOrders),
                customers: calculateChange(curWeekUsers, prevWeekUsers)
            }
        };
    }, [orders, users]);

    // Graph Data Processing
    // Get last 6 months dynamically
    const chartMonths = useMemo(() => {
        const months = [];
        const d = new Date();
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
            months.push(monthDate.toLocaleString('default', { month: 'short' }));
        }
        return months;
    }, []);

    const chartData = useMemo(() => {
        return chartMonths.map(month => ({
            name: month,
            revenue: orders.filter(o => {
                if (!o.date) return false;
                const date = new Date(o.date);
                return date.toLocaleString('default', { month: 'short' }) === month;
            }).reduce((sum, o) => sum + (o.grandTotal || 0), 0)
        }));
    }, [orders, chartMonths]);

    const ordersChartData = useMemo(() => {
        return chartMonths.map(month => ({
            name: month,
            orders: orders.filter(o => {
                if (!o.date) return false;
                const date = new Date(o.date);
                return date.toLocaleString('default', { month: 'short' }) === month;
            }).length
        }));
    }, [orders, chartMonths]);

    const taxonomyData = useMemo(() => {
        if (categories.length === 0) return [];
        return categories.map(cat => ({
            name: cat.name || 'Unnamed Category',
            value: 1
        })).sort((a, b) => b.value - a.value);
    }, [categories]);

    const inventoryData = useMemo(() => {
        if (products.length === 0) return [];
        const counts = products.reduce((acc, p) => {
            const cat = p.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(counts)
            .map(name => ({
                name: name,
                value: counts[name]
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [products]);

    const bulkOrders = useMemo(() => {
        return messages.filter(m => m.type === 'bulk_order');
    }, [messages]);

    const bulkOrdersChartData = useMemo(() => {
        return chartMonths.map(month => ({
            name: month,
            orders: bulkOrders.filter(m => {
                const date = m.timestamp ? new Date(m.timestamp) : new Date();
                return date.toLocaleString('default', { month: 'short' }) === month;
            }).length
        }));
    }, [bulkOrders, chartMonths]);

    const COLORS = [
        '#d97706', // Amber
        '#10b981', // Emerald
        '#6366f1', // Indigo
        '#ef4444', // Rose
        '#f59e0b', // Yellow
        '#06b6d4', // Cyan
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#3b82f6', // Blue
        '#64748b'  // Slate
    ];
    return (
        <div className="w-full animate-fade-in pb-12 px-2 sm:px-4">
            {/* Header Area */}
            <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Dashboard</h1>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[10px] md:text-sm font-medium text-slate-500">
                        <span className="hover:text-amber-600 cursor-pointer transition-colors">Home</span>
                        <span>/</span>
                        <span className="text-amber-600">Overview</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleClearData} className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors shadow-sm active:scale-95 flex items-center gap-2">
                            <Database size={12} strokeWidth={3} />
                            Clear All Data
                        </button>
                        <button onClick={handleSeedData} className="px-5 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors shadow-sm active:scale-95">
                            Seed Mock Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Analytics Export Toolbar */}
            <div className="bg-white p-5 md:p-6 rounded-3xl md:rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-6 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner shrink-0">
                        <DownloadIcon size={20} className="md:size-[24px]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-black text-[#111827]">Analytics</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-end gap-3 md:gap-4 flex-1 justify-end w-full">
                    <div className="flex flex-col gap-1 w-full lg:min-w-[140px]">
                        <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">Source</label>
                        <select
                            value={exportSource}
                            onChange={(e) => setExportSource(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-[11px] font-black uppercase text-slate-700 focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                        >
                            <option value="AdminOrder">Orders</option>
                            <option value="AdminCustomer">Customers</option>
                            <option value="AdminPayment">Payments</option>
                            <option value="AdminInventory">Inventory</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 min-w-[140px]">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Period</label>
                        <select
                            value={exportTime}
                            onChange={(e) => setExportTime(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-[11px] font-black uppercase text-slate-700 focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                        >
                            <option value="All Time">All Time</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Custom">Custom Range</option>
                        </select>
                    </div>

                    {exportTime === 'Custom' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-700"
                            />
                            <span className="text-slate-300 font-bold">to</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-700"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleExportExcel}
                        className="w-full sm:w-auto bg-[#111827] hover:bg-[#1e293b] text-white px-6 py-3 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 px-0">
                {[
                    { label: 'TOTAL SALES', value: `₹${stats.totalSales.toLocaleString()}`, icon: <DollarSign size={20} />, change: stats.changes.sales, color: 'amber' },
                    { label: 'ORDERS', value: stats.totalOrders, icon: <ShoppingBag size={20} />, change: stats.changes.orders, color: 'amber' },
                    { label: 'CUSTOMERS', value: stats.totalCustomers, icon: <Users size={20} />, change: stats.changes.customers, color: 'amber' },
                    { label: 'PENDING', value: stats.pendingOrders, icon: <Clock size={20} />, change: 'Active', color: 'rose' }
                ].map((stat, i) => {
                    const isNegative = stat.change.startsWith('-');
                    const isNeutral = stat.change === '0%' || stat.change === 'Active';

                    return (
                        <div key={i} className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner`}>
                                    <div className="transform group-hover:scale-110 transition-transform duration-500">
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-3xl font-black text-[#111827]">{stat.value}</h3>
                                <div className={`flex items-center gap-1.5 text-[9px] font-black mt-2 ${isNegative ? 'text-rose-500' :
                                    isNeutral ? 'text-slate-400' :
                                        'text-emerald-500'
                                    }`}>
                                    {isNegative ? <TrendingDown size={12} strokeWidth={3} /> : <TrendingUp size={12} strokeWidth={3} />}
                                    <span>{stat.change}</span>
                                    <span className="text-slate-300 font-bold ml-1 uppercase">
                                        {stat.label === 'PENDING' ? 'State' : 'from last week'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Overview Chart */}
                <div className="bg-white rounded-[1.5rem] p-5 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Sales Overview</h2>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
                    </div>
                    <div className="h-[350px] w-full min-h-[350px] relative">
                        <ResponsiveContainer width="99%" height={350}>
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#d97706"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inventory Split Pie Chart */}
                <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Inventory Split</h2>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Category</span>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] relative">
                        <ResponsiveContainer width="99%" height={300}>
                            <PieChart>
                                <Pie
                                    data={inventoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {inventoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Overview Chart */}
                <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Orders Overview</h2>
                    <div className="h-[300px] w-full min-h-[300px] relative">
                        <ResponsiveContainer width="99%" height={300}>
                            <BarChart data={ordersChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="orders" fill="#d97706" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div
                    onClick={() => setIsBulkListOpen(true)}
                    className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 cursor-pointer group hover:border-amber-200 transition-all"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Category Distribution</h2>
                            <p className="text-xs text-slate-400 font-semibold">Overview of store taxonomy</p>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest">Analytics</span>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] relative">
                        <ResponsiveContainer width="99%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taxonomyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {taxonomyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '12px'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bulk Orders List Modal */}
            {isBulkListOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl border border-white/50 animate-fade-in max-h-[85vh] flex flex-col">
                        <button
                            onClick={() => { setIsBulkListOpen(false); setViewAllBulk(false); }}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="text-xl font-black text-slate-900">Bulk Order Enquiries</h4>
                                <p className="text-xs text-slate-400 font-semibold">Total: {bulkOrders.length}</p>
                            </div>
                            {bulkOrders.length > 5 && !viewAllBulk && (
                                <button
                                    onClick={() => setViewAllBulk(true)}
                                    className="text-xs font-black text-indigo-600 hover:underline"
                                >
                                    View All
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {bulkOrders.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm font-medium py-10">No enquiries found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {(viewAllBulk ? bulkOrders : bulkOrders.slice(0, 5)).map((msg) => (
                                        <div key={msg.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="text-sm font-black text-slate-800">{msg.name || 'Anonymous'}</h5>
                                                    <p className="text-[11px] text-slate-500 font-medium">{msg.email || 'No Email'}</p>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-700 font-semibold leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                                                {msg.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" onClick={() => setSyncError(null)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-[501] shadow-2xl p-6 border-2 border-rose-200 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-4 text-red-600">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Database Connectivity Error</h2>
                                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{syncError.code === 'PERMISSION_DENIED' ? 'Access Denied' : 'Sync Failed'}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 font-mono text-[10px] text-slate-500 break-all">
                            {syncError.message}
                        </div>

                        {syncError.message?.toLowerCase().includes('permission') && (
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

export default AdminDashboard;
