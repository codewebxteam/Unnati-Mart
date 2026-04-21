import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Star, Info, ShieldCheck, ChevronRight } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

// Local fallbacks
import heroStorefront from '../../../assets/foundation/hero_storefront.png';
import heroFresh from '../../../assets/foundation/hero_fresh_new.png';
import heroLifestyle from '../../../assets/foundation/hero_lifestyle.png';

const ICON_MAP = {
  truck: <Truck size={18} className="text-slate-900" />,
  star: <Star size={18} className="text-slate-900" />,
  info: <Info size={18} className="text-slate-900" />,
  shield: <ShieldCheck size={18} className="text-slate-900" />,
};

const Hero = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroContent, setHeroContent] = useState({
    slides: [heroStorefront, heroFresh, heroLifestyle],
    title: 'Explore \n Unnati Mart. \n Freshness.',
    description: 'Step into a world of curated quality. From farm-fresh produce to everyday essentials, Unnati Mart is your foundation for a better lifestyle.',
    badges: [
      { icon: 'truck', text: 'Free Delivery Above ₹499' },
      { icon: 'star', text: '4.9/5 Customer Reviews' }
    ]
  });

  useEffect(() => {
    // Fetch dynamic content from RTDB
    const heroRef = ref(db, 'settings/hero');
    const unsubHero = onValue(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeroContent(prev => ({
          ...prev,
          ...data,
          // Ensure slides are always an array even if data is partial
          slides: data.slides || prev.slides,
          badges: data.badges || prev.badges
        }));
      }
    });

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
    const interval = setInterval(checkStatus, 60000);
    
    return () => {
      unsubHero();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.slides.length);
    }, 8000);
    return () => clearInterval(slideInterval);
  }, [heroContent.slides.length]);

  // Helper to render title with breaks
  const renderTitle = (title) => {
    return title.split('\\n').map((line, i) => {
      if (line.includes('Unnati Mart.')) {
        return <React.Fragment key={i}><span className="text-amber-500">{line}</span> <br /></React.Fragment>;
      }
      return <React.Fragment key={i}>{line} <br /></React.Fragment>;
    });
  };

  return (
    <section className="relative w-full bg-white pt-20 pb-8 lg:pt-28 lg:pb-16 overflow-hidden">
      {/* Background Aesthetic Blobs */}
      <div className="absolute top-20 left-[-10%] w-72 h-72 bg-amber-50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-[-5%] w-64 h-64 bg-teal-50 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-[550px] lg:h-[620px] rounded-[3.5rem] lg:rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-900 group"
        >
          {/* Slider Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={heroContent.slides[currentSlide]}
                alt={`Hero Slide ${currentSlide + 1}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full object-cover object-center transition-all duration-1000 brightness-[0.7] group-hover:scale-105"
              />
            </AnimatePresence>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
          </div>

          {/* Content Layer */}
          <div className="relative z-10 h-full flex flex-col justify-center px-10 sm:px-20 lg:px-32">
            {/* Typography Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                {renderTitle(heroContent.title)}
              </h1>

              <div className="flex gap-6 items-start mb-12">
                <div className="w-1.5 h-16 bg-amber-500 rounded-full shrink-0"></div>
                <p className="text-base lg:text-lg text-slate-200 font-bold leading-relaxed max-w-lg drop-shadow-lg">
                  {heroContent.description}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-4 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-amber-500/20 active:scale-95 group"
                >
                  Shop Now
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Interactive Badges & Status */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-4">
              {heroContent.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    {ICON_MAP[badge.icon] || <Star size={18} className="text-slate-900" />}
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Floating Stats & Nav Controls */}
          <div className="absolute bottom-12 left-12 right-12 z-20 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6">
            {/* Live Status */}
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-2xl border ${isOpen ? 'border-teal-500/30 bg-black/40' : 'border-red-500/30 bg-red-500/10'} shadow-2xl`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-teal-400 animate-pulse shadow-[0_0_12px_rgba(45,212,191,0.6)]' : 'bg-red-400'}`}></div>
              <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isOpen ? 'text-teal-400' : 'text-red-400'}`}>
                Live Status: {isOpen ? 'Open Now' : 'Closed'}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-3">
              {heroContent.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-700 ${currentSlide === index ? 'w-16 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'w-4 bg-white/30 hover:bg-white/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

