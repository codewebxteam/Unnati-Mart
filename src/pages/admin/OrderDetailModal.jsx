import React, { useEffect } from 'react';
import { ArrowLeft, User, MapPin, Package, CreditCard, Clock, Phone, Mail, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollLock from '../../hooks/useScrollLock';

const OrderDetailModal = ({ order, onClose }) => {
    useScrollLock(!!order);

    if (!order) return null;

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            const options = { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                ...(includeTime && { hour: '2-digit', minute: '2-digit', hour12: true })
            };
            return date.toLocaleDateString('en-IN', options);
        } catch (e) {
            return dateString;
        }
    };

    const address = order.shippingAddress || {};
    const displayFullName = order.fullName || address.fullName || order.customer || 'N/A';
    const displayMobile = order.mobile || address.mobile || 'N/A';
    const displayStreet = order.street || address.street || '';
    const displayLocality = order.locality || address.locality || '';
    const displayCity = order.city || address.city || 'N/A';
    const displayPincode = order.pincode || address.pincode || 'N/A';
    const displayState = order.state || address.state || '';
    const displayLandmark = order.landmark || address.landmark || '';
    const displayAddressType = order.addressType || address.type || 'Home';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full h-full md:w-[90%] md:h-[90%] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 w-full overflow-hidden">
                    <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <button
                            onClick={onClose}
                            className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full text-slate-700 transition-colors shrink-0"
                        >
                            <ArrowLeft size={20} md:size={22} strokeWidth={2} />
                        </button>
                        <div className="min-w-0">
                            <h2 className="text-lg md:text-xl font-black text-slate-900 leading-none truncate overflow-hidden">Order Details</h2>
                            <p className="text-[9px] md:text-xs font-bold text-indigo-600 mt-1 uppercase tracking-widest truncate overflow-hidden">ID: {order.orderId}</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest border shrink-0 ${
                        order.status === 'Delivered' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                        {order.status}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-[#fdfdfd]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Customer & Address */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Customer Info */}
                            <section>
                                <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <User size={14} className="text-indigo-500" /> Customer
                                </h3>
                                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <p className="text-lg font-bold text-slate-900 mb-1">{displayFullName}</p>
                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                            <Phone size={16} className="text-slate-400" />
                                            <span>+91 {displayMobile}</span>
                                        </div>
                                        {order.email && (
                                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="break-all">{order.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Delivery Address */}
                            <section>
                                <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <MapPin size={14} className="text-rose-500" /> Delivery
                                </h3>
                                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Street / Locality</p>
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                                {displayStreet}{displayLocality ? `, ${displayLocality}` : ''}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">City / State</p>
                                                <p className="text-sm font-bold text-slate-800">{displayCity}{displayState ? `, ${displayState}` : ''}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pincode</p>
                                                <p className="text-sm font-bold text-slate-800">{displayPincode}</p>
                                            </div>
                                        </div>
                                        {order.landmark && (
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Landmark</p>
                                                <p className="text-sm font-bold text-slate-600">{displayLandmark}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 pt-2 text-indigo-600">
                                            <Navigation size={14} />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{displayAddressType}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Order Timeline Mini */}
                            <section>
                                <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Clock size={14} className="text-amber-500" /> Info
                                </h3>
                                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placed On</span>
                                        <span className="text-xs font-black text-slate-900">{formatDate(order.date, true)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</span>
                                        <span className="text-xs font-black text-slate-900 uppercase">{order.paymentMethod || order.payment}</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Order Items & Summary */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Items List */}
                            <section>
                                <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-wrap break-words">
                                    <Package size={14} className="text-amber-500" /> Items
                                </h3>
                                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                    {/* Mobile items view */}
                                    <div className="md:hidden divide-y divide-slate-50">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="p-4 flex flex-col gap-3">
                                                <div className="flex gap-3">
                                                    {item.img && (
                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 p-1">
                                                            <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 leading-tight truncate">{item.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">{item.category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop items view */}
                                    <div className="overflow-x-auto hidden md:block">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50/50">
                                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product</th>
                                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Qty</th>
                                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
                                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {order.items?.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-4">
                                                                {item.img && (
                                                                    <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 p-1">
                                                                        <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.category}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-sm font-black text-slate-600">x{item.quantity}</span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-sm font-bold text-slate-600">₹{item.price.toLocaleString('en-IN')}</span>
                                                        </td>
                                                        <td className="py-4 px-6 text-right">
                                                            <span className="text-sm font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Order Totals */}
                                    <div className="bg-slate-50/50 p-6 md:p-8 border-t border-slate-100">
                                        <div className="max-w-xs md:ml-auto space-y-3">
                                            <div className="flex justify-between items-center text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Subtotal</span>
                                                <span className="text-slate-900">₹{order.subtotal?.toLocaleString('en-IN') || (order.grandTotal - order.tax - (order.shipping || 0)).toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Tax</span>
                                                <span className="text-slate-900">₹{order.tax?.toLocaleString('en-IN') || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Shipping</span>
                                                <span className="text-amber-600 italic uppercase">Free</span>
                                            </div>
                                            <div className="h-px bg-slate-200 my-4" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs md:text-base font-black text-slate-900 uppercase tracking-tighter">Total</span>
                                                <span className="text-xl md:text-2xl font-black text-indigo-600 tracking-tighter">₹{(order.grandTotal || order.amount || 0).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Additional Notes or Info if any */}
                            {order.cancelReason && (
                                <section className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                                    <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-2">Cancellation Reason</h4>
                                    <p className="text-sm font-bold text-red-800">{order.cancelReason}</p>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetailModal;

