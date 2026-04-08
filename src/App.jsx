import React, { useState, useEffect } from 'react';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Auth from './components/Auth';

// Home Sections
import Hero from './pages/Hero';
import Categories from './pages/Category/Categories';
import CategoryDetail from './pages/Category/CategoryDetail';
import DealsPage from './pages/DealsPage';
import CartPage from './pages/CartPage';

// New Professional Sections
import PromoSlider from './pages/home/PromoSlider';
import FlashDeals from './pages/home/FlashDeals';
import BrandSpotlight from './pages/home/BrandSpotlight';
import TrustBar from './pages/home/TrustBar';
import Testimonials from './pages/home/Testimonials';
import ContactUs from './pages/home/ContactUs';

// Data
import { products } from './data/products';
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!selectedCategory && !showCart && !showAuth) {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, showCart, showAuth]);

  const handleHomeNav = (hash) => {
    setShowCart(false);
    setShowAuth(false);
    setSelectedCategory(null);
    // Slight delay to ensure home sections are rendered before scrolling
    setTimeout(() => {
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  // Logic to get a diverse, randomized mix of products for the homepage
  const getFeaturedProducts = () => {
    const categories = [...new Set(products.map(p => p.category))];
    let diverseProducts = [];

    // 1. Pick one random product from each category first to guarantee representation
    categories.forEach(cat => {
      const catProducts = products.filter(p => p.category === cat);
      const randomProduct = catProducts[Math.floor(Math.random() * catProducts.length)];
      if (randomProduct) diverseProducts.push(randomProduct);
    });

    // 2. Fill the remaining slots (up to 16) with other high-rated products
    const remaining = products.filter(p => !diverseProducts.includes(p));
    const sortedRemaining = [...remaining].sort((a, b) => b.rating - a.rating);
    diverseProducts.push(...sortedRemaining.slice(0, 16 - diverseProducts.length));

    // 3. Shuffle the final list so the order is different every time (Mosaic effect)
    return diverseProducts.sort(() => Math.random() - 0.5).slice(0, 16);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : getFeaturedProducts();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-outfit bg-gray-50/30">
      <Header
        cartCount={totalCartCount}
        onCartClick={() => {
          setShowAuth(false);
          setShowCart(true);
        }}
        onLogoClick={() => handleHomeNav()}
        onUserClick={() => {
          setShowCart(false);
          setAuthMode('signup');
          setShowAuth(true);
        }}
      />

      {/* Auth Modal Overlay */}
      <Auth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialMode={authMode} 
      />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pb-24">
        {showCart ? (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onClose={() => setShowCart(false)}
            onAddToCart={handleAddToCart}
          />
        ) : selectedCategory === 'DEALS' ? (
          <DealsPage
            products={products}
            onBack={() => setSelectedCategory(null)}
            onAddToCart={handleAddToCart}
          />
        ) : selectedCategory ? (
          <CategoryDetail
            category={selectedCategory}
            products={filteredProducts}
            onBack={() => setSelectedCategory(null)}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <>
            <Hero />

            {/* New Professional Banner Section */}
            <PromoSlider />

            <Categories
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            {/* New Flash Deals Section */}
            <FlashDeals
              products={products}
              onAddToCart={handleAddToCart}
              onViewAllDeals={() => setSelectedCategory('DEALS')}
            />

            {/* New Brand Spotlight */}
            <BrandSpotlight />

            {/* Customer Trust Indicators */}
            <TrustBar />

            {/* Contact Us Section */}
            <ContactUs />

            <Testimonials />
          </>
        )}
      </main>

      <Footer 
        onHomeClick={() => handleHomeNav()}
        onDealsClick={() => {
          setShowCart(false);
          setShowAuth(false);
          setSelectedCategory('DEALS');
        }}
      />

      <BottomNav
        onNavClick={handleHomeNav}
        onDealsClick={() => {
          setShowCart(false);
          setShowAuth(false);
          setSelectedCategory('DEALS');
        }}
      />
    </div>
  );
}

export default App;
