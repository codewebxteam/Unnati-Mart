import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Clock, ShieldCheck, Leaf } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

// Hero images
import deliveryHeroImg from '../../../assets/foundation/delivery_hero.png';
import organicMarketImg from '../../../assets/foundation/organic_market.png';
import nutCollectionImg from '../../../assets/foundation/nut_collection.png';

const Hero = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinutes = hours * 60 + minutes;
      const openTime = 6 * 60;
      const closeTime = 23 * 60;
      setIsOpen(currentMinutes >= openTime && currentMinutes <= closeTime);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-white pt-28 pb-6 lg:pt-32 lg:pb-10 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50/30 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Hero Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0">

          {/* ===== LEFT CONTENT ===== */}
          <div className="w-full lg:w-[45%] xl:w-[42%] z-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Exclusive Offer Badge */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-bold text-slate-500 tracking-wide">Exclusive offer</span>
                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full tracking-wider uppercase">
                  25% Off
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl min-[426px]:text-5xl lg:text-[56px] xl:text-[64px] font-black text-slate-900 leading-[1.05] tracking-tight mb-5">
                FRESH FOOD, FAIR PRICES,{' '}
                <span className="text-red-500">FAST DELIVERY</span>
              </h1>

              {/* Description */}
              <p className="text-sm lg:text-[15px] text-slate-500 font-medium leading-relaxed max-w-md mb-8">
                Fresh veggies, fruits & groceries for your kitchen. Quality produce delivered right to you every day.
              </p>

              {/* Shop Now Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-bold tracking-wide transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
                >
                  SHOP NOW
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Truck size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                    <Clock size={14} className="text-amber-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Same Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-blue-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">100% Fresh</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== CENTER - DELIVERY HERO IMAGE ===== */}
          <div className="w-full lg:w-[30%] xl:w-[32%] relative flex justify-center z-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative circle behind hero */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-emerald-50 to-amber-50/60 blur-sm"></div>
              </div>
              <img
                src={deliveryHeroImg}
                alt="Fresh grocery delivery"
                className="relative z-10 w-full max-w-[380px] lg:max-w-[420px] h-auto object-contain drop-shadow-2xl"
              />

              {/* Floating Fresh Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-6 left-0 lg:-left-4 bg-white rounded-2xl px-4 py-2.5 shadow-xl shadow-slate-200/60 border border-slate-100 z-20 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Leaf size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">100% Organic</p>
                  <p className="text-[9px] text-slate-400 font-bold">Farm Fresh Daily</p>
                </div>
              </motion.div>

              {/* Live Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-8 right-0 lg:-right-4 z-20"
              >
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-lg ${isOpen ? 'bg-white border-emerald-100' : 'bg-white border-red-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}></div>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isOpen ? 'Open Now' : 'Closed'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ===== RIGHT PROMO CARDS ===== */}
          <div className="w-full lg:w-[25%] xl:w-[26%] flex flex-row lg:flex-col gap-4 z-10 order-3">
            {/* Card 1: Healthy Food Organic Market */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex-1 rounded-3xl overflow-hidden group cursor-pointer shadow-lg shadow-slate-200/50 border border-slate-100"
            >
              <div className="relative h-[200px] lg:h-[220px]">
                <img
                  src={organicMarketImg}
                  alt="Organic Market"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                {/* Card content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1 block">Healthy Food</span>
                  <h3 className="text-lg font-black text-white leading-tight tracking-tight">
                    Organic Market
                  </h3>
                  <p className="text-[10px] text-white/70 font-medium mt-1 mb-3">
                    Start your daily shopping with pure Organic food
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-wider hover:text-white transition-colors group/link"
                  >
                    Shop Now
                    <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Nut Collection */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative flex-1 rounded-3xl overflow-hidden group cursor-pointer shadow-lg shadow-slate-200/50 border border-slate-100"
            >
              <div className="relative h-[200px] lg:h-[220px]">
                <img
                  src={nutCollectionImg}
                  alt="Nut Collection"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                {/* Discount badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-xl">
                  <span className="text-[18px] font-black leading-none block">25%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider">OFF</span>
                </div>

                {/* Card content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-black text-white leading-tight tracking-tight">
                    Nut Collection
                  </h3>
                  <p className="text-[10px] text-white/70 font-medium mt-1 mb-3">
                    We deliver organic vegetables & fruits
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-400 uppercase tracking-wider hover:text-white transition-colors group/link"
                  >
                    Shop Now
                    <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 lg:mt-14"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {[
              { icon: <Truck size={20} />, title: "Free Delivery", desc: "Orders above ₹499", color: "text-emerald-600 bg-emerald-50" },
              { icon: <Clock size={20} />, title: "Fast Delivery", desc: "Same day guaranteed", color: "text-amber-600 bg-amber-50" },
              { icon: <ShieldCheck size={20} />, title: "Best Quality", desc: "100% freshness promise", color: "text-blue-600 bg-blue-50" },
              { icon: <Leaf size={20} />, title: "100% Organic", desc: "Farm-to-fork purity", color: "text-emerald-600 bg-emerald-50" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xs lg:text-sm font-black text-slate-800 tracking-tight">{feature.title}</h4>
                  <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
