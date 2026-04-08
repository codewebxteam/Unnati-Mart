import React from 'react';
import { ArrowRight } from 'lucide-react';
import heroBanner from '../assets/hero_banner.png';

const Hero = () => {
  return (
    <section id="home"
      className="relative mt-8 rounded-3xl overflow-hidden h-[500px] flex items-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroBanner})` }}
    >
      <div className="p-8 md:p-16 max-w-[700px] text-white">
        <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full mb-6 shadow-md">
          100% Organic & Fresh
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Freshness That Powers Your Life
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-[500px]">
          Get premium quality groceries delivered to your doorstep. Healthy choices begin with Unnati Mart.
        </p>
        <a href="#categories" className="inline-flex bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-xl items-center gap-2">
          Shop Now <ArrowRight size={22} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
