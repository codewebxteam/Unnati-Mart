import React from 'react';
import { Home, LayoutGrid, Sparkles, History } from 'lucide-react';

const BottomNav = ({ onNavClick, onDealsClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[75px] bg-white/95 backdrop-blur-md flex justify-around items-center z-[1000] border-t border-gray-100 shadow-[0_-4px_30px_rgba(0,0,0,0.06)] px-4 md:max-w-[500px] md:mx-auto md:bottom-8 md:rounded-[2rem] md:border">
      <a 
        href="#home" 
        onClick={(e) => { e.preventDefault(); if(onNavClick) onNavClick('#home'); }} 
        className="flex flex-col items-center gap-1.5 p-2 text-primary font-bold group"
      >
        <div className="p-1 px-3 bg-emerald-50 rounded-xl transition-all duration-300 group-hover:scale-110">
          <Home size={22} className="stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2a2a2a]">Home</span>
      </a>
      <a 
        href="#categories" 
        onClick={(e) => { e.preventDefault(); if(onNavClick) onNavClick('#categories'); }} 
        className="flex flex-col items-center gap-1.5 p-2 text-gray-400 font-bold group hover:text-emerald-600 transition-all"
      >
        <div className="p-1 px-3 rounded-xl transition-all duration-300 group-hover:scale-110">
          <LayoutGrid size={22} className="stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Categories</span>
      </a>
      <a 
        href="#deals" 
        onClick={(e) => { e.preventDefault(); if(onDealsClick) onDealsClick(); }} 
        className="flex flex-col items-center gap-1.5 p-2 text-gray-400 font-bold group hover:text-orange-500 transition-all"
      >
        <div className="p-1 px-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500">
          <Sparkles size={22} className="stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Deals</span>
      </a>
      <a 
        href="#brands" 
        onClick={(e) => { e.preventDefault(); if(onNavClick) onNavClick('#brands'); }} 
        className="flex flex-col items-center gap-1.5 p-2 text-gray-400 font-bold group hover:text-blue-500 transition-all"
      >
        <div className="p-1 px-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500">
          <History size={22} className="stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Brands</span>
      </a>
    </nav>
  );
};

export default BottomNav;

