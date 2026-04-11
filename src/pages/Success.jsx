import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Sparkles, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        clearCart();
    }, []);

    const orderDetails = location.state?.orderDetails || {};

    // Extract address data
    const name = orderDetails.address?.fullName || orderDetails.fullName || 'Meraj Hussain';
    const street = orderDetails.address?.street || orderDetails.street || '12th Main, 4th Cross';
    const locality = orderDetails.address?.locality || orderDetails.locality || 'Indiranagar';
    const city = orderDetails.address?.city || orderDetails.city || 'Bengaluru';
    const state = orderDetails.address?.state || orderDetails.state || 'Uttar Pradesh';
    const pincode = orderDetails.address?.pincode || orderDetails.pincode || '560001';
    const mobile = orderDetails.address?.mobile || orderDetails.mobile || '9876543210';

    // Calculate delivery date (2 days from now)
    const getDeliveryDateStr = () => {
        const orderDateStr = orderDetails.date;
        const baseDate = orderDateStr ? new Date(orderDateStr) : new Date();
        const deliveryDate = new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000);

        const day = deliveryDate.getDate();
        const suffix = (day % 10 === 1 && day !== 11) ? 'st' : (day % 10 === 2 && day !== 12) ? 'nd' : (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

        const weekday = deliveryDate.toLocaleDateString('en-US', { weekday: 'short' });
        const month = deliveryDate.toLocaleDateString('en-US', { month: 'short' });
        const year = deliveryDate.getFullYear().toString().slice(-2);

        return `${weekday}, ${month} ${day}${suffix} '${year}`;
    };

    const deliveryDateStr = getDeliveryDateStr();

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans pb-16 pt-28 flex justify-center w-full">

            {/* Main Content Constraint wrapper (matches desktop Flipkart view) */}
            <div className="w-full max-w-[1000px] flex flex-col gap-4 px-2">

                {/* Card 1: Success Banner (Top Section) */}
                <div className="bg-white px-8 py-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] rounded-sm flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-[24px] font-semibold text-[#212121] mb-4 tracking-tight">
                            Thanks for shopping with us!
                        </h1>
                        <p className="text-[14px] text-[#212121] mb-2 font-medium">Delivery by {deliveryDateStr}</p>
                        <button
                            onClick={() => navigate('/orders')}
                            className="text-blue-600 font-medium text-[14px] hover:underline self-start mt-1"
                        >
                            Track & manage order
                        </button>
                    </div>

                    <div className="relative shrink-0 w-[120px] h-[120px] flex items-center justify-center mr-8">
                        {/* Blue glowing rings */}
                        <div className="absolute inset-2 bg-blue-50 rounded-full scale-[1.25]"></div>
                        <div className="absolute inset-5 bg-blue-100 rounded-full scale-[1.15]"></div>
                        <div className="absolute inset-8 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-sm">
                            <Check size={40} strokeWidth={3} className="text-white ml-1" />
                        </div>
                        {/* Sparkles */}
                        <Sparkles className="absolute top-0 right-4 text-blue-600 animate-pulse" fill="currentColor" size={16} />
                        <Sparkles className="absolute top-6 left-0 text-blue-600 animate-pulse delay-100" fill="currentColor" size={20} />
                        <Sparkles className="absolute bottom-4 left-2 text-blue-600 animate-pulse delay-200" fill="currentColor" size={12} />
                        <Sparkles className="absolute bottom-2 right-6 text-blue-600 animate-pulse delay-300" fill="currentColor" size={18} />
                    </div>
                </div>

                {/* Ordered Items List (Short) */}
                {orderDetails.items && orderDetails.items.length > 0 && (
                    <div className="bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] rounded-sm px-6 py-4 flex flex-col gap-3">
                        <h2 className="text-[14px] font-medium text-[#212121]">
                            {orderDetails.items.length} Item{orderDetails.items.length > 1 ? 's' : ''} in this order
                        </h2>
                        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                            {orderDetails.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-[#f8f9fa] p-2 rounded border border-[#f0f0f0] shrink-0 pr-4 w-[200px]">
                                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 border border-[#e0e0e0] shrink-0">
                                        {item.img || item.image ? (
                                            <img src={item.img || item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <div className="text-slate-400 text-[10px]">No image</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="text-[13px] text-[#212121] font-medium truncate w-full">{item.name}</p>
                                        <p className="text-[12px] text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Card 3: Address / Delivery Details */}
                <div className="bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] rounded-sm pb-2 mt-2">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[#f0f0f0]">
                        <p className="text-[14px] font-medium text-[#212121]">Delivery by {deliveryDateStr}</p>
                    </div>

                    {/* Address Body */}
                    <div className="px-6 py-5 flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-[14px] font-medium text-[#212121]">{name}</h3>

                            <div className="text-[14px] text-[#212121] leading-relaxed max-w-[400px]">
                                <p>{street}</p>
                                <p>{locality}</p>
                                <p>{city}</p>
                                <p>{state} - {pincode}</p>
                            </div>

                            <p className="text-[14px] text-[#212121] mt-2 font-medium text-slate-700">Phone number: {mobile}</p>

                            <button
                                onClick={() => navigate('/orders')}
                                className="text-blue-600 text-[14px] font-medium mt-4 hover:underline self-start cursor-pointer transition-colors"
                            >
                                Change or Add number
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/profile')}
                            className="px-5 py-2 border border-[#e0e0e0] rounded-[2px] bg-white text-blue-600 text-[14px] font-medium hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            Change
                        </button>
                    </div>
                </div>

                {/* Action Buttons Container */}
                <div className="flex items-center justify-between mt-4 mb-32 relative z-[100]">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3.5 bg-white text-[#212121] text-[14px] font-medium rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-slate-50 transition-colors border border-[#d3d3d3] drop-shadow-sm cursor-pointer active:scale-[0.98]"
                    >
                        CONTINUE SHOPPING
                    </button>

                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#212121] text-[14px] font-medium rounded-sm hover:text-blue-600 transition-colors cursor-pointer active:scale-[0.98]"
                    >
                        Send Order Details
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Success;
