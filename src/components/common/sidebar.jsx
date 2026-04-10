import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, ShoppingCart, X, ChevronRight, LogOut, Settings, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useScrollLock from '../../hooks/useScrollLock';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from './UserAvatar';

const AccountSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useScrollLock(isOpen);

  const menuItems = [
    { id: 'orders', label: 'My Orders', desc: 'Track & Manage Orders', icon: <ShoppingBag size={20} />, path: '/orders' },
    { id: 'wishlist', label: 'My Wishlist', desc: 'Your Favorite Items', icon: <Heart size={20} />, path: '/wishlist' },
    { id: 'cart', label: 'My Cart', desc: 'Ready to Checkout?', icon: <ShoppingCart size={20} />, path: '/cart' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[101] shadow-[-20px_0_80px_rgba(0,0,0,0.15)] flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 relative bg-slate-50/50">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mt-4">
                <div className="shrink-0">
                  <UserAvatar name={user?.name} size="lg" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter italic leading-none">
                    Hello, {user?.name || 'Guest'}.
                  </h2>
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mt-1">
                    Verified Member
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-5 space-y-3 overflow-y-auto">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 mb-4">
                Your Shopping & Activity
              </p>

              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center justify-between p-5 bg-white rounded-[2.5rem] hover:bg-slate-900 hover:text-white transition-all group border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-amber-400 transition-colors">
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black uppercase tracking-tight leading-none mb-1">
                        {item.label}
                      </p>
                      <p className="text-[9px] font-medium opacity-50 group-hover:opacity-80">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}

              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 mt-8 mb-4">
                Account Settings
              </p>

              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center justify-between p-5 bg-white rounded-[2.5rem] hover:bg-slate-50 transition-all group border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black uppercase tracking-tight leading-none mb-1">
                      My Profile
                    </p>
                    <p className="text-[9px] font-medium opacity-50">
                      Settings & Security
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="opacity-20" />
              </button>
            </nav>

            <div className="p-8 border-t border-slate-50">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                    navigate('/');
                  }}
                  className="w-full py-4.5 bg-red-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="w-full py-4.5 bg-amber-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 active:scale-95"
                >
                  <User size={14} />
                  Sign In / Join Now
                </button>
              )}

              <div className="mt-6 flex justify-center gap-4 text-slate-300">
                <span className="text-[8px] font-black uppercase tracking-widest">Privacy</span>
                <span className="text-[8px] font-black uppercase tracking-widest">•</span>
                <span className="text-[8px] font-black uppercase tracking-widest">Terms</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountSidebar;
