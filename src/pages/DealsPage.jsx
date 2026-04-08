import React from 'react';
import { ArrowLeft, ShoppingCart, Heart, Timer, Star } from 'lucide-react';

const DealsPage = ({ products, onBack, onAddToCart }) => {
  // Only show deals related strictly to products that have a deal/discount
  const dealProducts = products.filter(p => p.isDeal || p.discount);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-primary font-bold mb-6 hover:translate-x-1 transition-transform group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
          <div>
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2 w-max">
              <Timer size={16} /> Exclusive Offers
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight">
              Today's Flash Deals
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
              Grab these premium items before the clock runs out! Limited stock available for our best deals across all categories.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Active Deals</p>
                <p className="text-2xl font-black text-charcoal">{dealProducts.length}</p>
             </div>
          </div>
        </div>
      </div>

      {dealProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {dealProducts.map((prod) => (
            <div key={prod.id} className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-3 md:p-6 border border-rose-50 hover:border-rose-200 hover:shadow-[0_15px_40px_rgba(244,63,94,0.06)] transition-all duration-300 flex flex-col group relative">
              <div className="aspect-square bg-white rounded-[1.2rem] md:rounded-[2.5rem] mb-4 overflow-hidden relative flex items-center justify-center p-2 md:p-6 border border-rose-50">
                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] md:text-sm font-black px-2 py-1 rounded-lg z-10 uppercase tracking-widest animate-pulse">
                  Save {prod.discount || '20%'}
                </span>
                <img 
                  src={prod.img} 
                  alt={prod.name} 
                  className="w-[85%] h-[85%] md:w-full md:h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Floating Add Button - Blinkit Style */}
                <button 
                  className="absolute bottom-2 right-2 px-4 py-1.5 bg-white border border-emerald-500 text-emerald-600 text-xs font-black rounded-lg shadow-sm hover:bg-emerald-500 hover:text-white transition-all active:scale-90 z-20 uppercase tracking-tighter"
                  onClick={(e) => { e.stopPropagation(); onAddToCart(prod); }}
                >
                  ADD
                </button>
              </div>
              
              <div className="flex-1 flex flex-col px-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Special Deal</span>
                <h3 className="text-[14px] md:text-xl font-bold text-charcoal mb-2 line-clamp-2 leading-tight h-[2.5rem]">{prod.name}</h3>
                
                <div className="flex items-center gap-1.5 mb-2">
                   <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-gray-500">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      4.8 (250)
                   </div>
                   <span className="text-[9px] text-rose-500 font-black uppercase tracking-tighter italic animate-pulse">FLASH DEAL</span>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50">
                  <span className="text-sm md:text-2xl font-black text-rose-500">{prod.price}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{parseInt(prod.price.slice(1)) + 50}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <h3 className="text-2xl font-bold text-gray-400 mb-2">No active deals right now</h3>
           <p className="text-gray-500">Check back later for exciting offers!</p>
        </div>
      )}
    </div>
  );
};

export default DealsPage;
