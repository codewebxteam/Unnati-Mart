import React, { useState, useEffect, useMemo } from 'react';
import { Download, CreditCard, Wallet, Receipt, RefreshCcw, Search, Filter, ChevronDown, Calendar, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb as db } from '../../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminPayments = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [syncError, setSyncError] = useState(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMethod, setFilterMethod] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('All Time');
    const [filterAmount, setFilterAmount] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    // UI Dropdown toggles
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [revenuePeriod, setRevenuePeriod] = useState('Today');
    const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);

    const toggleDropdown = (name) => {
        setActiveDropdown(prev => prev === name ? null : name);
    };

    // Close dropdowns on click outside (simplified for demo, ideally use a ref hook)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.filter-dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const ordersRef = ref(db, 'orders');

        // Safety Timeout
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 8000);

        const unsubscribe = onValue(ordersRef, (snapshot) => {
            clearTimeout(safetyTimeout);
            const data = snapshot.val() || {};
            const orderList = Object.keys(data).map(key => ({
                ...data[key],
                firebaseId: key
            }));
            setOrders(orderList.reverse());
            setIsLoading(false);
        }, (err) => {
            clearTimeout(safetyTimeout);
            console.error("Payments sync error:", err);
            setSyncError(err);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const stats = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        let totalRevenue = 0;
        let onlinePayments = 0;
        let codPayments = 0;
        let todayRevenue = 0;
        let weekRevenue = 0;
        let monthRevenue = 0;

        orders.forEach(o => {
            const amount = o.grandTotal || 0;
            const oDate = new Date(o.date).getTime();

            if (o.status !== 'Failed' && o.status !== 'Refunded') {
                totalRevenue += amount;
                if (o.payment?.toUpperCase() === 'COD') codPayments += amount;
                else onlinePayments += amount;

                if (oDate >= startOfToday) todayRevenue += amount;
                if (oDate >= startOfWeek) weekRevenue += amount;
                if (oDate >= startOfMonth) monthRevenue += amount;
            }
        });

        return {
            totalRevenue,
            onlinePayments,
            codPayments,
            todayRevenue,
            weekRevenue,
            monthRevenue,
            pendingRefunds: orders.filter(o => o.status === 'Refund Pending').length
        };
    }, [orders]);

    // Apply all filters and sorts
    const filteredAndSortedOrders = useMemo(() => {
        let result = [...orders];

        // Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(o =>
                (o.firebaseId && o.firebaseId.toLowerCase().includes(lowerQ)) ||
                (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(lowerQ))
            );
        }

        // Method
        if (filterMethod !== 'All') {
            if (filterMethod === 'Online') {
                result = result.filter(o => o.payment?.toUpperCase() !== 'COD');
            } else {
                result = result.filter(o => o.payment?.toUpperCase() === filterMethod.toUpperCase());
            }
        }

        // Status
        if (filterStatus !== 'All') {
            result = result.filter(o => o.status === filterStatus);
        }

        // Date
        if (filterDate !== 'All Time') {
            const now = new Date();
            const getStart = () => {
                const d = new Date();
                switch (filterDate) {
                    case 'Today': return new Date(d.setHours(0, 0, 0, 0)).getTime();
                    case 'This Week': return new Date(d.setDate(d.getDate() - d.getDay())).setHours(0, 0, 0, 0);
                    case 'This Month': return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
                    case 'This Year': return new Date(d.getFullYear(), 0, 1).getTime();
                    default: return 0;
                }
            };
            const start = getStart();
            result = result.filter(o => new Date(o.date).getTime() >= start);
        }

        // Amount
        if (filterAmount !== 'All') {
            result = result.filter(o => {
                const amt = o.grandTotal || 0;
                if (filterAmount === '0–500') return amt >= 0 && amt <= 500;
                if (filterAmount === '500–2000') return amt > 500 && amt <= 2000;
                if (filterAmount === '2000–5000') return amt > 2000 && amt <= 5000;
                if (filterAmount === '5000+') return amt > 5000;
                return true;
            });
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortBy === 'Oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sortBy === 'Highest Amount') return (b.grandTotal || 0) - (a.grandTotal || 0);
            if (sortBy === 'Lowest Amount') return (a.grandTotal || 0) - (b.grandTotal || 0);
            return 0;
        });

        return result;
    }, [orders, searchQuery, filterMethod, filterStatus, filterDate, filterAmount, sortBy]);

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Report Header
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text('Payments Report', 14, 22);

        // Report Metadata
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
        doc.text(`Total Records: ${filteredAndSortedOrders.length}`, 14, 38);

        // Calculate filtered revenue
        const filteredRev = filteredAndSortedOrders.reduce((sum, o) => {
            if (o.status !== 'Failed' && o.status !== 'Refunded') {
                return sum + (o.grandTotal || 0);
            }
            return sum;
        }, 0);
        doc.text(`Visible Revenue: ₹${filteredRev.toLocaleString()}`, 14, 44);

        // Prepare table data
        const tableColumn = ["Order ID", "Customer", "Amount", "Method", "Status", "Date"];
        const tableRows = [];

        filteredAndSortedOrders.forEach(o => {
            const orderData = [
                `#${o.firebaseId.slice(-6).toUpperCase()}`,
                o.shippingAddress?.fullName || 'Anonymous',
                `₹${o.grandTotal}`,
                o.payment || 'N/A',
                o.status || 'N/A',
                new Date(o.date).toLocaleDateString()
            ];
            tableRows.push(orderData);
        });

        // Generate autoTable
        doc.autoTable({
            startY: 52,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: 'bold' }, // Amber-600
            alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate-50
            styles: { fontSize: 9, cellPadding: 4 },
        });

        // Save
        const filename = `payments_report_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
    };

    // Helper to style the Method pill
    const getMethodStyle = (method) => {
        switch (method?.toUpperCase()) {
            case 'UPI': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'CARD': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'COD': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    // Helper to style the Status pill
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Success':
            case 'Delivered': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Failed': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12">
            {/* Header Area */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Payments</h1>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span className="hover:text-amber-600 cursor-pointer transition-colors">Home</span>
                    <span>/</span>
                    <span className="text-amber-600">Payments</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden group border-b-4 border-b-slate-500">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Wallet size={16} /> Total Revenue
                    </p>
                </div>

                {/* Online Payments */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden group border-b-4 border-b-amber-500">
                    <h3 className="text-[2.2rem] font-black text-amber-600 tracking-tight mb-1">₹{stats.onlinePayments.toLocaleString()}</h3>
                    <p className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={16} /> Online Payments
                    </p>
                </div>

                {/* COD Payments */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden group border-b-4 border-b-amber-500">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">₹{stats.codPayments.toLocaleString()}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Receipt size={16} /> COD Payments
                    </p>
                </div>

                {/* Pending Refunds */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden group border-b-4 border-b-rose-500">
                    <h3 className="text-[2.2rem] font-black text-rose-500 tracking-tight mb-1">{stats.pendingRefunds}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <RefreshCcw size={16} /> Pending Refunds
                    </p>
                </div>

                {/* Period Revenue */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative border-b-4 border-b-blue-500">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[2rem] font-black text-slate-800 tracking-tight">
                            ₹{revenuePeriod === 'Today' ? stats.todayRevenue.toLocaleString() :
                                revenuePeriod === 'Week' ? stats.weekRevenue.toLocaleString() :
                                    stats.monthRevenue.toLocaleString()}
                        </h3>
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowRevenueDropdown(!showRevenueDropdown); }}
                                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                {revenuePeriod} <ChevronDown size={12} />
                            </button>
                            {showRevenueDropdown && (
                                <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30">
                                    {['Today', 'Week', 'Month'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => { setRevenuePeriod(opt); setShowRevenueDropdown(false); }}
                                            className={`w-full text-left px-3 py-1.5 text-xs font-bold ${revenuePeriod === opt ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" /> Revenue
                    </p>
                </div>
            </div>

            {/* Advanced Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[280px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all placeholder:font-medium"
                    />
                </div>

                {/* Dropdowns Container */}
                <div className="flex flex-wrap items-center gap-2 filter-dropdown-container">

                    {/* Method Filter */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('method')} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 py-2 px-3 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors">
                            Method: <span className="text-amber-600">{filterMethod}</span> <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'method' && (
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                {['All', 'Online', 'COD', 'UPI', 'Card'].map(opt => (
                                    <button key={opt} onClick={() => { setFilterMethod(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs font-bold ${filterMethod === opt ? 'bg-amber-50 text-amber-600' : 'text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('status')} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 py-2 px-3 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors">
                            Status: <span className="text-amber-600">{filterStatus}</span> <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'status' && (
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                {['All', 'Pending', 'Delivered', 'Success', 'Failed', 'Refunded', 'Refund Pending'].map(opt => (
                                    <button key={opt} onClick={() => { setFilterStatus(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs font-bold ${filterStatus === opt ? 'bg-amber-50 text-amber-600' : 'text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('date')} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 py-2 px-3 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors">
                            <Calendar size={14} /> Date: <span className="text-blue-600">{filterDate}</span> <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'date' && (
                            <div className="absolute top-full right-0 lg:left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                {['All Time', 'Today', 'This Week', 'This Month', 'This Year'].map(opt => (
                                    <button key={opt} onClick={() => { setFilterDate(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs font-bold ${filterDate === opt ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Amount Filter */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('amount')} className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 py-2 px-3 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors">
                            Amount: <span className="text-amber-600">{filterAmount}</span> <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'amount' && (
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                {['All', '0–500', '500–2000', '2000–5000', '5000+'].map(opt => (
                                    <button key={opt} onClick={() => { setFilterAmount(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs font-bold ${filterAmount === opt ? 'bg-amber-50 text-amber-600' : 'text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Filter */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('sort')} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors shadow-md">
                            <ArrowUpDown size={14} /> Sort: {sortBy}
                        </button>
                        {activeDropdown === 'sort' && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                {['Newest', 'Oldest', 'Highest Amount', 'Lowest Amount'].map(opt => (
                                    <button key={opt} onClick={() => { setSortBy(opt); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 text-xs font-bold ${sortBy === opt ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Order ID</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Method</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan="6" className="py-10 text-center text-slate-400 font-black uppercase tracking-widest text-xs">Syncing payments...</td></tr>
                            ) : filteredAndSortedOrders.length === 0 ? (
                                <tr><td colSpan="6" className="py-10 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No transactions match your filters</td></tr>
                            ) : filteredAndSortedOrders.map((o) => (
                                <tr key={o.firebaseId} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className="font-bold text-slate-600 text-sm">#{o.firebaseId.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-700">{o.shippingAddress?.fullName || 'Anonymous'}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-bold text-slate-700">₹{o.grandTotal}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getMethodStyle(o.payment)}`}>
                                            {o.payment || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-500">{new Date(o.date).toLocaleDateString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Payment Sync Error</h2>
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

export default AdminPayments;

