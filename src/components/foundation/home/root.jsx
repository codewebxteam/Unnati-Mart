import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../product/ProductCard';
import { dummyProducts } from '../../../data/dummyProducts';
import { ArrowRight } from 'lucide-react';

const Root = () => {
  const navigate = useNavigate();

  const featuredProducts = useMemo(() => {
    const all = [];
    const categories = Object.keys(dummyProducts);

    // Distribute products from categories evenly
    let i = 0;
    while (all.length < 16) {
      const cat = categories[i % categories.length];
      const prodIndex = Math.floor(i / categories.length);
      const product = dummyProducts[cat]?.[prodIndex];

      if (product) {
        all.push(product);
      }

      i++;
      // Safety break if we run out of products (unlikely with this data)
      if (i > 100) break;
    }
    return all;
  }, []);

  return (
    <section className="w-full bg-[#fdfdfd] py-16 lg:py-28 overflow-hidden relative">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6">
        {/* Header Component */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6 transition-all hover:bg-white cursor-default group">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">Featured Collection</span>
          </div>
          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4 uppercase">
            Curated <span className="text-amber-500 italic font-light">for</span> You
          </h3>
          <p className="text-sm lg:text-base text-slate-400 font-medium max-w-lg leading-relaxed">
            Discover a handpicked selection of our finest products across all categories. Uncompromising quality, brought straight to your home.
          </p>
        </div>

        {/* Product Grid - 2x2 for Mobile (4 items), 4x4 for Desktop (16 items) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1 sm:px-0 lg:gap-8 mb-16">
          {featuredProducts.map((product, index) => (
            <div key={product.id || index} className={index >= 4 ? 'hidden md:block' : ''}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              navigate('/categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-slate-900/20 hover:shadow-amber-500/30 hover:-translate-y-1 cursor-pointer"
          >
            Explore More Products
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-amber-500 transition-all">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Root;