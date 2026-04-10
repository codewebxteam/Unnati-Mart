import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { isToday, isThisWeek, isThisMonth, isThisYear, parseISO, isValid, differenceInDays, format } from 'date-fns';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, update, remove } from 'firebase/database';
import { Download, Eye, X, Check } from 'lucide-react';
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

    useScrollLock(!!selectedOrder);

    // Sync with Firebase
    useEffect(() => {
        const ordersRef = ref(db, 'orders');

        const unsubOrders = onValue(ordersRef, (snapshot) => {
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
        placed: orders.filter(o => o.status === 'Placed').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

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
            return matchesStatus && matchesDate;
        });
    }, [orders, statusFilter, dateFilter]);

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Orders</h1>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/admin/dashboard')}>Home</span>
                        <span>/</span>
                        <span className="text-indigo-600">Orders</span>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Orders */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">{stats.total}</h3>
                    <p className="text-sm font-bold text-slate-400">Total Orders</p>
                </div>

                {/* Orders Placed */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                    <h3 className="text-[2.2rem] font-black text-amber-500 tracking-tight mb-1">{stats.placed}</h3>
                    <p className="text-sm font-bold text-slate-400">Orders Placed</p>
                </div>

                {/* Delivered */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                    <h3 className="text-[2.2rem] font-black text-amber-500 tracking-tight mb-1">{stats.delivered}</h3>
                    <p className="text-sm font-bold text-slate-400">Delivered</p>
                </div>

                {/* Cancelled */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                    <h3 className="text-[2.2rem] font-black text-red-500 tracking-tight mb-1">{stats.cancelled}</h3>
                    <p className="text-sm font-bold text-slate-400">Cancelled</p>
                </div>
            </div>

            {/* All Orders Table */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-800">All Orders</h2>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-slate-200 text-sm font-bold text-slate-700 py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_12px_center]"
                        >
                            <option value="All">All Status</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Placed">Order Placed</option>
                            <option value="Confirmed">Order Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Date Filter */}
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white border border-slate-200 text-sm font-bold text-slate-700 py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_12px_center]"
                        >
                            <option value="All Time">All Time</option>
                            <option value="Today">Today</option>
                            <option value="This Week">This Week</option>
                            <option value="This Month">This Month</option>
                            <option value="This Year">This Year</option>
                        </select>

                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-indigo-100"
                        >
                            <Download size={16} strokeWidth={2.5} />
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Order ID</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Payment</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Date</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map((item, index) => (
                                <tr key={item.firebaseId || item.id || index} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className="font-bold text-slate-600 text-sm">{item.orderId}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={item.customer} size="sm" />
                                            <span className="text-sm font-semibold text-slate-700">{item.customer}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-bold text-slate-700">₹{(item.grandTotal || item.amount || 0).toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-500">{item.payment}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item, e.target.value)}
                                            className={`text-xs font-bold py-1.5 px-3 rounded-full border focus:outline-none appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_10px_center] ${item.status === 'Delivered' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                item.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                    item.status === 'Confirmed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        item.status === 'Placed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            item.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Placed">Order Placed</option>
                                            <option value="Confirmed">Order Confirmed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-500">
                                            {item.date && isValid(parseISO(item.date)) ? format(parseISO(item.date), 'dd MMM yyyy, hh:mm a') : item.date || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                             <button
                                                 onClick={() => setSelectedOrder(item)}
                                                 className="text-slate-400 hover:text-indigo-600 transition-colors"
                                                 title="View Order Details"
                                             >
                                                 <Eye size={18} strokeWidth={2.5} />
                                             </button>
                                             {(item.status === 'Pending' || item.status === 'Placed') && (
                                                 <button
                                                     onClick={() => handleStatusChange(item, item.status === 'Pending' ? 'Placed' : 'Confirmed')}
                                                     className="text-amber-500 hover:text-amber-600 transition-colors"
                                                     title={item.status === 'Pending' ? "Confirm Order" : "Mark as Confirmed"}
                                                 >
                                                     <Check size={20} strokeWidth={2.5} />
                                                 </button>
                                             )}
                                            {item.status !== 'Cancelled' && item.status !== 'Delivered' && (
                                                <button
                                                    onClick={() => handleCancelOrder(item.firebaseId)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Cancel Order (Out of Stock)"
                                                >
                                                    <X size={18} strokeWidth={2.5} />
                                                </button>
                                            )}
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

