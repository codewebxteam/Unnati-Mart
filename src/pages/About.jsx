import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Leaf, Truck, ShieldCheck, Users, Star, ArrowRight, ShoppingBag, Code2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { realtimeDb as db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import grandOpeningImg from '../assets/foundation/legacy/grand_opening.webp';

const About = () => {
    const navigate = useNavigate();

    const ICON_MAP = {
        'leaf': <Leaf size={24} className="stroke-[2.5]" />,
        'shield': <ShieldCheck size={24} className="stroke-[2.5]" />,
        'truck': <Truck size={24} className="stroke-[2.5]" />,
        'heart': <Heart size={24} className="stroke-[2.5]" />,
    };

    // Default localized rich copywriting for fallback and sync structural mapping
    const [values, setValues] = useState([
        { icon: 'leaf', title: 'Farm To Kitchen, Direct', desc: 'Sourced directly from local farms of Uttar Pradesh. No middlemen, no cold-storage delays—just pure freshness.' },
        { icon: 'shield', title: '100% Certified Purity', desc: 'Every single item undergoes strict quality checks. If it isn’t pure enough for our family, it doesn’t reach yours.' },
        { icon: 'truck', title: 'Hyperlocal Swift Express', desc: 'Super-fast delivery across Gorakhpur because we believe daily essentials and freshness shouldn’t wait.' },
        { icon: 'heart', title: 'Empowering Our Farmers', desc: 'Every purchase you make directly supports and sustains our local farming communities and native families.' },
    ]);

    const [stats, setStats] = useState([
        { number: '500+', label: 'Daily Essentials' },
        { number: '10K+', label: 'Happy Families' },
        { number: '50+', label: 'Local Farmers' },
        { number: '24/7', label: 'Dedicated Care' },
    ]);

    useEffect(() => {
        const valuesRef = ref(db, 'settings/about/values');
        const statsRef = ref(db, 'settings/about/stats');

        const unsubValues = onValue(valuesRef, (snap) => {
            if (snap.exists()) setValues(Object.values(snap.val()));
        });

        const unsubStats = onValue(statsRef, (snap) => {
            if (snap.exists()) setStats(Object.values(snap.val()));
        });

        return () => {
            unsubValues();
            unsubStats();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 relative overflow-hidden selection:bg-amber-500 selection:text-white">
            {/* Ambient Enterprise Aesthetic Soft Background Blur Lights */}
            <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-amber-200/20 blur-[140px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-1/3 left-0 w-[550px] h-[550px] bg-orange-200/20 blur-[130px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-100/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Hero Branding Header */}
                <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6"
                    >
                        <Star size={12} className="fill-amber-500 text-amber-500 animate-pulse" />
                        <span className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">The Unnati Heritage</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8 uppercase"
                    >
                        Freshness is not <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 italic font-serif lowercase pr-2">
                            just a promise.
                        </span>
                        <br />
                        It’s our <span className="text-slate-900 relative inline-block">identity.<span className="absolute left-0 bottom-1 w-full h-[6px] bg-amber-500/20 -z-10 rounded-full"></span></span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
                    >
                        Born in the heart of Gorakhpur, Unnati Mart is not just an ordinary grocery store. 
                        We are a community-backed movement dedicated to serving your family with clean, 
                        honest, and pure farm-fresh essentials—crafted with absolute transparency and care.
                    </motion.p>
                </div>

                {/* Grand Opening Immersive Visual Showcase Frame */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[2.5rem] overflow-hidden mb-24 lg:mb-32 shadow-2xl shadow-slate-200/40 border border-white group"
                >
                    <img
                        src={grandOpeningImg}
                        alt="Unnati Mart Historic Grand Opening Event"
                        loading="eager"
                        className="w-full h-[350px] sm:h-[500px] lg:h-[580px] object-cover"
                    />
                    {/* Immersive Cinematic Gradient Layer Shield */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-95" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.35em] bg-white/10 backdrop-blur-md px-3 py-1 rounded-md inline-block mb-3">
                                Where It All Began
                            </span>
                            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
                                Our Grand Opening Day
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed opacity-90">
                                The unforgettable day we opened our doors with a simple vision: to eliminate compromise from your daily diet and lifestyle by setting unmatched hygiene benchmarks.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Local Mission Blueprint & Premium Dark Stats Bento Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28 lg:mb-36">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                            Our Core Mission
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] uppercase">
                            Connecting native <span className="text-amber-500 italic font-serif lowercase">farms</span> directly to your family’s <span className="text-amber-500 italic font-serif lowercase">health.</span>
                        </h2>
                        <div className="space-y-4 text-slate-600 text-base font-medium leading-relaxed">
                            <p>
                                At Unnati Mart, we believe every household has a right to pure, chemical-free groceries. 
                                By sourcing straight from hard-working local farmers across Uttar Pradesh, we completely 
                                bypass middleman markups and commercial delays to ensure the food reaches your kitchen 
                                exactly the way nature intended.
                            </p>
                            <p className="text-sm sm:text-base text-slate-500 border-l-4 border-slate-200 pl-4 italic">
                                From cold-pressed nutrient-rich traditional mustard oils to authentic hand-ground spices, 
                                and from local dairy to pristine farm-picked greens—every item on our shelves carries 
                                a legacy of premium quality control and deep social responsibility.
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Dark Modern High-Contrast Bento Container */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 bg-gradient-to-b from-[#0F172A] to-[#020617] text-white rounded-[3rem] p-8 sm:p-12 border border-slate-800 shadow-2xl shadow-slate-900/30 relative overflow-hidden"
                    >
                        <div className="absolute -right-16 -top-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-12 relative z-10">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="text-left border-l-[3px] border-amber-500 pl-4 group">
                                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 tracking-tight transition-transform duration-300 group-hover:translate-x-1 inline-block">
                                        {stat.number}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Core Pillar Governing Values */}
                <div className="mb-28 lg:mb-36">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-3">
                            The Standard We Live By
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
                            Our Governing Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 font-serif lowercase italic pr-1">values.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="group bg-white rounded-[2rem] p-8 border border-slate-200/50 hover:border-slate-300/80 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 flex flex-col items-start"
                            >
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-105 transition-all duration-500 shadow-xs">
                                    {ICON_MAP[value.icon] || <Leaf size={24} />}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2 flex items-center gap-1.5">
                                    {value.title}
                                </h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Interactive Trust Conversion Hub Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0F172A] rounded-[3.5rem] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-slate-900/40 border border-slate-800"
                >
                    <div className="absolute -right-36 -top-36 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -left-36 -bottom-36 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <CheckCircle size={14} className="text-amber-400 fill-amber-400/10" />
                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">
                                Join The Healthy Life Movement
                            </p>
                        </div>
                        
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 uppercase">
                            Thousands of premium families <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 italic font-serif lowercase">trust us daily.</span>
                        </h2>
                        
                        <p className="text-slate-400 text-sm sm:text-base font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                            From native roots across Gorakhpur right straight into your everyday kitchen—our real validation lies in the long-term health, safety, and uncompromising quality benchmarks we bring to your table.
                        </p>
                        
                        <button
                            onClick={() => navigate('/categories')}
                            className="group inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-full text-[11px] font-black uppercase tracking-[0.18em] shadow-xl shadow-orange-500/10 hover:brightness-110 active:scale-[0.98] transition-all duration-300"
                        >
                            <ShoppingBag size={16} className="stroke-[2.5]" />
                            Start Shopping Fresh
                            <ArrowRight size={14} className="stroke-[2.5] transform group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* 🛡️ Strategic Technical Partner Verification Footer Label */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-semibold px-2"
                >
                    <p>© 2026 Unnati Mart. All Rights Reserved.</p>
                    
                    <a 
                        href="https://codewebx.in" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300/80 hover:text-slate-900 transition-all duration-300 group"
                    >
                        <Code2 size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors duration-300" />
                        <span className="text-[11px] tracking-wide text-slate-500 font-medium">
                            Technical Partner: <span className="font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors duration-300">codewebx.in</span>
                        </span>
                    </a>
                </motion.div>

            </div>
        </div>
    );
};

export default About;