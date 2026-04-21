import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Info, ShoppingBag, User, CircleUser, ShoppingCart, Menu, X, Search } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import throttle from 'lodash/throttle';
import AccountSidebar from './common/sidebar';
import UserAvatar from './common/UserAvatar';
import AuthModal from '../pages/auth/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { realtimeDb as db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthModalOpen, authView, openAuthModal, closeAuthModal } = useAuth();
  const { cartCount } = useCart();
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [firebaseProducts, setFirebaseProducts] = useState([]);

  useMotionValueEvent(scrollY, "change", throttle((latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  }, 200));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch products for search
  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snap) => {
      const data = snap.val();
      if (data) {
        setFirebaseProducts(Object.entries(data).map(([id, val]) => ({
          ...val,
          id,
          img: val.img || val.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'
        })));
      }
    });
    return () => unsubscribe();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = firebaseProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      (product.tag || '').toLowerCase().includes(query)
    );

    setSearchResults(results.slice(0, 5));
    setShowSearchResults(true);
  }, [searchQuery, firebaseProducts]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };


  // Routes where the "Products" nav button should be active
  const productRoutes = ['/products', '/categories', '/grocery', '/fruits', '/vegetables', '/dairy', '/snacks', '/beverages', '/personal-care', '/household', '/wellness', '/baby', '/dry-fruits', '/gallery'];

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Products', path: '/products', icon: <Package size={22} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBag size={22} /> },
    { name: 'About', path: '/about', icon: <Info size={22} /> },
  ];

  return (
    <>
      {/* Top Header */}
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: -120 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 w-full z-[60] px-4 py-5 pointer-events-none"
      >
        <div className="container mx-auto flex justify-between items-center bg-white/95 backdrop-blur-2xl border border-slate-200/60 p-2.5 px-3 sm:px-5 rounded-3xl shadow-2xl pointer-events-auto gap-1 sm:gap-4">

          {/* Logo */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex flex-col cursor-pointer shrink-0"
            onClick={() => navigate('/')}
          >
            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none uppercase flex items-center gap-1">
              <span className="bg-amber-600 text-white px-1.5 py-0.5 rounded-lg not-italic">U</span>NNATI <span className="text-amber-600 italic">MART</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-400 mt-1.5">
              Purely Fresh. Daily Delivered.
            </span>
          </motion.div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden sm:flex flex-1 max-w-xs relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-sm"
            />
            {searchQuery && (
              <button
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-bold text-amber-600 shrink-0">
                        ₹{product.price}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>


          {/* Right Buttons */}
          <div className="flex items-center gap-1 sm:gap-4">

            {/* Cart Button - Simplified */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/cart')}
              className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors"
            >
              <ShoppingCart size={20} className="text-slate-600" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Auth/Profile Section */}
            <div className="flex items-center gap-1 sm:gap-3">
              {!user ? (
                <>
                  {/* Desktop Auth */}
                  <div className="hidden min-[426px]:flex items-center gap-2 sm:gap-3">
                    {/* Login Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuthModal('login')}
                      className="px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-amber-600 transition-colors"
                    >
                      Login
                    </motion.button>

                    {/* Signup Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuthModal('signup')}
                      className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-slate-900 to-amber-600 text-white rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20"
                    >
                      Sign Up
                    </motion.button>

                  </div>

                  {/* Mobile Auth (Signup only) */}
                  <div className="flex min-[426px]:hidden items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuthModal('signup')}
                      className="px-2.5 sm:px-4 py-2 bg-gradient-to-r from-slate-900 to-amber-600 text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20"
                    >
                      Sign Up
                    </motion.button>
                  </div>



                </>
              ) : (
                /* Circular Profile Avatar - Visible only after login */
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="shrink-0"
                >
                  <UserAvatar name={user.name} size="md" />
                </button>
              )}
            </div>



          </div>
        </div>


      </motion.header>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={authView}
      />

      {/* Sidebar */}
      <AccountSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Bottom Navigation */}
      <motion.nav
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: 150, opacity: 0 } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[94%] max-w-[440px]"
      >
        <div className="relative bg-white/90 backdrop-blur-3xl rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = item.name === 'Products'
              ? (productRoutes.includes(location.pathname) || location.pathname.startsWith('/category/') || location.pathname.startsWith('/product/'))
              : location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center py-3 flex-1 rounded-2xl transition-all ${isActive ? 'text-white' : 'text-slate-500'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-1 bg-amber-600 rounded-[1.8rem]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10 text-[8px] min-[375px]:text-[9px] font-black uppercase tracking-[0.05em] min-[375px]:tracking-[0.15em] mt-1">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default Header;
