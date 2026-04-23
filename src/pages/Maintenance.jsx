import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, MessageCircle, ArrowRight } from 'lucide-react';

const Maintenance = ({ message }) => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 relative"
        >
          <div className="w-32 h-32 bg-amber-100 rounded-[3rem] mx-auto flex items-center justify-center relative z-10"
               onClick={() => window.location.href = '/admin/login'}>
            <Settings size={48} className="text-amber-600 animate-[spin_8s_linear_infinite] cursor-pointer" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-50" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-none"
        >
          We're <span className="text-amber-600 italic">Upgrading</span> <br />
          For You.
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed"
        >
          {message || "Unnati Mart is currently under scheduled maintenance to bring you a better shopping experience. We'll be back shortly!"}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
        >
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Back</p>
              <p className="text-sm font-bold text-slate-900">In 2-3 Hours</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support</p>
              <p className="text-sm font-bold text-slate-900">wa.me/unnatimart</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            System Update in Progress
          </div>
          <a 
            href="https://codewebx.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-slate-400 hover:text-amber-600 transition-colors"
          >
            Powered by CodeWebX
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance;
