import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-slate-100 border-t-amber-600 rounded-full"
        />
        
        {/* Logo / Text */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
            UNNATI <span className="text-amber-600 italic">MART</span>
          </span>
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
