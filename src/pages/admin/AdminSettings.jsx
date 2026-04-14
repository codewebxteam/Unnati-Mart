import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Store, MapPin, CreditCard, Bell,
    Mail, Smartphone, ShieldCheck, Clock, CheckCircle2,
    Landmark, Wallet, AlertTriangle
} from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, set } from 'firebase/database';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [syncError, setSyncError] = useState(null);

    // Form states for the settings
    const [formData, setFormData] = useState({
        // General Settings
        storeName: 'Unnati Mart',
        supportEmail: 'care@unnatimart.com',
        supportPhone: '+91 9336020104',
        gstPercentage: '0',
        maintenanceMode: false,

        // Shipping Settings (Delivery is now permanently FREE)
        freeDeliveryThreshold: '0',
        flatDeliveryFee: '0',
        timeSlots: '6 AM - 9 AM, 4 PM - 7 PM',
        serviceablePincodes: '272175, 272001',

        // Payment Settings
        enableCOD: true,
        enableUPI: true,
        enableCards: true,
        enableBank: true,
        enableWallet: true,

        // Notification Settings
        orderEmails: true,
        promotionalEmails: false,
        adminAlertsEmail: 'admin@unnatimart.com'
    });

    useEffect(() => {
        const settingsRef = ref(db, 'settings');

        // Safety Timeout
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 8000);

        const unsubscribe = onValue(settingsRef, (snapshot) => {
            clearTimeout(safetyTimeout);
            if (snapshot.exists()) {
                setFormData(prev => ({ ...prev, ...snapshot.val() }));
            }
            setIsLoading(false);
        }, (error) => {
            clearTimeout(safetyTimeout);
            console.error("Error fetching settings:", error);
            setSyncError(error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle toggle and auto-save (specifically for Switches/Toggles)
    const handleToggle = async (e) => {
        const { name, checked } = e.target;
        const updatedData = { ...formData, [name]: checked };
        setFormData(updatedData);

        try {
            await set(ref(db, 'settings'), updatedData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error auto-saving setting:", error);
            // Revert state if save fails (optional, but good practice)
            setFormData(formData);
        }
    };

    // Save settings to Firebase
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await set(ref(db, 'settings'), formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Define the tabs available
    const tabs = [
        { id: 'general', label: 'General', icon: <Store size={18} /> },
        { id: 'shipping', label: 'Shipping', icon: <MapPin size={18} /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Store Settings</h1>
                    <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Configure your farm store settings</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors flex items-center gap-2 shadow-lg shadow-amber-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl flex items-center gap-3 shadow-sm"
                    >
                        <CheckCircle2 size={20} className="text-amber-500" />
                        <span className="font-semibold text-sm">Settings saved successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Tabs Sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-amber-50 text-amber-700 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <span className={activeTab === tab.id ? 'text-amber-600' : 'text-slate-400'}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing with Cloud...</p>
                            </div>
                        ) : (
                            <>
                                {/* 1. General Settings Tab */}
                                {activeTab === 'general' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                <Store className="text-amber-500" size={24} /> General Information
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                                                    <input
                                                        type="text" name="storeName" value={formData.storeName} onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                                                    <input
                                                        type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Support Phone</label>
                                                    <input
                                                        type="text" name="supportPhone" value={formData.supportPhone} onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Default GST (%)</label>
                                                    <input
                                                        type="number" name="gstPercentage" value={formData.gstPercentage} onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100">
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                <ShieldCheck className="text-rose-500" size={24} /> Danger Zone
                                            </h3>

                                            <div className="p-6 border border-rose-100 bg-rose-50/50 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800">Maintenance Mode</h4>
                                                    <p className="text-xs text-slate-500 mt-1">Prevent customers from placing new orders while you update the farm store.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleToggle} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500 shadow-inner"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 2. Shipping Settings Tab */}
                                {activeTab === 'shipping' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                <MapPin className="text-amber-500" size={24} /> Delivery Rules
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Free Delivery Threshold (₹)</label>
                                                    <input
                                                        type="number" name="freeDeliveryThreshold" value={formData.freeDeliveryThreshold} onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    />
                                                    <p className="text-[10px] text-slate-400 font-semibold px-2">Set to 0 for global free shipping.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Flat Delivery Fee (₹)</label>
                                                    <input
                                                        type="number" name="flatDeliveryFee" value={formData.flatDeliveryFee} onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    />
                                                </div>

                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <Clock size={14} /> Available Time Slots
                                                </label>
                                                <input
                                                    type="text" name="timeSlots" value={formData.timeSlots} onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                    placeholder="e.g. 6 AM - 9 AM, 4 PM - 7 PM"
                                                />
                                                <p className="text-[10px] text-slate-400 font-semibold px-2">Comma separated list of slots.</p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Serviceable Pincodes</label>
                                                <textarea
                                                    name="serviceablePincodes" value={formData.serviceablePincodes} onChange={handleChange} rows="3"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all resize-none"
                                                    placeholder="e.g. 272175, 272002"
                                                />
                                                <p className="text-[10px] text-slate-400 font-semibold px-2">Only users with these pincodes can checkout. Leave empty to serve all.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 3. Payments Settings Tab */}
                                {activeTab === 'payments' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                <CreditCard className="text-amber-500" size={24} /> Payment Gateways
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-8">Toggle the payment methods you want to show on the checkout screen.</p>

                                            <div className="space-y-4">
                                                <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                                            <span className="font-black text-xl">₹</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">Cash on Delivery (COD)</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">Allow users to pay upon receiving the fresh farm products.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="enableCOD" checked={formData.enableCOD} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                    </label>
                                                </div>

                                                <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                                            <Smartphone size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">UPI Payments</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">Accept PhonePe, GPay, Paytm, etc.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="enableUPI" checked={formData.enableUPI} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                    </label>
                                                </div>

                                                <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                                            <CreditCard size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">Credit / Debit Cards</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">Secure card payments via Razorpay.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="enableCards" checked={formData.enableCards} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                    </label>
                                                </div>

                                                <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                                            <Landmark size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">Net Banking</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">Accept payments via major Indian banks.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="enableBank" checked={formData.enableBank} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                    </label>
                                                </div>

                                                <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                                            <Wallet size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">Digital Wallets</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">Pay via Paytm, PhonePe, Mobikwik etc.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="enableWallet" checked={formData.enableWallet} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 4. Notification Settings Tab */}
                                {activeTab === 'notifications' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                <Bell className="text-blue-500" size={24} /> Email Notifications
                                            </h3>

                                            <div className="space-y-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800">Order Confirmations</h4>
                                                        <p className="text-xs text-slate-500 mt-1 max-w-sm">Automatically send an email receipt to customers when they successfully place a farm order.</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                                                        <input type="checkbox" name="orderEmails" checked={formData.orderEmails} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800">Promotional Emails</h4>
                                                        <p className="text-xs text-slate-500 mt-1 max-w-sm">Send marketing emails about new farm products and discounts to subscribed users.</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                                                        <input type="checkbox" name="promotionalEmails" checked={formData.promotionalEmails} onChange={handleToggle} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100">
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                <Mail className="text-blue-500" size={24} /> Admin Alerts
                                            </h3>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Receive Alerts At</label>
                                                <input
                                                    type="email" name="adminAlertsEmail" value={formData.adminAlertsEmail} onChange={handleChange}
                                                    className="w-full md:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                                                />
                                                <p className="text-[10px] text-slate-400 font-semibold px-2">New farm orders and customer inquiries will be sent to this email.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
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
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Settings Sync Error</h2>
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

export default AdminSettings;
