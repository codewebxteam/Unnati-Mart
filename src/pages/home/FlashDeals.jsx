import React, { useState, useEffect } from 'react';
import { Timer, Star, ShoppingCart } from 'lucide-react';

const FlashDeals = ({ products, onAddToCart, onViewAllDeals }) => {
  const dealProducts = products.filter(p => p.id % 2 === 0).slice(0, 8); // Temporary logic till products.js updated
  
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="deals" className="py-16 bg-white rounded-[4rem] px-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-gray-100/80 my-16 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-primary to-rose-400 opacity-50"></div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
               <Timer size={18} /> Flash Deals
             </span>
             <div className="flex gap-2 items-center bg-white px-4 py-1.5 rounded-2xl shadow-inner border border-gray-100 font-black text-xl">
               <span className="w-8 text-center">{timeLeft.h.toString().padStart(2, '0')}</span>
               <span className="text-gray-300 animate-pulse">:</span>
               <span className="w-8 text-center">{timeLeft.m.toString().padStart(2, '0')}</span>
               <span className="text-gray-300 animate-pulse">:</span>
               <span className="w-8 text-center text-rose-500">{timeLeft.s.toString().padStart(2, '0')}</span>
             </div>
          </div>
          <h2 className="text-4xl font-black text-charcoal">Deal of the Day</h2>
          <p className="text-gray-500 font-bold text-lg mt-2">Grab these premium items before the clock runs out!</p>
        </div>
        <button onClick={onViewAllDeals} className="text-primary font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">See All Deals &rarr;</button>
      </div>

      <div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 -mx-10 px-10">
        {dealProducts.map((prod) => (
          <div 
            key={prod.id} 
            className="min-w-[300px] md:min-w-[320px] bg-white rounded-[3.5rem] p-8 border-2 border-gray-50 hover:border-rose-100 hover:shadow-[0_20px_50px_rgba(244,63,94,0.1)] transition-all duration-500 group relative"
          >
            <div className="aspect-square bg-white rounded-[2.5rem] p-6 mb-6 relative overflow-hidden flex items-center justify-center">
               <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg z-10 uppercase tracking-widest animate-pulse">
                Save {prod.discount || '20%'}
               </div>
               <img 
                 src={prod.img} 
                 alt={prod.name} 
                 className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
               />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{prod.category}</span>
              <h3 className="text-xl font-black text-charcoal mb-4 h-[3rem] line-clamp-2 leading-tight">{prod.name}</h3>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest line-through mb-1">Was ₹{parseInt(prod.price.slice(1)) + 40}</span>
                  <span className="text-2xl font-black text-rose-500">{prod.price}</span>
                </div>
                <button 
                  onClick={() => onAddToCart(prod)}
                  className="p-4 bg-charcoal text-white rounded-3xl hover:bg-primary transition-all active:scale-95 shadow-lg group/btn"
                >
                  <ShoppingCart size={22} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>

              {/* Inventory Bar */}
              <div className="mt-8">
                 <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-2">
                    <span>Available: 12</span>
                    <span>Sold: 45</span>
                 </div>
                 <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[75%] animate-pulse"></div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;
