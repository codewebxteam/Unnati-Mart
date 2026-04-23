import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Leaf, Truck, ShieldCheck, Users, Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import grandOpeningImg from '../assets/foundation/legacy/grand_opening.png';

const About = () => {
    const navigate = useNavigate();

    const values = [
        { icon: <Leaf size={24} />, title: 'Farm Fresh', desc: 'Direct from local farms to your doorstep — no middlemen, no compromises.' },
        { icon: <ShieldCheck size={24} />, title: 'Traced Purity', desc: 'Every product is quality-checked and traceable back to its source.' },
        { icon: <Truck size={24} />, title: 'Swift Delivery', desc: 'Same-day delivery within Gorakhpur — because freshness can\'t wait.' },
        { icon: <Heart size={24} />, title: 'Community First', desc: 'Empowering local farmers and building a healthier community together.' },
    ];

    const stats = [
        { number: '500+', label: 'Products' },
        { number: '10K+', label: 'Happy Customers' },
        { number: '50+', label: 'Local Farmers' },
        { number: '24/7', label: 'Support' },
    ];

    return (
        <div className="min-h-screen bg-white pt-28 pb-32 relative overflow-hidden">
            {/* Subtle Background Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/40 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/30 blur-[120px] rounded-full" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-200 mb-6">
                        <Star size={12} className="fill-amber-500" />
                        Our Story
                    </span>
                    <h1 className="text-[38px] min-[426px]:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
                        Freshness is not <br className="min-[426px]:hidden" />
                        <span className="text-amber-600 italic">a promise.</span><br />
                        It's our <span className="text-amber-600 italic">identity.</span>
                    </h1>
                    <p className="text-slate-500 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                        Born in the heart of Gorakhpur, Unnati Mart is more than a grocery store — 
                        it's a movement to bring pure, farm-fresh produce to every household with 
                        honesty, transparency, and love.
                    </p>
                </motion.div>

                {/* Grand Opening Image */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative rounded-[2.5rem] overflow-hidden mb-20 shadow-2xl shadow-slate-200/60 border border-slate-100"
                >
                    <img
                        src={grandOpeningImg}
                        alt="Unnati Mart Grand Opening"
                        className="w-full h-[300px] sm:h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] mb-2">
                            The Beginning
                        </p>
                        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Grand Opening Day
                        </h3>
                        <p className="text-white/70 text-sm mt-2 max-w-lg">
                            The day we opened our doors to serve the community with freshness and trust.
                        </p>
                    </div>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24"
                >
                    <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-4">
                            Our Mission
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            Bridging the gap between <span className="text-amber-600 italic">farms</span> and <span className="text-amber-600 italic">families.</span>
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-4">
                            At Unnati Mart, we believe every family deserves access to pure, 
                            unadulterated groceries. We work directly with local farmers across 
                            Uttar Pradesh to eliminate middlemen and ensure that what reaches your 
                            kitchen is as fresh as it was on the farm.
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                            From hand-picked vegetables to cold-pressed oils, from organic spices 
                            to farm-fresh dairy — every product on our shelves tells a story of 
                            quality, care, and commitment to your family's health.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] p-10 border border-amber-100">
                        <div className="grid grid-cols-2 gap-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="text-center"
                                >
                                    <p className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">{stat.number}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Our Values */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-24"
                >
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-3">
                            What We Stand For
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Our Core <span className="text-amber-600 italic">Values</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 + idx * 0.1 }}
                                className="group bg-white rounded-[1.8rem] p-8 border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-100/40 transition-all duration-500"
                            >
                                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                                    {value.icon}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2">{value.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-16 text-center mb-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-600/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-amber-500/10 blur-[80px] rounded-full" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Users size={18} className="text-amber-500" />
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                                Join the Family
                            </p>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                            Thousands of families<br />
                            <span className="text-amber-500 italic">trust us daily.</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                            From humble beginnings in Gorakhpur to serving thousands of households, 
                            our journey has been powered by one thing — your trust. Every order you 
                            place strengthens our mission to make pure food accessible to all.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/categories')}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-amber-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-600/30 hover:bg-amber-500 transition-all duration-300"
                        >
                            <ShoppingBag size={18} />
                            Start Shopping
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
