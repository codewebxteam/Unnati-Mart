import React, { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, BadgePercent, Store, Sprout, Soup, Wheat } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
const vegImg = 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&q=80';
const fruitImg = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80';
const spiceImg = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80';
const grainImg = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80';
import unnatiHero from '../../../assets/foundation/hero_storefront.webp';

const Story = () => {
  const ICON_MAP = {
    'sprout': <Sprout size={22} />,
    'leaf': <Leaf size={22} />,
    'soup': <Soup size={22} />,
    'wheat': <Wheat size={22} />,
  };

  const [features, setFeatures] = useState([
    {
      img: vegImg,
      icon: 'sprout',
      title: "Fresh Harvest",
      desc: "Daily Picked",
      theme: "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100"
    },
    {
      img: fruitImg,
      icon: 'leaf',
      title: "Premium Fruits",
      desc: "Grade A Only",
      theme: "bg-lime-50 border-lime-200 text-lime-700 shadow-lime-100"
    },
    {
      img: spiceImg,
      icon: 'soup',
      title: "Authentic Spices",
      desc: "Pure & Raw",
      theme: "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100"
    },
    {
      img: grainImg,
      icon: 'wheat',
      title: "Quality Grains",
      desc: "Sun Dried",
      theme: "bg-orange-50 border-orange-200 text-orange-700 shadow-orange-100"
    },
  ]);

  useEffect(() => {
    const storyRef = ref(db, 'settings/story/features');
    const unsub = onValue(storyRef, (snap) => {
      if (snap.exists()) setFeatures(Object.values(snap.val()));
    });
    return () => unsub();
  }, []);

  return (
    <section className="relative w-full bg-white py-8 lg:py-12 overflow-hidden">
      <div className="container mx-auto px-6">

        {/* 1. modern panoramic image frame (cropped effect) */}
        <div className="relative w-full h-[220px] lg:h-[380px] rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl mb-10 group">
          <img
            src={unnatiHero}
            alt="The Unnati Mart Store"
            className="w-full h-full object-cover object-[center_35%] transition-transform duration-[2s] group-hover:scale-110"
          />
          {/* subtle dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

          <div className="absolute bottom-6 left-8 lg:bottom-10 lg:left-12 text-white">
            <h2 className="text-[9px] font-black tracking-[0.5em] uppercase text-amber-400 mb-2">Our Promise</h2>
            <h3 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none">
              Uncompromising Quality. <br /> <span className="text-white/60">Every Single Day.</span>
            </h3>
          </div>
        </div>

        {/* 2. story text & multi-color feature grid */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* left: narrative content */}
          <div className="w-full lg:w-[35%]">
            <p className="text-2xl lg:text-4xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-4">
              Modern Mart, <br />
              <span className="text-amber-500">Traditional Purity.</span>
            </p>
            <p className="text-xs lg:text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              Unnati Mart brings you the finest selection of daily essentials. 
              We bridge the gap between quality producers and your kitchen, 
              ensuring every item meets our high standards of freshness and purity.
            </p>
          </div>

          {/* right: multi-color cards with borders */}
          <div className="w-full lg:w-[65%] grid grid-cols-2 gap-4 lg:gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className={`group relative flex flex-col items-center p-6 lg:p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${item.theme}`}
              >
                {/* floating image element */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-20 group-hover:opacity-40 transition-all duration-700 rotate-12 group-hover:rotate-0">
                  <img src={item.img} alt="" className="w-full h-full object-cover rounded-full" />
                </div>

                {/* icon container */}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  {ICON_MAP[item.icon] || <Sprout size={22} />}
                </div>

                {/* text content */}
                <div className="relative z-10 text-center">
                  <h4 className="text-base lg:text-lg font-black tracking-tight leading-tight mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[10px] lg:text-[11px] font-bold uppercase tracking-widest opacity-80 leading-none">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Story;
