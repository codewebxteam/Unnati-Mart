import React from 'react';
import { Truck, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

const TrustBar = () => {
  const points = [
    { icon: Zap, title: '10-Minute Delivery', subtitle: 'From store to door in a flash', color: 'text-amber-500' },
    { icon: ShieldCheck, title: 'Quality Guarantee', subtitle: 'Fresh or your money back', color: 'text-emerald-500' },
    { icon: Truck, title: 'Free Shipping', subtitle: 'On all orders above ₹199', color: 'text-blue-500' },
    { icon: HeartHandshake, title: 'Best Prices', subtitle: 'Direct from local farms', color: 'text-rose-500' },
  ];

  return (
    <div className="py-20 border-t border-gray-100 mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {points.map((point, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className={`p-6 rounded-[2.5rem] bg-gray-50 mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-charcoal/5 ${point.color}`}>
              <point.icon size={32} className="stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-charcoal mb-2">{point.title}</h3>
            <p className="text-sm font-bold text-gray-400 max-w-[200px]">{point.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
