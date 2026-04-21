import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, ChevronRight, Box, Calendar,
    CheckCircle2, Clock, Truck, Home,
    ArrowLeft, Search, Filter, MoreVertical, X
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import useScrollLock from '../../hooks/useScrollLock';
import ReviewModal from '../../components/product/ReviewModal';
import { useAuth } from '../../context/AuthContext';

const OrdersPage = () => {
    const { orders } = useOrders();
    const navigate = useNavigate();
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const selectedOrder = orders.find(o => o.id === selectedOrderId);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');
    const { user } = useAuth();
    const [reviewingProduct, setReviewingProduct] = useState(null);

    useScrollLock(!!selectedOrder);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600';
            case 'Placed': return 'bg-blue-100 text-blue-600';
            case 'Confirmed': return 'bg-purple-100 text-purple-600';
            case 'Shipped': return 'bg-indigo-100 text-indigo-600';
            case 'Delivered': return 'bg-amber-100 text-amber-600';
            case 'Cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const formatDate = (dateString, includeTime = false) => {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().substr(-2);

        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';

        let formatted = `${dayName}, ${day}${suffix} ${month} '${year}`;
        if (includeTime) {
            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
            formatted = `${dayName}, ${day}${suffix} ${month} '${year} - ${time}`;
        }
        return formatted;
    };

    const statusHierarchy = { 'Pending': 0, 'Placed': 1, 'Confirmed': 2, 'Shipped': 3, 'Delivered': 4 };

    return (
        <div className="min-h-screen bg-[#fdfdfd] pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-6">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/')}
                            className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </motion.button>
                        <div>
                            <h1 className="text-2xl font-serif text-[#3a3f30] tracking-tight leading-none mb-1">My Orders</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage and track your orders</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 border border-slate-100">
                            <Package size={48} />
                        </div>
                        <h2 className="text-2xl font-serif text-[#3a3f30] mb-3">No orders found</h2>
                        <p className="text-sm text-slate-400 mb-8 max-w-xs">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-[#111827] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:bg-amber-600"
                        >
                            Explore Products
                        </motion.button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                layoutId={order.id}
                                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-amber-100 transition-all duration-500 group"
                            >
                                <div className="p-8">
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                                <Box size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID: {order.id}</p>
                                                <p className="text-xs font-bold text-slate-900">Placed on {formatDate(order.date)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-3 shrink-0">
                                                <div className="w-40 h-40 bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm group-hover:border-amber-100 transition-all duration-500 relative overflow-hidden">
                                                    <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                {order.status === 'Delivered' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setReviewingProduct(item);
                                                        }}
                                                        className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-100 flex items-center gap-2"
                                                    >
                                                        Rate Product
                                                    </motion.button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-xl font-bold font-serif text-[#313628]">₹{(order.grandTotal || order.amount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedOrderId(order.id)}
                                                className="px-6 py-3 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200/50 flex items-center gap-2"
                                            >
                                                Track Order <ChevronRight size={14} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Tracking Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setSelectedOrderId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white w-full h-full flex flex-col overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header: Simple Back Arrow to mimic single-page dedicated page */}
                            <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                                <button
                                    onClick={() => setSelectedOrderId(null)}
                                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-700 transition-colors"
                                >
                                    <ArrowLeft size={22} strokeWidth={1.8} />
                                </button>
                                <span className="text-sm font-bold text-slate-400">Track Order</span>
                            </div>

                            {/* Center Timeline Area */}
                            <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-hide bg-white">
                                <div className="relative space-y-6">
                                    {selectedOrder.timeline.map((step, idx) => {
                                        const currentStepIndex = statusHierarchy[selectedOrder.status] ?? 0;
                                        const isCompleted = idx <= currentStepIndex;
                                        const hasNext = idx < selectedOrder.timeline.length - 1;
                                        const isNextCompleted = (idx + 1) <= currentStepIndex;

                                        return (
                                            <div key={idx} className="relative flex gap-5 pb-8 last:pb-0">
                                                {/* Left Column: Dot & Connecting Line */}
                                                <div className="flex flex-col items-center w-5 shrink-0 relative">
                                                    {hasNext && (
                                                        <div className={`w-[2.5px] absolute top-6 bottom-[-34px] left-[9px] ${isNextCompleted ? 'bg-amber-600 shadow-[0_0_8px_rgba(22,163,74,0.3)]' : 'bg-slate-100'}`} />
                                                    )}
                                                    <div className={`relative z-10 w-4 h-4 mt-1 rounded-full shrink-0 border-[3px] border-white ring-1 ring-slate-100 ${isCompleted ? 'bg-amber-600 shadow-[0_0_10px_rgba(22,163,74,0.4)]' : 'bg-slate-300'}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 -mt-0.5">
                                                    {/* Header: Status and Date */}
                                                    <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                                                        <h4 className={`text-[15px] font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                                            {step.status}
                                                        </h4>
                                                        {(step.date && isCompleted) && (
                                                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                                                {formatDate(step.date)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <div className="space-y-1.5">
                                                        <p className={`text-sm leading-relaxed ${isCompleted ? 'text-slate-700' : 'text-slate-300'}`}>
                                                            {step.desc}
                                                        </p>
                                                        {step.date && isCompleted && (
                                                            <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                                                <span className="w-1 h-1 rounded-full bg-amber-600" />
                                                                {formatDate(step.date, true)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="h-4 bg-white shrink-0" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {reviewingProduct && (
                    <ReviewModal 
                        product={reviewingProduct}
                        user={user}
                        onClose={() => setReviewingProduct(null)}
                        onReviewSubmitted={() => {
                            // Optionally show a success toast here
                            setReviewingProduct(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrdersPage;

