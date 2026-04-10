import React from 'react';
import { Microscope, CloudSun, Beaker, Zap, ShieldCheck, ArrowUpRight, Binary, Waves } from 'lucide-react';

const Root = () => {
  return (
    <section className="w-full bg-[#fdfdfd] py-16 lg:py-28 overflow-hidden relative">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6">

        {/* Header: Minimal & Stylish */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6 transition-all hover:bg-white cursor-default group">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">The Root Methodology</span>
          </div>
          <h3 className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.8] mb-6 uppercase">
            Pure <span className="text-amber-500 italic font-light">to</span> Perfect.
          </h3>
          <p className="text-sm lg:text-base text-slate-400 font-medium max-w-lg leading-relaxed">
            Unnati Mart mein shuddhata hamara standard hai. Hum har product ki quality aur purity ko 
            modern benchmarks par test karte hain taaki aapko mile sirf best.
          </p>
        </div>

        {/* The Actionable Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Mushroom: The Bio-Tech Card */}
          <button className="group relative w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] text-left rounded-[3.5rem] p-10 lg:p-14 overflow-hidden transition-all duration-700 hover:-translate-y-3 cursor-pointer bg-slate-900 shadow-2xl shadow-slate-200 border border-slate-800">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-amber-400 border border-white/10 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-4 border-slate-900"></div>
                </div>
                <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/100 transition-colors">
                  Research 01
                </div>
              </div>

              <div>
                <h4 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-4 italic uppercase">
                  Quality <br /> <span className="text-amber-500">Benchmark.</span>
                </h4>
                <p className="text-slate-400 text-xs lg:text-sm font-medium leading-relaxed max-w-xs mb-8">
                  Har product 25+ quality checks se guzarta hai. Hum sirf wahi chunte hain jo hamare health-first standards ko meet kare.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg">100%</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Safety Assured</span>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10"></div>
                  <div className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                    Our Standards <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
            {/* Background Texture Illusion */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>
          </button>

          {/* Dairy: The Tech-Logic Card */}
          <button className="group relative w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] text-left rounded-[3.5rem] p-10 lg:p-14 overflow-hidden transition-all duration-700 hover:-translate-y-3 cursor-pointer bg-amber-600 shadow-2xl shadow-amber-100 border border-amber-500">
            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-amber-600 transition-all duration-500">
                    <Zap size={28} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-4 border-amber-600"></div>
                </div>
                <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest group-hover:text-white/100 transition-colors">
                  Research 02
                </div>
              </div>

              <div>
                <h4 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-4 italic uppercase">
                  Direct <br /> <span className="text-amber-200">Supply.</span>
                </h4>
                <p className="text-amber-100 text-xs lg:text-sm font-medium leading-relaxed max-w-xs mb-8">
                  Seedhe sources se aapke ghar tak. No middleman, no delays. 
                  Technology backed supply chain ensures peak freshness.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg">Fast</span>
                    <span className="text-[8px] text-amber-200 font-bold uppercase tracking-widest">Delivery</span>
                  </div>
                  <div className="h-8 w-[1px] bg-white/20"></div>
                  <div className="text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                    Trace Order <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
            {/* Visual Glass Glow */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/30 transition-all duration-700"></div>
          </button>

        </div>

        {/* Minimal Bottom Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-12 py-8 border-t border-slate-100">
          {['Lab Tested', '100% Traceable', 'Zero Pesticides'].map((text, i) => (
            <div key={i} className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-default">
              <ShieldCheck size={14} className="text-slate-900" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">{text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Root;
