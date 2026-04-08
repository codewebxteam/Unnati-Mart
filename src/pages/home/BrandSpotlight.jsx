import React from 'react';
import freshValleyLogo from '../../assets/brands/fresh_valley.svg';
import amulLogo from '../../assets/brands/amul.svg';
import tataLogo from '../../assets/brands/tata.svg';
import aashirvaadLogo from '../../assets/brands/aashirvaad.svg';
import motherDairyLogo from '../../assets/brands/mother_dairy.svg';
import surfExcelLogo from '../../assets/brands/surf_excel.svg';

const BrandSpotlight = () => {
  const brands = [
    { name: 'Fresh Valley', img: freshValleyLogo, theme: 'bg-green-50/50', border: 'border-green-100', color: 'text-green-600' },
    { name: 'Amul', img: amulLogo, theme: 'bg-blue-50/50', border: 'border-blue-100', color: 'text-blue-600' },
    { name: 'Tata Sampann', img: tataLogo, theme: 'bg-orange-50/50', border: 'border-orange-100', color: 'text-orange-600' },
    { name: 'Aashirvaad', img: aashirvaadLogo, theme: 'bg-red-50/50', border: 'border-red-100', color: 'text-red-600' },
    { name: 'Mother Dairy', img: motherDairyLogo, theme: 'bg-emerald-50/50', border: 'border-emerald-100', color: 'text-emerald-600' },
    { name: 'Surf Excel', img: surfExcelLogo, theme: 'bg-blue-50/50', border: 'border-blue-100', color: 'text-blue-600' }
  ];

  return (
    <section id="brands" className="py-20 pb-28">

      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-charcoal">Shop by Brand</h2>
          <p className="text-gray-500 font-bold mt-2">Trusted household names delivered to your door</p>
        </div>
        <button className="text-primary font-black uppercase tracking-widest text-sm translate-x-0 group hover:translate-x-2 transition-transform underline decoration-primary/30 underline-offset-8 decoration-2">Explore All Brands &rarr;</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {brands.map((brand, i) => (
          <div
            key={i}
            className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-4 md:p-8 border-2 border-gray-50 flex flex-col items-center justify-center gap-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all duration-500 group cursor-pointer aspect-square overflow-hidden relative"
          >
            <div className="flex flex-col items-center justify-center h-full w-full relative z-10">
              <img
                src={brand.img}
                alt={brand.name}
                className="max-h-[60%] max-w-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 will-change-transform"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.classList.remove('hidden');
                  e.target.nextSibling.classList.add('flex');
                }}
              />
              {/* Clean Fallback Icon */}
              <div className="hidden absolute inset-0 items-center justify-center pointer-events-none">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black ${brand.color} bg-white shadow-xl`}>
                  {brand.name.charAt(0)}
                </div>
              </div>
              <span className="text-[11px] font-black text-gray-500 mt-6 opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-widest leading-none">{brand.name}</span>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>

            <div className="absolute inset-x-0 bottom-4 text-center">
              <span className="text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 uppercase tracking-[0.3em]">Shop Collection</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandSpotlight;

