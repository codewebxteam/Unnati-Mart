import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Star, Info, ShieldCheck, ChevronRight } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

// Local fallbacks
import heroStorefront from '../../../assets/foundation/hero_storefront.webp';
import heroFresh from '../../../assets/foundation/hero_fresh_new.webp';
import heroLifestyle from '../../../assets/foundation/hero_lifestyle.webp';

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
          // Automatically transform any .png from DB to .webp for consistency
          slides: (data.slides || prev.slides).map(s => (typeof s === 'string' ? s.replace('.png', '.webp') : s)),
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
    }, 5000);
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
    <section className="relative w-full bg-white pt-32 pb-8 lg:pt-36 lg:pb-16 overflow-hidden">
      {/* Background Aesthetic Blobs */}
      <div className="absolute top-20 left-[-10%] w-72 h-72 bg-amber-50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-[-5%] w-64 h-64 bg-teal-50 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-[480px] min-[426px]:h-[550px] lg:h-[620px] rounded-[2.5rem] min-[426px]:rounded-[3.5rem] lg:rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-900 group"
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
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full object-cover object-center transition-all duration-1000 brightness-[0.75] group-hover:scale-105"
              />
            </AnimatePresence>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
          </div>

          {/* Content Layer */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 min-[426px]:px-20 lg:px-32">
            {/* Typography Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl min-[426px]:text-7xl lg:text-[84px] font-black text-white leading-[0.95] tracking-tighter mb-4 sm:mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                {renderTitle(heroContent.title)}
              </h1>

              <div className="flex gap-4 min-[426px]:gap-6 items-start mb-8 sm:mb-12">
                <div className="w-1 h-12 min-[426px]:w-1.5 min-[426px]:h-16 bg-amber-500 rounded-full shrink-0"></div>
                <p className="text-xs min-[426px]:text-lg text-slate-200 font-bold leading-relaxed max-w-[240px] min-[426px]:max-w-lg drop-shadow-lg opacity-90">
                  {heroContent.description}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 sm:mb-8"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 px-6 py-3.5 min-[426px]:px-8 min-[426px]:py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl min-[426px]:rounded-2xl text-[10px] min-[426px]:text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-amber-500/20 active:scale-95 group"
                >
                  Shop Now
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Interactive Badges & Status - Hidden on very small screens to save space, or scaled down */}
            <div className="hidden min-[375px]:flex flex-wrap items-center gap-3 sm:gap-8 mt-2 sm:mt-4">
              {heroContent.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 min-[426px]:w-10 min-[426px]:h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                    {/* Render scaled icon */}
                    <div className="scale-75 min-[426px]:scale-100">
                      {ICON_MAP[badge.icon] || <Star size={16} className="text-slate-900" />}
                    </div>
                  </div>
                  <p className="text-[8px] min-[426px]:text-[10px] font-black text-white uppercase tracking-[0.1em] sm:tracking-[0.2em]">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Floating Stats & Nav Controls */}
          <div className="absolute bottom-12 right-12 z-20 flex justify-end pointer-events-none">
            {/* Slide Indicators */}
            <div className="flex gap-3 pointer-events-auto">
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

        {/* Live Status - Moved outside for visibility at the left corner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 flex justify-start"
        >
          <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] transition-all ${isOpen ? 'bg-teal-50/50 border-teal-100' : 'bg-red-50/50 border-red-100'}`}>
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-teal-500 animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.4)]' : 'bg-red-500'}`}></div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOpen ? 'text-teal-600' : 'text-red-500'}`}>
              Live Status: {isOpen ? 'Open Now' : 'Closed'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

