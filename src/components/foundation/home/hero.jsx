import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, Zap, ShoppingBag } from 'lucide-react';
import heroStorefront from '../../../assets/foundation/hero_storefront.png';
import heroFresh from '../../../assets/foundation/hero_fresh_new.png';
import vegImg from '../../../assets/categories/vegetables.png';
import SearchBar from '../../../components/common/SearchBar';

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [vegImg, heroStorefront, heroFresh];

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Categories', path: '/categories', icon: <LayoutGrid size={22} /> },
    { name: 'Deals', path: '/deals', icon: <Zap size={22} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBag size={22} /> },
  ];

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const currentMinutes = hours * 60 + minutes;
      const openTime = 6 * 60;   // 6:00 AM
      const closeTime = 23 * 60; // 11:00 PM

      setIsOpen(currentMinutes >= openTime && currentMinutes <= closeTime);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Slightly longer for a more cinematic feel
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="relative w-full bg-white pt-20 pb-8 lg:pt-28 lg:pb-16 overflow-hidden">
      {/* Background Aesthetic Blobs - Subtle depth */}
      <div className="absolute top-20 left-[-10%] w-72 h-72 bg-amber-50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-[-5%] w-64 h-64 bg-teal-50 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-[550px] lg:h-[700px] rounded-[3rem] lg:rounded-[4.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-900 group"
        >
          {/* Slider Background with Dynamic Scaling */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slides[currentSlide]}
                alt={`Hero Slide ${currentSlide + 1}`}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full object-cover object-center transition-all duration-1000 brightness-[0.75] group-hover:scale-105"
              />
            </AnimatePresence>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Content Layer */}
          <div className="relative z-10 h-full flex flex-col justify-center px-10 sm:px-20 lg:px-32">
            {/* Typography Section */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-10"
            >
              Experience Freshness <br />
              <span className="text-amber-500 italic drop-shadow-sm">
                at Unnati Mart
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg lg:text-2xl text-slate-200 font-medium leading-relaxed max-w-xl mb-14"
            >
              Farm-fresh groceries delivered to your doorstep.
            </motion.p>

            {/* Interactive Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link
                to="/categories"
                className="w-full sm:w-auto relative group px-12 sm:px-16 py-5 bg-amber-600 text-white text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] rounded-2xl overflow-hidden transition-all active:scale-95 shadow-2xl shadow-amber-600/40 text-center"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-900">Shop Now</span>
                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </Link>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-12 right-12 flex items-center gap-6 z-20">
            <div className="flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === index ? 'w-14 bg-amber-500' : 'w-4 bg-white/20 hover:bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-12 left-12 z-20">
            <div className={`flex items-center gap-3 px-5 py-2 rounded-full backdrop-blur-xl border ${isOpen ? 'border-teal-500/30 bg-teal-500/10' : 'border-red-500/30 bg-red-500/10 shadow-lg'}`}>
              <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.6)]' : 'bg-red-400'}`}></div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-teal-400' : 'text-red-400'}`}>
                Live Status: {isOpen ? 'Open Now' : 'Closed'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation - Moved outside Hero for better hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-12 flex justify-center w-full"
        >
          <div className="bg-white rounded-[2.5rem] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100 flex justify-between items-center w-full max-w-[440px]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`relative flex flex-col items-center justify-center py-3 flex-1 rounded-2xl transition-all ${isActive ? 'text-white' : 'text-slate-500 hover:text-amber-600'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="hero-nav-active-pill"
                      className="absolute inset-1 bg-amber-600 rounded-[1.8rem]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 text-[9px] font-black uppercase tracking-widest mt-1">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default Hero;

