import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, MapPin, CreditCard, ChevronRight, ChevronLeft, Plus,
    CheckCircle2, ShoppingBag, Calendar, Clock, FileText,
    ShieldCheck, Smartphone, Landmark, Wallet, Banknote,
    AlertCircle, Info, Sparkles, MousePointer2, Box, MessageCircle, Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { realtimeDb as db } from '../../firebase';
import useScrollLock from '../../hooks/useScrollLock';
import { ref, onValue } from 'firebase/database';

const CheckoutModal = ({ onClose }) => {
    const { cartItems, subtotal, tax, gstPercentage, grandTotal, cartCount, clearCart, shippingFee } = useCart();
    const { placeOrder } = useOrders();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [settings, setSettings] = useState({});
    const [formData, setFormData] = useState({
        fullName: '', mobile: '', email: '',
        pincode: '', locality: '', street: '', city: '', state: 'Uttar Pradesh', landmark: '', alternatePhone: '',
        addressType: 'home',
        paymentMethod: 'cod',
        selectedBank: '',
        selectedWallet: '',
        upiId: '',
        cardDetails: { number: '', name: '', expiry: '', cvv: '' },
        deliveryDate: new Date().toISOString().split('T')[0],
        timeSlot: '9 AM - 12 PM',
        selectedAddressId: 1
    });
    const [pincodeVerified, setPincodeVerified] = useState(null); // null, 'success', 'error'

    const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
    const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleShareSummary = () => {
        const itemsList = cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
        const message = `🛒 *Cart Summary - Unnati Mart*\n\n` +
            `Check out these items I'm about to order!\n\n` +
            `*Items:*\n${itemsList}\n\n` +
            `*Total Amount:* ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
            `Shop now at: ${window.location.origin}`;

        if (navigator.share) {
            navigator.share({
                title: 'My Unnati Mart Cart',
                text: message,
            }).catch(console.error);
        } else {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        }
    };

    useEffect(() => {
        const settingsRef = ref(db, 'settings');
        const unsubscribe = onValue(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSettings(data);

                // Auto-select first available payment method if COD is disabled
                if (data.enableCOD === false) {
                    if (data.enableUPI !== false) setFormData(prev => ({ ...prev, paymentMethod: 'upi' }));
                    else if (data.enableCards !== false) setFormData(prev => ({ ...prev, paymentMethod: 'debit' }));
                    else if (data.enableBank !== false) setFormData(prev => ({ ...prev, paymentMethod: 'bank' }));
                    else if (data.enableWallet !== false) setFormData(prev => ({ ...prev, paymentMethod: 'wallet' }));
                }
            }
        });
        return () => unsubscribe();
    }, []);

    useScrollLock(true);

    const banks = [
        { id: 'sbi', name: 'State Bank of India', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-sbi-3629051-3030232.png' },
        { id: 'hdfc', name: 'HDFC Bank', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/2560px-HDFC_Bank_Logo.svg.png' },
        { id: 'icici', name: 'ICICI Bank', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/1200px-ICICI_Bank_Logo.svg.png' },
        { id: 'axis', name: 'Axis Bank', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Axis_Bank_logo.svg/2560px-Axis_Bank_logo.svg.png' },
        { id: 'kotak', name: 'Kotak Mahindra Bank', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kotak_Mahindra_Bank_logo.svg/2560px-Kotak_Mahindra_Bank_logo.svg.png' },
        { id: 'pnb', name: 'Punjab National Bank', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Punjab_National_Bank_Logo.svg/2560px-Punjab_National_Bank_Logo.svg.png' },
        { id: 'bob', name: 'Bank of Baroda', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bank_of_Baroda_Logo.svg/2560px-Bank_of_Baroda_Logo.svg.png' },
        { id: 'idbi', name: 'IDBI Bank', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/IDBI_Bank_Logo.svg/2560px-IDBI_Bank_Logo.svg.png' },
        { id: 'indusind', name: 'IndusInd Bank', icon: 'https://logo.clearbit.com/indusind.com' },
        { id: 'canara', name: 'Canara Bank', icon: 'https://logo.clearbit.com/canarabank.com' },
        { id: 'union', name: 'Union Bank of India', icon: 'https://logo.clearbit.com/unionbankofindia.co.in' },
        { id: 'federal', name: 'Federal Bank', icon: 'https://logo.clearbit.com/federalbank.co.in' },
        { id: 'yes', name: 'YES Bank', icon: 'https://logo.clearbit.com/yesbank.in' },
        { id: 'central', name: 'Central Bank of India', icon: 'https://logo.clearbit.com/centralbankofindia.co.in' },
        { id: 'indian', name: 'Indian Bank', icon: 'https://logo.clearbit.com/indianbank.in' },
        { id: 'boi', name: 'Bank of India', icon: 'https://logo.clearbit.com/bankofindia.co.in' },
    ];

    const wallets = [
        { id: 'paytm', name: 'Paytm', icon: 'https://logos-world.net/wp-content/uploads/2020/11/Paytm-Logo.png' },
        { id: 'phonepe', name: 'PhonePe', icon: 'https://logos-world.net/wp-content/uploads/2020/11/PhonePe-Logo.png' },
        { id: 'amazon', name: 'Amazon Pay', icon: 'https://logos-world.net/wp-content/uploads/2021/04/Amazon-Pay-Logo.png' },
        { id: 'mobikwik', name: 'MobiKwik', icon: 'https://logo.clearbit.com/mobikwik.com' },
        { id: 'freecharge', name: 'Freecharge', icon: 'https://logo.clearbit.com/freecharge.in' },
        { id: 'airtel', name: 'Airtel Money', icon: 'https://logo.clearbit.com/airtel.in' },
    ];

    const savedAddresses = [];

    const [isAddingNew, setIsAddingNew] = useState(savedAddresses.length === 0);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('card.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                cardDetails: { ...prev.cardDetails, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (error) setError(null);
        if (name === 'pincode') setPincodeVerified(null);
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.fullName.trim()) {
                setError("Personal details are mandatory to fill.");
                setTimeout(() => {
                    document.getElementById('fullNameInput')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.getElementById('fullNameInput')?.focus();
                }, 100);
                return;
            }
            if (!formData.mobile || !formData.mobile.trim()) {
                setError("Personal details are mandatory to fill.");
                setTimeout(() => {
                    document.getElementById('mobileInput')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.getElementById('mobileInput')?.focus();
                }, 100);
                return;
            }
            if (formData.mobile.trim().length !== 10) {
                setError("Please enter a valid 10-digit mobile number.");
                setTimeout(() => {
                    document.getElementById('mobileInput')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.getElementById('mobileInput')?.focus();
                }, 100);
                return;
            }
        }
        if (step === 2) {
            if (!formData.pincode || !formData.pincode.trim()) {
                setError("Pincode is mandatory.");
                return;
            }
            if (!formData.locality || !formData.locality.trim()) {
                setError("Locality is mandatory to fill.");
                return;
            }
            if (!formData.street || !formData.street.trim()) {
                setError("Address (Area and Street) is mandatory to fill.");
                return;
            }
            if (!formData.city || !formData.city.trim()) {
                setError("City / Town is mandatory to fill.");
                return;
            }
            const serviceablePincodes = settings.serviceablePincodes;
            if (serviceablePincodes && serviceablePincodes.trim() !== '') {
                const allowedPincodes = serviceablePincodes.split(',').map(p => p.trim());
                if (!allowedPincodes.includes(formData.pincode.trim())) {
                    setError("Sorry, we don’t deliver to this pincode yet.");
                    return;
                }
            }
        }
        setError(null);
        setStep(step + 1);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const itemsToPass = [...cartItems];
            const orderData = {
                items: itemsToPass,
                subtotal,
                tax,
                grandTotal,
                ...formData,
                status: 'Pending'
            };
            const newOrder = await placeOrder(orderData);

            if (formData.paymentMethod === 'whatsapp') {
                const message = `*New Order via WhatsApp payment*
--------------------------------
*Customer Details:*
Name: ${formData.fullName}
Mobile: ${formData.mobile}

*Order ID:* ${newOrder?.id || 'N/A'}

*Order Items:*
${itemsToPass.map(item => `- ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}

*Price Details:*
Subtotal: ₹${subtotal.toLocaleString('en-IN')}
Delivery: ${shippingFee > 0 ? `₹${shippingFee.toLocaleString('en-IN')}` : 'FREE'}
Tax: ₹${tax.toLocaleString('en-IN')}
*Total Payable: ₹${grandTotal.toLocaleString('en-IN')}*

Please send the QR code for payment.`;

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/919569603163?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            }

            setOrderPlaced(true);
            setIsProcessing(false);

            onClose();
            navigate('/success', { state: { items: itemsToPass, orderDetails: newOrder || orderData } });
        } catch (err) {
            console.error("Order completion error:", err);
            setError("Something went wrong while placing your order. Please try again.");
            setIsProcessing(false);
        }
    };

    const steps = [
        { id: 1, label: 'Personal Details', desc: 'Name & contact info', icon: <User size={16} /> },
        { id: 2, label: 'Delivery Address', desc: 'Where to deliver', icon: <MapPin size={16} /> },
        { id: 3, label: 'Payment', desc: 'Test different methods', icon: <CreditCard size={16} /> },
    ];

    const paymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', dot: true, isDisabled: settings.enableCOD === false },
        { id: 'whatsapp', label: 'WhatsApp via Payment', icon: <MessageCircle size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        { id: 'upi', label: 'UPI / QR Code', icon: <Smartphone size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isDisabled: settings.enableUPI === false },
        { id: 'debit', label: 'Debit Card', icon: <CreditCard size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isDisabled: settings.enableCards === false },
        { id: 'credit', label: 'Credit Card', icon: <CreditCard size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isDisabled: settings.enableCards === false },
        { id: 'bank', label: 'Net Banking', icon: <Landmark size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isDisabled: settings.enableBank === false },
        { id: 'wallet', label: 'Digital Wallet', icon: <Wallet size={20} />, activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', isDisabled: settings.enableWallet === false },
    ];

    const getPaymentDetails = () => {
        const method = paymentMethods.find(m => m.id === formData.paymentMethod);
        switch (formData.paymentMethod) {
            case 'cod': return `Pay ₹${grandTotal.toLocaleString('en-IN')} in cash when the product arrives.`;
            case 'whatsapp': return `You will be redirected to WhatsApp to complete payment of ₹${grandTotal.toLocaleString('en-IN')}.`;
            case 'upi': return formData.upiId ? `Paying via ${formData.upiId}` : "Enter your UPI ID to proceed.";
            case 'debit':
            case 'credit': return formData.cardDetails.number ? `Card ending in ${formData.cardDetails.number.slice(-4)}` : "Enter your card details safely.";
            case 'bank': return formData.selectedBank ? `Paying via ${banks.find(b => b.id === formData.selectedBank)?.name}` : "Select your bank to continue.";
            case 'wallet': return formData.selectedWallet ? `Paying via ${wallets.find(w => w.id === formData.selectedWallet)?.name}` : "Select your favorite wallet.";
            default: return "";
        }
    };

    if (orderPlaced) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[3.5rem] p-12 text-center max-w-md w-full shadow-2xl border border-white/50"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-24 h-24 mx-auto mb-8 bg-amber-100 rounded-[2rem] flex items-center justify-center"
                    >
                        <CheckCircle2 size={48} className="text-amber-600" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3 italic">
                        Waiting for Confirmation!
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8">
                        Waiting for confirmation of your order from admin. We'll notify you once it's placed.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/orders');
                            }}
                            className="w-full py-4 bg-[#111827] text-white rounded-2xl text-[14px] font-bold uppercase tracking-wider shadow-xl shadow-slate-200 hover:bg-amber-600 transition-all"
                        >
                            Track Order
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl text-[14px] font-bold uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-[1240px] max-h-[92vh] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] flex flex-col border border-white/50"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-100 relative">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center">
                            <ShoppingBag size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-[24px] sm:text-[32px] font-bold text-[#3a3f30] tracking-tight leading-none mb-1">Complete Your Order</h2>
                            <p className="text-[12px] font-medium text-slate-400 capitalize">Complete Cart Checkout</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row bg-[#fdfdfd]">

                    {/* Left Sidebar - Step Indicators & Mini Summary */}
                    <div className="w-full lg:w-[360px] bg-[#fdfbf7] p-8 border-r border-[#f1efe1] shrink-0">

                        {/* Order Summary Sidebar Block */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xl sm:text-[24px] font-bold text-[#3a3f30] flex items-center gap-3">
                                    <Box size={20} className="text-[#a4a87a]" /> Summary
                                </h4>
                                <button 
                                    onClick={handleShareSummary}
                                    className="p-2 bg-white rounded-xl border border-amber-100 text-amber-600 hover:bg-amber-50 transition-all shadow-sm"
                                    title="Share Cart Summary"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 border border-[#f1efe1] shadow-sm">
                                <h5 className="text-[11px] font-bold text-slate-900 mb-6 uppercase tracking-widest">Cart Items ({cartCount})</h5>
                                <div className="space-y-6 max-h-[280px] overflow-y-auto mb-8 pr-2">
                                    {cartItems.map((item) => (
                                        <div key={`${item.category}-${item.id}`} className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-1">
                                                <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#3a3f30] leading-tight mb-1">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3.5 pt-6 border-t border-amber-100/50">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Delivery</span>
                                        <span className={shippingFee > 0 ? "text-slate-900" : "text-amber-600 font-black uppercase tracking-widest text-[10px]"}>
                                            {shippingFee > 0 ? `₹${shippingFee.toLocaleString('en-IN')}` : 'FREE'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Tax ({gstPercentage}%)</span>
                                        <span className="text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between pt-4 mt-2 border-t border-amber-100/50">
                                        <span className="text-base font-serif text-slate-900">Total Amount</span>
                                        <span className="text-xl font-bold font-serif text-amber-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mini Progress Steps */}
                        <div className="space-y-4">
                            <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${error && (!formData.fullName?.trim() || !formData.mobile?.trim() || formData.mobile?.trim().length !== 10) && step === 1 ? 'border-red-200 bg-red-50' : 'border-[#f1efe1] bg-white/60'}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${error && (!formData.fullName?.trim() || !formData.mobile?.trim() || formData.mobile?.trim().length !== 10) && step === 1 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {error && (!formData.fullName?.trim() || !formData.mobile?.trim() || formData.mobile?.trim().length !== 10) && step === 1 ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div className="leading-tight flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#3a3f30]">Personal Details</p>
                                    <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                        {formData.fullName || "Name & contact info"}
                                    </p>
                                </div>
                            </div>

                            <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${step >= 2 ? 'border-[#f1efe1] bg-white/60 shadow-sm' : 'opacity-50 border-dashed border-slate-200 bg-slate-50/50'}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${step >= 2 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-300'}`}>
                                    <MapPin size={20} />
                                </div>
                                <div className="leading-tight flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#3a3f30]">Delivery Address</p>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                        {formData.state ? `${formData.city || 'City'}${formData.city ? ',' : ''} ${formData.state}` : "Address details"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Form Steps */}
                    <div className="flex-1 p-8 lg:p-12 relative">

                        {/* No Delivery State */}
                        {step === 'no_delivery' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl py-20 text-center">
                                <div className="text-center py-10 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-50">
                                    <h2 className="text-2xl font-semibold text-red-500">
                                        Delivery Not Available ❌
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        Sorry, we don’t deliver to this pincode yet.
                                    </p>

                                    <div className="max-w-xs mx-auto space-y-4">
                                        <input
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                                            placeholder="Enter another pincode"
                                            className="mt-4 border px-4 py-2 rounded-lg w-full text-center"
                                        />

                                        <button 
                                            onClick={() => {
                                                if (settings.serviceablePincodes) {
                                                    const allowedPincodes = settings.serviceablePincodes.split(',').map(p => p.trim());
                                                    if (allowedPincodes.includes(formData.pincode.trim())) {
                                                        setStep(2); // Go back to address step
                                                        setError(null);
                                                    }
                                                }
                                            }}
                                            className="mt-3 bg-green-600 text-white px-5 py-2 rounded-lg w-full font-bold"
                                        >
                                            Check Availability
                                        </button>
                                        
                                        <button 
                                            onClick={() => setStep(2)}
                                            className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors block mx-auto"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl pb-16">
                                <div className="mb-10">
                                    <h3 className="text-[24px] sm:text-[32px] font-bold text-[#3a3f30] tracking-tight mb-2 leading-none">Personal Information.</h3>
                                    <p className="text-[12px] text-[#878787] uppercase font-bold tracking-widest">Provide your reachability details</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                        <input
                                            name="fullName" value={formData.fullName} onChange={handleChange}
                                            placeholder="Enter your full name" id="fullNameInput"
                                            className={`w-full px-6 py-4 bg-white border rounded-3xl text-[16px] font-bold focus:outline-none transition-all shadow-sm ${error && !formData.fullName?.trim() ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/5' : 'border-slate-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[16px] font-black text-slate-300 tracking-tighter">+91</span>
                                            <input
                                                name="mobile" value={formData.mobile} onChange={handleChange}
                                                placeholder="10-digit mobile number" id="mobileInput"
                                                className={`w-full pl-16 pr-6 py-4 bg-white border rounded-3xl text-[16px] font-bold focus:outline-none transition-all shadow-sm ${error && (!formData.mobile?.trim() || formData.mobile?.trim().length !== 10) ? 'border-red-400' : 'border-slate-100'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            name="email" value={formData.email} onChange={handleChange}
                                            placeholder="email@example.com"
                                            className="w-full px-6 py-4 bg-white border border-slate-100 rounded-3xl text-[16px] font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Delivery Address (Flipkart Style) */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl w-full pb-16">
                                <div className="mb-8">
                                    <h3 className="text-[24px] sm:text-[32px] font-bold text-[#3a3f30] tracking-tight mb-2 leading-none">Delivery Address</h3>
                                    <p className="text-[12px] text-[#878787] uppercase font-bold tracking-widest">Select where you want your fresh produce delivered</p>
                                </div>

                                {/* Saved Addresses List */}
                                <div className="space-y-4 mb-8">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setFormData(prev => ({ ...prev, selectedAddressId: addr.id, ...addr }))}
                                            className={`relative p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${formData.selectedAddressId === addr.id
                                                ? 'border-[#2874f0] bg-blue-50/30'
                                                : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${formData.selectedAddressId === addr.id ? 'border-[#2874f0]' : 'border-slate-300'}`}>
                                                    {formData.selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-[#2874f0] rounded-full" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                        <span className="text-sm font-black text-slate-900">{addr.name}</span>
                                                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-500">{addr.type}</span>
                                                        <span className="text-sm font-bold text-slate-900">{addr.mobile}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed font-medium break-words">
                                                        {addr.street}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-black text-slate-900">{addr.pincode}</span>
                                                    </p>
                                                    {formData.selectedAddressId === addr.id && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="mt-5 px-10 py-3 bg-amber-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormData(prev => ({ ...prev, selectedAddressId: addr.id, ...addr }));
                                                                setStep(3);
                                                            }}
                                                        >
                                                            Deliver Here
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Address Toggle */}
                                {!isAddingNew ? (
                                    <button
                                        onClick={() => setIsAddingNew(true)}
                                        className="w-full p-5 rounded-[2rem] border-2 border-dashed border-slate-200 text-amber-600 text-sm font-black uppercase tracking-widest hover:bg-amber-50 hover:border-amber-200 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Plus size={18} /> Add a new address
                                    </button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        className="p-8 bg-blue-50/20 rounded-[2.5rem] border border-blue-100/50"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-[14px] font-black text-amber-600 uppercase tracking-wider font-sans">Add New Address</h4>
                                            <button onClick={() => setIsAddingNew(false)} className="text-[#878787] hover:text-slate-900 transition-colors">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">Full Name</label>
                                                <input
                                                    name="fullName" value={formData.fullName} onChange={handleChange}
                                                    placeholder="Receiver's name"
                                                    className="w-full px-4 py-3.5 bg-white border border-[#e0e0e0] rounded-lg text-[16px] font-medium text-[#212121] font-sans placeholder:text-[#878787] placeholder:font-medium focus:outline-none focus:border-[#2874f0] transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">10-Digit Mobile Number</label>
                                                <input
                                                    name="mobile" value={formData.mobile} onChange={handleChange}
                                                    placeholder="9999999999"
                                                    readOnly={true}
                                                    className="w-full px-4 py-3.5 bg-slate-50 border border-[#e0e0e0] rounded-lg text-[16px] font-medium text-[#212121] font-sans placeholder:text-[#878787] cursor-not-allowed opacity-70 focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">Pincode *</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        name="pincode" value={formData.pincode} onChange={handleChange}
                                                        placeholder="6-digit pincode"
                                                        className={`w-full px-4 py-3.5 bg-white border rounded-lg text-[16px] font-medium text-[#212121] font-sans placeholder:text-[#878787] focus:outline-none transition-colors ${error && !formData.pincode?.trim() ? 'border-red-400' : 'border-[#e0e0e0] focus:border-[#2874f0]'}`}
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            if (!formData.pincode || formData.pincode.trim().length !== 6) {
                                                                setError("Please enter a valid 6-digit pincode.");
                                                                setPincodeVerified('error');
                                                                return;
                                                            }
                                                            const serviceablePincodes = settings.serviceablePincodes;
                                                            if (!serviceablePincodes || serviceablePincodes.trim() === '') {
                                                                setPincodeVerified('success');
                                                                setError(null);
                                                                return;
                                                            }
                                                            const allowedPincodes = serviceablePincodes.split(',').map(p => p.trim());
                                                            if (allowedPincodes.includes(formData.pincode.trim())) {
                                                                setPincodeVerified('success');
                                                                setError(null);
                                                            } else {
                                                                setError("Sorry, we don’t deliver to this pincode yet.");
                                                                setPincodeVerified('error');
                                                            }
                                                        }}
                                                        className={`px-4 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${pincodeVerified === 'success' ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                                    >
                                                        {pincodeVerified === 'success' ? 'Verified ✓' : 'Verify'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">Locality *</label>
                                                <input
                                                    name="locality" value={formData.locality} onChange={handleChange}
                                                    placeholder="Locality / Area"
                                                    className={`w-full px-4 py-3.5 bg-white border rounded-lg text-[16px] font-medium text-[#212121] font-sans placeholder:text-[#878787] placeholder:font-medium focus:outline-none transition-colors ${error && !formData.locality?.trim() ? 'border-red-400' : 'border-[#e0e0e0] focus:border-[#2874f0]'}`}
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">Address (Area and Street) *</label>
                                                <textarea
                                                    name="street" value={formData.street} onChange={handleChange}
                                                    placeholder="Flat / House No / Street Name"
                                                    rows={3}
                                                    className={`w-full px-4 py-3.5 bg-white border rounded-lg text-[16px] font-medium text-[#212121] font-sans placeholder:text-[#878787] placeholder:font-medium focus:outline-none transition-colors resize-none ${error && !formData.street?.trim() ? 'border-red-400' : 'border-[#e0e0e0] focus:border-[#2874f0]'}`}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">City / Town *</label>
                                                <input
                                                    name="city" value={formData.city} onChange={handleChange}
                                                    placeholder="City"
                                                    className={`w-full px-4 py-3.5 bg-white border rounded-lg text-[16px] font-medium text-[#212121] font-sans placeholder:text-[#878787] placeholder:font-medium focus:outline-none transition-colors ${error && !formData.city?.trim() ? 'border-red-400' : 'border-[#e0e0e0] focus:border-[#2874f0]'}`}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans">State</label>
                                                <div className="relative">
                                                    <select
                                                        name="state" value={formData.state} onChange={handleChange}
                                                        className={`w-full px-4 py-3.5 bg-white border-2 ${formData.state === 'Uttar Pradesh' ? 'border-amber-500' : 'border-[#e0e0e0]'} rounded-lg text-[16px] font-bold focus:outline-none focus:border-[#2874f0] transition-colors appearance-none cursor-pointer font-sans text-[#212121] active:scale-[0.99]`}
                                                    >
                                                        <option value="" disabled>Select State</option>
                                                        <option value="Uttar Pradesh" className="font-bold text-amber-600 italic">Uttar Pradesh (Default)</option>
                                                        {[
                                                            "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
                                                            "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
                                                            "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
                                                            "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", 
                                                            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", 
                                                            "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "West Bengal"
                                                        ].sort().map(state => (
                                                            <option key={state} value={state}>{state}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight size={14} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-4 pt-4">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider ml-1">Address Type</label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <input
                                                            type="radio" name="addressType" value="home"
                                                            checked={formData.addressType === 'home'}
                                                            onChange={handleChange}
                                                            className="w-5 h-5 accent-amber-600"
                                                        />
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Home</span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <input
                                                            type="radio" name="addressType" value="work"
                                                            checked={formData.addressType === 'work'}
                                                            onChange={handleChange}
                                                            className="w-5 h-5 accent-amber-600"
                                                        />
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Work</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Timeslot Selection */}
                                            <div className="md:col-span-2 space-y-2 pt-4">
                                                <label className="text-[13px] font-bold text-[#878787] uppercase tracking-wider block ml-1 font-sans flex items-center gap-2">
                                                    <Clock size={14} /> Preferred Delivery Timeslot
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {(settings.timeSlots || "6 AM - 9 AM, 4 PM - 7 PM").split(',').map(slot => (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot.trim() }))}
                                                            className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${formData.timeSlot === slot.trim() 
                                                                ? 'border-amber-500 bg-amber-50 text-amber-700' 
                                                                : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                                                        >
                                                            {slot.trim()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 pt-6 grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => {
                                                        if (!formData.pincode || !formData.pincode.trim() ||
                                                            !formData.locality || !formData.locality.trim() ||
                                                            !formData.street || !formData.street.trim() ||
                                                            !formData.city || !formData.city.trim()) {
                                                            setError("All address fields marked with * are mandatory.");
                                                            return;
                                                        }
                                                        const serviceablePincodes = settings.serviceablePincodes || "272175, 272001, 272002";
                                                        const allowedPincodes = serviceablePincodes.split(',').map(p => p.trim());
                                                        if (!allowedPincodes.includes(formData.pincode.trim())) {
                                                            setError("Sorry, we don’t deliver to this pincode yet.");
                                                            return;
                                                        }
                                                        setIsAddingNew(false);
                                                        setStep(3);
                                                    }}
                                                    className="w-full py-4 bg-amber-600 text-white text-[13px] sm:text-[16px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all flex items-center justify-center text-center"
                                                >
                                                    Save & Deliver
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingNew(false)}
                                                    className="w-full py-4 text-slate-400 text-[13px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center text-center"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Payment Step (Redesigned to match Grid layout) */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-[24px] sm:text-[32px] font-bold text-slate-900 flex items-center gap-3">
                                            <CreditCard size={28} className="text-amber-600" /> Payment Method
                                        </h4>
                                        <div className="hidden sm:flex px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest border border-amber-100">
                                            <div className="relative w-4 h-4">
                                                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                                                <div className="absolute inset-x-1.5 inset-y-1.5 bg-red-500 rounded-full" />
                                            </div>
                                            Click to Test
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">Select your preferred payment gateway</p>
                                </div>

                                {/* 6 Grid Payment Methods - Horizontal Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            disabled={method.isDisabled}
                                            onClick={() => !method.isDisabled && setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                                            className={`relative flex items-center gap-4 p-4 rounded-[1.8rem] border-2 transition-all group ${method.isDisabled
                                                    ? 'opacity-60 cursor-not-allowed border-slate-100 bg-slate-50'
                                                    : formData.paymentMethod === method.id
                                                        ? `${method.activeBorder} ${method.activeBg} shadow-sm z-10`
                                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${method.isDisabled
                                                    ? 'bg-slate-100 text-slate-300'
                                                    : formData.paymentMethod === method.id
                                                        ? `${method.iconBg} ${method.iconColor}`
                                                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                                                }`}>
                                                {method.icon}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className={`text-[12px] font-bold ${method.isDisabled
                                                        ? 'text-slate-400'
                                                        : formData.paymentMethod === method.id
                                                            ? 'text-slate-900'
                                                            : 'text-slate-600'
                                                    }`}>
                                                    {method.label}
                                                </p>
                                            </div>

                                            {formData.paymentMethod === method.id && !method.isDisabled && (
                                                <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                </div>
                                            )}

                                            {method.isDisabled && (
                                                <div className="absolute right-2 top-2">
                                                    <span className="text-[8px] font-black uppercase tracking-wider text-white bg-rose-500 px-2 py-0.5 rounded-full shadow-sm">Temporarily Unavailable</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Method Detail Box */}
                                <motion.div
                                    key={formData.paymentMethod}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 bg-[#f8f9f4] rounded-[3rem] border border-dashed border-[#dce0bc] mb-10"
                                >
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                                            {paymentMethods.find(m => m.id === formData.paymentMethod)?.icon}
                                        </div>
                                        <div className="leading-tight">
                                            <h5 className="text-sm font-bold text-[#3a3f30] mb-1">
                                                {paymentMethods.find(m => m.id === formData.paymentMethod)?.label} Details
                                            </h5>
                                            <p className="text-xs text-slate-500 font-medium">{getPaymentDetails()}</p>
                                        </div>
                                    </div>

                                    {/* Sub-options UI */}
                                    <div className="pt-2">
                                        {/* Bank Selection Dropdown */}
                                        {formData.paymentMethod === 'bank' && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                                                    className="w-full flex items-center justify-between p-4 bg-white border border-white rounded-[1.8rem] shadow-sm hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {formData.selectedBank ? (
                                                            <>
                                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-50 p-1">
                                                                    <img src={banks.find(b => b.id === formData.selectedBank)?.icon} alt="" className="w-full h-full object-contain" />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-800">{banks.find(b => b.id === formData.selectedBank)?.name}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                                    <Landmark size={20} />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-400">Select Your Bank</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <ChevronRight className={`text-slate-400 transition-transform ${isBankDropdownOpen ? 'rotate-90' : ''}`} size={18} />
                                                </button>

                                                {isBankDropdownOpen && (
                                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 z-20 max-h-[350px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                            {banks.map(bank => (
                                                                <button
                                                                    key={bank.id}
                                                                    onClick={() => { setFormData(prev => ({ ...prev, selectedBank: bank.id })); setIsBankDropdownOpen(false); }}
                                                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${formData.selectedBank === bank.id ? 'border-amber-500 bg-amber-50/50 text-amber-700' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                                                >
                                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-2 mb-1.5 flex items-center justify-center border border-slate-100/80 shadow-sm">
                                                                        <img src={bank.icon} alt={bank.name} className="w-full h-full object-contain" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black leading-tight tracking-tight uppercase">{bank.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Wallet Selection Dropdown */}
                                        {formData.paymentMethod === 'wallet' && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                                                    className="w-full flex items-center justify-between p-4 bg-white border border-white rounded-[1.8rem] shadow-sm hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {formData.selectedWallet ? (
                                                            <>
                                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-50 p-1">
                                                                    <img src={wallets.find(w => w.id === formData.selectedWallet)?.icon} alt="" className="w-full h-full object-contain" />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-800">{wallets.find(w => w.id === formData.selectedWallet)?.name}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                                    <Wallet size={20} />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-400">Select Digital Wallet</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <ChevronRight className={`text-slate-400 transition-transform ${isWalletDropdownOpen ? 'rotate-90' : ''}`} size={18} />
                                                </button>

                                                {isWalletDropdownOpen && (
                                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 z-20 animate-in fade-in slide-in-from-top-2">
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                            {wallets.map(wallet => (
                                                                <button
                                                                    key={wallet.id}
                                                                    onClick={() => { setFormData(prev => ({ ...prev, selectedWallet: wallet.id })); setIsWalletDropdownOpen(false); }}
                                                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${formData.selectedWallet === wallet.id ? 'border-amber-500 bg-amber-50/50 text-amber-700' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                                                >
                                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-2 mb-1.5 flex items-center justify-center border border-slate-100/80 shadow-sm">
                                                                        <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black leading-tight tracking-tight uppercase">{wallet.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* UPI Input */}
                                        {formData.paymentMethod === 'upi' && (
                                            <div className="relative">
                                                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input
                                                    name="upiId" value={formData.upiId} onChange={handleChange}
                                                    placeholder="Enter your UPI ID (e.g., user@okhdfcbank)"
                                                    className="w-full pl-14 pr-6 py-4 bg-white border border-white rounded-[1.8rem] text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                                />
                                            </div>
                                        )}

                                        {/* Card Details */}
                                        {(formData.paymentMethod === 'debit' || formData.paymentMethod === 'credit') && (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                    <input
                                                        name="card.number" value={formData.cardDetails.number} onChange={handleChange}
                                                        placeholder="Card Number"
                                                        maxLength={16}
                                                        className="w-full pl-14 pr-6 py-4 bg-white border border-white rounded-[1.8rem] text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm tracking-[0.2em]"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative">
                                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                        <input
                                                            name="card.expiry" value={formData.cardDetails.expiry} onChange={handleChange}
                                                            placeholder="MM/YY"
                                                            maxLength={5}
                                                            className="w-full pl-14 pr-6 py-4 bg-white border border-white rounded-[1.8rem] text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                        <input
                                                            name="card.cvv" value={formData.cardDetails.cvv} onChange={handleChange}
                                                            placeholder="CVV"
                                                            maxLength={3}
                                                            className="w-full pl-14 pr-6 py-4 bg-white border border-white rounded-[1.8rem] text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Secure Badge */}
                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h6 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none mb-1">Secure Test Environment</h6>
                                        <p className="text-[10px] text-slate-500 font-medium">Demo payments only. No real money is charged.</p>
                                    </div>
                                </div>

                                {/* Final Order Summary Table */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                                    <h4 className="text-sm text-slate-600 font-medium mb-6">Final Order Summary</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                            <span>Items Total</span>
                                            <span className="text-[#3a3f30]">₹{subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                            <span>Tax ({gstPercentage}%)</span>
                                            <span className="text-[#3a3f30]">₹{tax.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="h-px bg-slate-100 my-4"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-serif text-[#3a3f30]">Total Payable</span>
                                            <span className="text-2xl font-bold font-serif text-[#313628]">₹{grandTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="p-4 sm:p-8 pb-6 sm:pb-10 flex items-center justify-between border-t border-slate-50 bg-white">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (step === 1) {
                                    onClose();
                                } else {
                                    setStep(step - 1);
                                }
                            }}
                            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 bg-slate-50 text-slate-900 rounded-xl sm:rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            <ChevronLeft size={14} /> Back
                        </button>
                        <button
                            onClick={onClose}
                            className="hidden sm:block px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    {step < 3 ? (
                        <button
                            onClick={handleNextStep}
                            className="px-5 py-2.5 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all sm:hidden flex items-center gap-1 shadow-sm"
                        >
                            Continue <ChevronRight size={12} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="px-5 py-2.5 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all sm:hidden flex items-center gap-1 shadow-sm"
                        >
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    )}

                    <div className="hidden sm:flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end leading-none">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1 flex items-center gap-2">
                                <ShieldCheck size={10} /> Secure encrypted payment. We don't share your details.
                            </p>
                        </div>

                        {step < 3 ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNextStep}
                                className="flex items-center gap-2 px-5 sm:px-12 py-2.5 sm:py-4 bg-[#111827] text-white rounded-full text-xs sm:text-[16px] font-bold uppercase tracking-wider shadow-xl shadow-slate-200 hover:bg-amber-600 transition-all"
                            >
                                CONTINUE <ChevronRight size={18} />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
                                whileTap={!isProcessing ? { scale: 0.98 } : {}}
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className={`flex items-center gap-2 px-5 sm:px-16 py-2.5 sm:py-4 rounded-full text-xs sm:text-[16px] font-bold uppercase tracking-wider transition-all shadow-sm ${isProcessing
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#00e676] text-[#111827] shadow-amber-200/50 hover:bg-white active:scale-95'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin transition-all" />
                                        PROCESSING...
                                    </>
                                ) : (
                                    <>PLACE ORDER (₹{grandTotal.toLocaleString('en-IN')})</>
                                )}
                            </motion.button>
                        )}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-24 right-8 text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutModal;

