import React from 'react';

const PromoSlider = () => {
  const slides = [
    { id: 1, title: 'Fresh Mango Festival', subtitle: 'Sweetest Alphonso at Best Price', theme: 'bg-amber-100 from-amber-50 to-amber-100', accent: 'text-amber-600', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Weekend Grocery Bash', subtitle: 'Flat 20% Off on ALL Staples', theme: 'bg-emerald-100 from-green-50 to-emerald-100', accent: 'text-emerald-600', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: '10-Min Delivery', subtitle: 'Get your groceries in a blink', theme: 'bg-rose-100 from-rose-50 to-rose-100', accent: 'text-rose-600', img: 'https://images.unsplash.com/photo-1586864387917-f575a629dbe0?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="py-10">
      <div className="flex gap-6 overflow-x-auto snap-x no-scrollbar pb-4 -mx-6 px-6">
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className={`min-w-[85vw] md:min-w-[45%] snap-center rounded-[3rem] p-10 h-[300px] bg-gradient-to-br ${slide.theme} flex items-center justify-between overflow-hidden relative group`}
          >
            <div className="relative z-10 max-w-[60%] animate-in fade-in slide-in-from-left-6 duration-700">
              <span className={`text-[12px] font-black uppercase tracking-[0.3em] mb-4 block ${slide.accent}`}>Special Offer</span>
              <h2 className="text-4xl font-black text-charcoal mb-4 leading-tight">{slide.title}</h2>
              <p className="text-gray-600 font-bold text-lg mb-8">{slide.subtitle}</p>
              <button className={`px-10 py-5 rounded-2xl bg-white text-charcoal font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all shadow-${slide.accent.split('-')[1]}/10`}>
                Shop Now
              </button>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-[45%] flex items-center justify-center overflow-hidden">
                <img 
                  src={slide.img} 
                  alt={slide.title} 
                  className="w-full h-full object-contain mix-blend-multiply contrast-[1.2] brightness-[1.05] transition-transform duration-[2s] group-hover:scale-110"
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;
