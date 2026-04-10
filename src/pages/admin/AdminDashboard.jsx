import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, ShoppingBag, Users, AlertCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, push, set } from 'firebase/database';
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
    Legend
} from 'recharts';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isBulkListOpen, setIsBulkListOpen] = useState(false);
    const [viewAllBulk, setViewAllBulk] = useState(false);

    // Excel Export State
    const [exportSource, setExportSource] = useState('AdminOrder');
    const [exportTime, setExportTime] = useState('All Time');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');


    useEffect(() => {
        const ordersRef = ref(db, 'orders');
        const productsRef = ref(db, 'products');
        const usersRef = ref(db, 'users');
        const messagesRef = ref(db, 'messages');

        const unsubOrders = onValue(ordersRef, (snap) => {
            const data = snap.val();
            console.log("[Dashboard] Raw Orders Data snapped:", data ? Object.keys(data).length : "NULL");
            if (data) {
                const list = Object.keys(data).map(key => ({
                    ...data[key],
                    firebaseId: key,
                    orderId: data[key].orderId || data[key].id || key
                }));
                console.log("[Dashboard] Parsed Orders list length:", list.length);
                setOrders(list);
            } else {
                setOrders([]);
            }
            setIsLoading(false);
        }, (err) => {
            console.error("Orders sync error:", err);
            setIsLoading(false);
        });
        const unsubProducts = onValue(productsRef, (snap) => setProducts(Object.values(snap.val() || {})));
        const unsubUsers = onValue(usersRef, (snap) => setUsers(Object.values(snap.val() || {})));

        const unsubMessages = onValue(messagesRef, (snap) => {
            const data = snap.val();
            if (data) {
                setMessages(Object.keys(data).map(key => ({ ...data[key], id: key })));
            } else {
                setMessages([]);
            }
        });

        return () => {
            unsubOrders();
            unsubProducts();
            unsubUsers();
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
        XLSX.writeFile(wb, `${exportSource}_${exportTime.replace(' ', '_')}_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    // Derived Statistics
    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        const pendingOrders = orders.filter(o =>
            o.status?.toUpperCase() === 'PENDING' ||
            o.status?.toUpperCase() === 'PLACED' ||
            o.status?.toUpperCase() === 'PROCESSING'
        ).length;
        const uniqueEmails = new Set(orders.map(o => o.email).filter(Boolean));
        const totalCustomers = Math.max(users.length, uniqueEmails.size);

        return {
            totalSales,
            totalOrders: orders.length,
            totalCustomers,
            pendingOrders
        };
    }, [orders, users]);

    // Graph Data Processing
    const salesChartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            name: month,
            sales: orders.filter(o => {
                if (!o.date) return false;
                const date = new Date(o.date);
                return date.toLocaleString('default', { month: 'short' }) === month;
            }).reduce((sum, o) => sum + (o.grandTotal || 0), 0)
        }));
    }, [orders]);

    const ordersChartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            name: month,
            orders: orders.filter(o => {
                if (!o.date) return false;
                const date = new Date(o.date);
                return date.toLocaleString('default', { month: 'short' }) === month;
            }).length
        }));
    }, [orders]);

    const categoryData = useMemo(() => {
        const counts = products.reduce((acc, p) => {
            const cat = p.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
        
        return Object.keys(counts)
            .map(name => ({ name, value: counts[name] }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [products]);

    const bulkOrders = useMemo(() => {
        return messages.filter(m => m.type === 'bulk_order');
    }, [messages]);

    const bulkOrdersChartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            name: month,
            orders: bulkOrders.filter(m => {
                const date = m.timestamp ? new Date(m.timestamp) : new Date();
                return date.toLocaleString('default', { month: 'short' }) === month;
            }).length
        }));
    }, [bulkOrders]);

    const COLORS = ['#10b981', '#f59e0b'];
    return (
        <div className="w-full animate-fade-in pb-12">
            {/* Header Area */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Dashboard Overview</h1>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors">Home</span>
                    <span>/</span>
                    <span className="text-indigo-600">Dashboard</span>
                </div>
            </div>

            {/* Excel Export Toolbar */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Excel Export:</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Source Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Data Source</label>
                        <select 
                            value={exportSource} 
                            onChange={(e) => setExportSource(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="AdminOrder">Orders</option>
                            <option value="AdminCustomer">Customers</option>
                            <option value="AdminPayment">Payments</option>
                            <option value="AdminInventory">Inventory</option>
                        </select>
                    </div>

                    {/* Time Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Time Period</label>
                        <select 
                            value={exportTime} 
                            onChange={(e) => setExportTime(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="All Time">All Time</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Custom">Custom Range</option>
                        </select>
                    </div>

                    {/* Custom Date Range Inputs */}
                    {exportTime === 'Custom' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Start Date</label>
                                <input 
                                    type="date" 
                                    value={customStartDate} 
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">End Date</label>
                                <input 
                                    type="date" 
                                    value={customEndDate} 
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700"
                                />
                            </div>
                        </>
                    )}

                    <button 
                        onClick={handleExportExcel}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all self-end"
                    >
                        Export Excel
                    </button>
                </div>
            </div>


{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {/* Total Sales */}
    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-40">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-3xl font-black text-slate-800">₹{stats.totalSales.toLocaleString()}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">Total Sales</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <DollarSign size={24} strokeWidth={2.5} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+12.5% live data</span>
        </div>
    </div>

    {/* Total Orders */}
    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-40">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-3xl font-black text-slate-800">{stats.totalOrders}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">Total Orders</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+8.2% live data</span>
        </div>
    </div>

    {/* Total Customers */}
    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-40">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-3xl font-black text-slate-800">{stats.totalCustomers}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">Total Customers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Users size={24} strokeWidth={2.5} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+15.3% live data</span>
        </div>
    </div>

    {/* Pending Orders */}
    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-40">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-3xl font-black text-slate-800">{stats.pendingOrders}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">Orders Placed</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <AlertCircle size={24} strokeWidth={2.5} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            <span>Real-time tracking</span>
        </div>
    </div>
</div>

{/* Charts Section */ }
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Overview Chart */}
                <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Sales Overview</h2>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] relative">
                        <ResponsiveContainer width="99%" height={300}>
                            <LineChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8b5cf6' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Pie Chart */}
                <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Inventory Split</h2>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Category</span>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] relative">
                        <ResponsiveContainer width="99%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
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
                                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bulk Orders Overview Chart */}
                <div 
                    onClick={() => setIsBulkListOpen(true)}
                    className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 cursor-pointer group hover:border-indigo-200 transition-all"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Bulk Orders</h2>
                            <p className="text-xs text-slate-400 font-semibold">Click to view details</p>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-widest">Enquiries</span>
                    </div>
                    <div className="h-[300px] w-full min-h-[300px] relative">
                        <ResponsiveContainer width="99%" height={300}>
                            <BarChart data={bulkOrdersChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
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

            <style dangerouslySetInnerHTML={{ __html: `
                 @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            ` }} />
        </div >
    );
};

export default AdminDashboard;

