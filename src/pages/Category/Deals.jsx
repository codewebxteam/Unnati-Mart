import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Timer, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Deals = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 mb-8"
                >
                    <Zap size={12} className="fill-blue-400" />
                    Flash Deals Incoming
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl sm:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8"
                >
                    Unbeatable <br />
                    <span className="text-blue-500 italic">Savings.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-12"
                >
                    Our algorithm is currently sourcing the freshest deals from the farm.
                    Premium quality, now with premium discounts. Stay tuned.
                </motion.p>

                {/* Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 max-w-2xl mx-auto mb-12"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 text-left">
                            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40">
                                <Timer size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Status Report</p>
                                <h3 className="text-2xl font-black text-white tracking-tight leading-none">Launching Soon</h3>
                            </div>
                        </div>
                        <div className="h-full w-[1px] bg-white/10 hidden sm:block" />
                        <div className="text-left w-full sm:w-auto">
                            <div className="flex -space-x-2 mb-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                                        <Sparkles size={12} className="text-blue-500" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">1.2k People Watching</p>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="group px-10 py-5 bg-white text-slate-950 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 mx-auto hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                    <ShoppingBag size={18} />
                    Continue Shopping
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-indigo-600/10 border border-indigo-600/20 rounded-[3rem] -rotate-12 blur-sm" />
            <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-blue-600/10 border border-blue-600/20 rounded-full blur-sm" />
        </div>
    );
};

export default Deals;
