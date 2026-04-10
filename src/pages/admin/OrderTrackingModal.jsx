import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const OrderTrackingModal = ({ order, onClose }) => {
    useEffect(() => {
        if (order) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [order]);

    if (!order) return null;

    const statusHierarchy = { 'Pending': 0, 'Placed': 1, 'Confirmed': 2, 'Shipped': 3, 'Delivered': 4 };
    const currentStepIndex = statusHierarchy[order.status] ?? 0;
    const isCancelled = order.status === 'Cancelled';

    const baseDate = order.date ? new Date(order.date) : new Date();

    const normalSteps = [
        { status: 'Pending', date: order.date, desc: 'Waiting for confirmation from admin.' },
        { status: 'Placed', desc: currentStepIndex >= 1 ? 'Order placed successfully' : 'Pending' },
        { status: 'Confirmed', desc: currentStepIndex >= 2 ? 'Verified and preparing' : 'Pending' },
        { status: 'Shipped', desc: currentStepIndex >= 3 ? 'On the way' : 'Pending' },
        { status: 'Delivered', desc: currentStepIndex >= 4 ? 'Delivered successfully' : 'Pending' }
    ];

    const cancelledSteps = [
        { status: 'Pending', date: order.date, completed: true, desc: 'Order enquiry' },
        { status: 'Cancelled', completed: true, desc: order.cancelReason || 'Your order has been cancelled' }
    ];

    const timelineToRender = order.timeline && order.timeline.length > 0 ? order.timeline : (isCancelled ? cancelledSteps : normalSteps);

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return '';
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

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}>
            <div
                className="bg-white w-full h-full flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: Simple Back Arrow to mimic single-page dedicated page */}
                <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-700 transition-colors"
                    >
                        <ArrowLeft size={22} strokeWidth={1.8} />
                    </button>
                    <span className="text-sm font-bold text-slate-400">Track Order</span>
                </div>

                {/* Center Timeline Area */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-hide bg-white">
                    <div className="relative space-y-6">
                        {timelineToRender.map((step, idx) => {
                            const isCompleted = isCancelled ? step.completed : (idx <= currentStepIndex);
                            const hasNext = idx < timelineToRender.length - 1;
                            const isNextCompleted = isCancelled ? (timelineToRender[idx + 1]?.completed) : ((idx + 1) <= currentStepIndex);

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
                                            <p className={`text-sm leading-relaxed ${isCompleted ? 'text-slate-600' : 'text-slate-300'}`}>
                                                {step.desc || step.description}
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
            </div>
        </div>
    );
};
export default OrderTrackingModal;

