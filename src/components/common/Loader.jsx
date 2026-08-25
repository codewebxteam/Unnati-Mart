import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../../assets/foundation/legacy/Logo.webp';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="flex flex-col items-center">
        {/* Pulsing & Glowing Logo */}
        <motion.img
          src={Logo}
          alt="Unnati Mart"
          className="w-20 h-20 object-contain"
          animate={{
            scale: [0.95, 1.05, 0.95],
            filter: [
              "drop-shadow(0 0 5px rgba(217, 119, 6, 0.2))",
              "drop-shadow(0 0 20px rgba(217, 119, 6, 0.6))",
              "drop-shadow(0 0 5px rgba(217, 119, 6, 0.2))"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Logo / Text */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-xl font-black tracking-tighter text-slate-900 leading-none uppercase">
            UNNATI <span className="text-amber-600 italic">MART</span>
          </span>
          
          {/* Progress Loading Bar */}
          <div className="w-[140px] h-[3px] bg-slate-100 rounded-full mt-6 overflow-hidden relative">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 w-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
