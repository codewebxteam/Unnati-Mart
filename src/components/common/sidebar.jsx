import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShoppingBag, ShoppingCart, X, ChevronRight, LogOut, 
  Settings, Heart, ShieldCheck, Star, Gift, MessageCircle, 
  Bell, HelpCircle, ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useScrollLock from '../../hooks/useScrollLock';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import UserAvatar from './UserAvatar';

const AccountSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount, grandTotal } = useCart();
  const { orders } = useOrders();
  
  const [recentlyViewed, setRecentlyViewed ] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);

  useScrollLock(isOpen);

  // Load recently viewed on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('unnatimart_recently_viewed');
      if (saved) setRecentlyViewed(JSON.parse(saved).slice(0, 5));
    }
  }, [isOpen]);

  // Derived Values
  const activeOrdersCount = useMemo(() => 
    orders.filter(o => ['Pending', 'Confirmed', 'Shipped'].includes(o.status)).length
  , [orders]);

  const rewardPoints = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    return Math.floor(totalSpent / 10); // ₹10 = 1 Point
  }, [orders]);

  const latestOrder = useMemo(() => orders[0] || null, [orders]);

  const menuItems = [
    { 
      id: 'orders', 
      label: 'My Orders', 
      desc: 'Track & Manage Orders', 
      icon: <ShoppingBag size={20} />, 
      path: '/orders',
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} Active` : null 
    },
    { 
      id: 'wishlist', 
      label: 'My Wishlist', 
      desc: 'Your Favorite Items', 
      icon: <Heart size={20} />, 
      path: '/wishlist' 
    },
    { 
      id: 'cart', 
      label: 'My Cart', 
      desc: cartCount > 0 ? `${cartCount} items • ₹${grandTotal}` : 'Ready to Checkout?', 
      icon: <ShoppingCart size={20} />, 
      path: '/cart',
      badge: cartCount > 0 ? cartCount : null
    },
    ...(user?.role === 'admin' ? [{
      id: 'admin',
      label: 'Admin Console',
      desc: 'Management Dashboard',
      icon: <ShieldCheck size={20} className="text-amber-600" />,
      path: '/admin'
    }] : []),
  ];


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
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[101] shadow-[-20px_0_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          >
            {/* 1. Profile Header */}
            <div className="p-8 pb-10 border-b border-slate-50 relative bg-slate-50/50">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-5 mt-4">
                <div className="shrink-0 relative">
                  <UserAvatar name={user?.name} size="lg" className="border-2 border-white shadow-lg" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">
                    {user?.name || 'Guest'}.
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 rounded-full text-[8px] font-black text-amber-700 uppercase tracking-widest">
                      <Star size={8} fill="currentColor" /> {rewardPoints} Points
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-2">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
              
              {/* Profile Linked Action */}
              <div className="px-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-4.5 bg-slate-50/80 hover:bg-slate-900 hover:text-white rounded-[2rem] transition-all active:scale-95 group border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-amber-400 transition-colors">
                      <Settings size={18} className="group-hover:rotate-45 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-tight leading-none mb-1 group-hover:text-white">Account Settings</p>
                      <p className="text-[9px] font-medium opacity-50 group-hover:opacity-80">Profile & Security</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              <div className="flex items-center gap-4 px-4">
                <div className="flex-1 h-[1px] bg-slate-100" />
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Menu</span>
                <div className="flex-1 h-[1px] bg-slate-100" />
              </div>
              {/* Shopping & Activity */}
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-2 mb-6 flex items-center justify-between">
                  Activity 
                  {activeOrdersCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                </p>
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className="w-full flex items-center justify-between p-4.5 bg-white rounded-[2rem] hover:bg-slate-900 hover:text-white transition-all group border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-amber-400 transition-colors">
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-tight leading-none mb-1">
                            {item.label}
                          </p>
                          <p className="text-[9px] font-medium opacity-50 group-hover:opacity-80">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.badge && (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-tight group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Engagement: Referral & Summary */}
              <div className="grid grid-cols-1 gap-4">
                 {latestOrder && (
                   <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                        <ShoppingBag size={80} />
                      </div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Bell size={10} /> Recent Order Status
                      </p>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2 italic">
                        {latestOrder.status === 'Delivered' ? 'Package Delivered' : `Order ${latestOrder.status}`}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Expected soon</span>
                        <ArrowRight size={10} />
                      </div>
                   </div>
                 )}
              </div>

              {/* Recently Viewed */}
              {recentlyViewed.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-2 mb-6">
                    Recently Viewed
                  </p>
                  <div className="flex gap-4 px-2 overflow-x-auto pb-4 scrollbar-hide">
                    {recentlyViewed.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.id}`}
                        onClick={onClose}
                        className="shrink-0 group text-center w-20 block"
                      >
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3 mb-2 group-hover:bg-white group-hover:shadow-md transition-all">
                          <img src={prod.img} alt={prod.name} className="w-full h-full object-contain drop-shadow-sm" />
                        </div>
                        <p className="text-[8px] font-black text-slate-900 uppercase truncate px-1">
                          {prod.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings & Support */}
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-2 mb-4">
                  Preferences & Support
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl px-6">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-slate-400" />
                      <span className="text-xs font-black uppercase tracking-tight text-slate-600">Notifications</span>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${showNotifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showNotifications ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                      <HelpCircle size={14} /> Help Center
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                      <MessageCircle size={14} /> Live Chat
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Global Footer Actions */}
            <div className="p-8 border-t border-slate-50 bg-white">
              <div className="flex flex-col gap-4">


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
                    Secure Sign Out
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
                    Sign In / Join Store
                  </button>
                )}
              </div>

              <div className="mt-6 flex justify-center gap-4 text-slate-300">
                <span className="text-[8px] font-black uppercase tracking-widest hover:text-slate-600 cursor-pointer">Privacy</span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-20">•</span>
                <span className="text-[8px] font-black uppercase tracking-widest hover:text-slate-600 cursor-pointer">Terms</span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-20">•</span>
                <span className="text-[8px] font-black uppercase tracking-widest hover:text-slate-600 cursor-pointer">Unnati V1.2</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountSidebar;
