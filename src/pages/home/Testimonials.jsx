import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Ananya Sharma",
      location: "Mumbai",
      comment: "Absolutely love the freshness! The 10-minute delivery is a lifesaver when I'm cooking. Best service in the city.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
    },
    {
      id: 2,
      name: "Vikram Mehta",
      location: "Delhi",
      comment: "The organic selection of pulses and dals is outstanding. Super clean and premium quality compared to others.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
    },
    {
      id: 3,
      name: "Sneha Patel",
      location: "Ahmedabad",
      comment: "Ordered some exotic fruits and they were perfectly ripe. Packaging is 100% sustainable too, which I love!",
      rating: 4,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
    }
  ];

  return (
    <section className="py-24 bg-white rounded-[4rem] px-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border-2 border-gray-50/50 my-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="text-center mb-16 relative z-10">
        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest inline-block mb-4">
          Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight">What Our Customers Say</h2>
        <p className="text-gray-500 font-bold text-lg mt-4 max-w-2xl mx-auto italic">
          "Join thousands of happy families who trust Unnati Mart for their daily essentials."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-gray-50/50 rounded-[3rem] p-10 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-500 group"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>

            <div className="relative mb-8">
              <Quote size={40} className="absolute -top-4 -left-4 text-emerald-500/10" />
              <p className="text-gray-700 font-medium leading-relaxed relative z-10">
                {review.comment}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-50 border-2 border-white shadow-sm">
                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-charcoal">{review.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
