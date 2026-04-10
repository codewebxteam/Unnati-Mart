import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../../assets/foundation/unnati_hero.png';
import SearchBar from '../../../components/common/SearchBar';

const Hero = () => {
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <section className="relative w-full bg-white pt-28 pb-12 lg:pt-36 lg:pb-24 overflow-hidden">

      {/* Background Aesthetic Blobs - Refined for White Theme */}
      <div className="absolute top-20 left-[-10%] w-72 h-72 bg-amber-50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-[-5%] w-64 h-64 bg-teal-50 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text Content with Modern Effects */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <span className="text-[9px] font-black text-amber-700 uppercase tracking-[0.3em]">Premium Quality Store</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter">
              Ultimate <br />
              <span className="text-amber-600">
                Unnati Mart.
              </span> <br />
              Selection.
            </h1>

            <p className="mt-8 text-sm lg:text-base text-slate-500 font-medium leading-relaxed max-w-sm border-l-2 border-amber-500 pl-4">
              Step into a world of curated quality. From farm-fresh produce 
              to everyday essentials, Unnati Mart is your foundation for a better lifestyle.
            </p>

            {/* Premium Interactive Buttons */}
            <div className="mt-12 flex flex-row items-center gap-6">
              <Link
                to="/categories"
                className="relative group px-10 py-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl overflow-hidden transition-all active:scale-95 shadow-2xl shadow-slate-200"
              >
                <span className="relative z-10">Start Shopping</span>
                <div className="absolute inset-0 bg-amber-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>

              <button
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900"
              >
                Testimonials
                <div className="flex items-center">
                  <div className="h-[1px] w-8 bg-slate-200 group-hover:w-12 group-hover:bg-amber-500 transition-all duration-500"></div>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </button>
            </div>
          </div>

          {/* Image Section: Sharp & Stylish */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative group">
              {/* Outer Glow Frame */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-100 to-transparent rounded-[3rem] blur-sm opacity-50"></div>

              <div className="relative aspect-[16/11] lg:h-[420px] lg:w-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-slate-100">
                <img
                  src={heroImg}
                  alt="Shop Front"
                  className="w-full h-full object-cover object-top grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />

                {/* Minimal Overlay Gradient for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Stylish Bottom Info */}
              <div className="mt-6 flex items-end justify-between px-2">
                <div className="text-right">
                  <p className={`text-[9px] font-black ${isOpen ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded-full uppercase tracking-widest`}>
                    Live Status: {isOpen ? 'Open Now' : 'Closed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

