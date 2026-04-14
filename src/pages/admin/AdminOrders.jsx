import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { isToday, isThisWeek, isThisMonth, isThisYear, parseISO, isValid, differenceInDays, format } from 'date-fns';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, update, remove } from 'firebase/database';
import { Download, Eye, X, Check, ShoppingCart, FileText, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderDetailModal from './OrderDetailModal';
import useScrollLock from '../../hooks/useScrollLock';
import UserAvatar from '../../components/common/UserAvatar';



const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All Time');
    const [searchQuery, setSearchQuery] = useState('');

    useScrollLock(!!selectedOrder);

    // Sync with Firebase
    useEffect(() => {
        const ordersRef = ref(db, 'orders');

        // Safety Timeout
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        const unsubOrders = onValue(ordersRef, (snapshot) => {
            clearTimeout(safetyTimeout);
            try {
                const data = snapshot.val();
                if (data) {
                    const orderList = Object.keys(data).map(key => ({
                        ...data[key],
                        firebaseId: key,
                        orderId: data[key].orderId || data[key].id || key
                    }));
                    setOrders(orderList.reverse());
                } else {
                    setOrders([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error processing orders:", error);
                setIsLoading(false);
            }
        }, (error) => {
            clearTimeout(safetyTimeout);
            console.error("Firebase onValue error:", error);
            setIsLoading(false);
        });

        return () => unsubOrders();
    }, []);

    const handleStatusChange = (order, newStatus) => {
        const orderRef = ref(db, `orders/${order.firebaseId}`);

        // Update timeline if it exists
        let updatedTimeline = order.timeline ? [...order.timeline] : [];
        const statusMap = { 'Placed': 0, 'Confirmed': 1, 'Shipped': 2, 'Delivered': 3 };
        const targetIndex = statusMap[newStatus];

        if (updatedTimeline.length > 0 && targetIndex !== undefined) {
            updatedTimeline = updatedTimeline.map((step, idx) => {
                if (idx <= targetIndex) {
                    return { ...step, completed: true };
                }
                return step;
            });
        }

        const updates = { status: newStatus };
        if (updatedTimeline.length > 0) {
            updates.timeline = updatedTimeline;
        }

        update(orderRef, updates);
    };

    const handleCancelOrder = (firebaseId) => {
        if (window.confirm('Are you sure you want to Cancel this order on ground of Out of Stock?')) {
            const orderRef = ref(db, `orders/${firebaseId}`);
            const order = orders.find(o => o.firebaseId === firebaseId);
            
            let updatedTimeline = order && order.timeline ? [...order.timeline] : [];
            updatedTimeline = updatedTimeline.filter(s => s.status === 'Pending' || s.status === 'Placed');
            updatedTimeline.push({
                status: 'Cancelled',
                date: new Date().toISOString(),
                completed: true,
                desc: 'Order Cancelled (Out of Stock)'
            });

            update(orderRef, {
                status: 'Cancelled',
                cancelReason: 'Current out of stock',
                timeline: updatedTimeline
            });
        }
    };


    // Removed auto-update order status logic as per user request to prevent "self-changing" values.


    // Calculate stats
    const stats = {
        total: orders.length,
        placed: orders.filter(o => o.status === 'Placed' || o.status === 'Pending').length,
        delivered: orders.filter(o => o.status === 'Delivered' || o.status === 'Success').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length,
        returned: orders.filter(o => o.status === 'Returned').length
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = statusFilter === 'All' || 
                                 order.status === statusFilter || 
                                 (statusFilter === 'Success' && order.status === 'Delivered');

            let matchesDate = true;
            if (dateFilter !== 'All Time' && order.date) {
                const orderDate = parseISO(order.date);
                if (isValid(orderDate)) {
                    if (dateFilter === 'Today') matchesDate = isToday(orderDate);
                    else if (dateFilter === 'This Week') matchesDate = isThisWeek(orderDate);
                    else if (dateFilter === 'This Month') matchesDate = isThisMonth(orderDate);
                    else if (dateFilter === 'This Year') matchesDate = isThisYear(orderDate);
                }
            }

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery || 
                                 (order.orderId || '').toLowerCase().includes(searchLower) ||
                                 (order.customer || '').toLowerCase().includes(searchLower) ||
                                 (order.payment || '').toLowerCase().includes(searchLower);

            return matchesStatus && matchesDate && matchesSearch;
        });
    }, [orders, statusFilter, dateFilter, searchQuery]);

    const handleExportExcel = () => {
        const dataToExport = filteredOrders.map(order => ({
            'Order ID': order.orderId,
            'Customer': order.customer || 'Anonymous',
            'Amount': order.grandTotal || order.amount || 0,
            'Payment': order.payment || 'N/A',
            'Status': order.status,
            'Date': order.date || 'N/A'
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, `Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12 px-2">
            <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-black text-[#111827] tracking-tight">Orders Management</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingCart size={14} className="text-amber-500" />
                        Main / Orders
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2.5 bg-[#111827] hover:bg-[#1e293b] text-white py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        <Download size={18} strokeWidth={3} />
                        Export Sheet
                    </button>
                </div>
            </div>

            {/* Orders Container */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                                <FileText size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#111827]">Order Records</h2>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{filteredOrders.length} records active</p>
                            </div>
                        </div>

                        {/* Status Tabs */}
                        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                            {['All', 'Placed', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        statusFilter === status 
                                        ? 'bg-white text-amber-600 shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search Order ID, Customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50/80 border-none rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 placeholder:text-slate-400 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest text-slate-600 py-3.5 pl-4 pr-10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 shadow-sm appearance-none cursor-pointer min-w-[140px] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_16px_center]"
                            >
                                <option value="All Time">All Time</option>
                                <option value="Today">Today</option>
                                <option value="This Week">This Week</option>
                                <option value="This Month">This Month</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Date</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Amount</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                                        No order records found
                                    </td>
                                </tr>
                            ) : filteredOrders.map((item) => (
                                <tr key={item.firebaseId} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-5 px-8">
                                        <span className="font-bold text-[#111827] text-sm tracking-tight group-hover:text-amber-600 transition-colors cursor-pointer" onClick={() => setSelectedOrder(item)}>#{item.orderId.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="py-5 px-6 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                {(item.customer || 'A').charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-700">{item.customer || 'Guest User'}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="text-[11px] font-bold text-slate-500">
                                            {item.date && isValid(parseISO(item.date)) ? format(parseISO(item.date), 'dd MMM, yyyy') : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="font-black text-[#111827] text-sm">₹{item.grandTotal || item.amount || 0}</span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <select
                                            value={item.status === 'Success' ? 'Delivered' : item.status}
                                            onChange={(e) => handleStatusChange(item, e.target.value)}
                                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block min-w-[120px] border-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer transition-all ${
                                                (item.status === 'Delivered' || item.status === 'Success') ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' :
                                                (item.status === 'Pending' || item.status === 'Placed') ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' :
                                                (item.status === 'Confirmed') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                                                (item.status === 'Cancelled' || item.status === 'Returned') ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' :
                                                'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Placed">Placed</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Returned">Returned</option>
                                        </select>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {(item.status === 'Pending' || item.status === 'Placed') && (
                                                <button
                                                    onClick={() => handleStatusChange(item, 'Confirmed')}
                                                    className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-100 transition-colors active:scale-95"
                                                    title="Confirm Order"
                                                >
                                                    <Check size={14} strokeWidth={3} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedOrder(item)}
                                                className="w-8 h-8 flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg border border-amber-100 transition-colors active:scale-95"
                                                title="View Details"
                                            >
                                                <Eye size={14} strokeWidth={3} />
                                            </button>
                                            <button
                                                onClick={() => handleCancelOrder(item.firebaseId)}
                                                className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-100 transition-colors active:scale-95"
                                                title="Cancel Order"
                                            >
                                                <X size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}


        </div>
    );
};

export default AdminOrders;

