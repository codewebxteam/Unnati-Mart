import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, CheckCircle2, Award, Users, ThumbsUp } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Aryan Sharma",
      role: "Regular Customer",
      msg: "Unnati Mart se groceries mangwana mere liye best decision tha. Har piece fresh aur premium quality ka hota hai. Unka delivery system bhi bahut fast hai.",
      tag: "Verified Shopper",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400\u0026h=400\u0026fit=crop",
      accent: "from-amber-500 to-orange-600",
      delay: 0.1
    },
    {
      name: "Sneha Gupta",
      role: "Home Maker",
      msg: "Market mein bahut milawat hai, par Unnati Mart ki quality par mujhe 100% bharosa hai. Fresh vegetables aur fruits hamesha top-notch hote hain. Best store in town!",
      tag: "Quality Enthusiast",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400\u0026h=400\u0026fit=crop",
      accent: "from-amber-400 to-amber-600",
      delay: 0.2
    },
    {
      name: "Vikram Singh",
      role: "Professional Chef",
      msg: "As a chef, I only trust the best ingredients. Unnati Mart's selection of organic spices and fresh produce is consistently excellent. Highly recommended for food lovers.",
      tag: "Verified Buyer",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400\u0026h=400\u0026fit=crop",
      accent: "from-amber-500 to-orange-500",
      delay: 0.3
    }
  ];

  const stats = [
    { label: "Happy Customers", value: "10k+", icon: <Users size={20} /> },
    { label: "Positive Reviews", value: "4.9/5", icon: <Star size={20} className="text-amber-500" /> },
    { label: "Quality Checks", value: "100%", icon: <Award size={20} /> },
    { label: "Fast Returns", value: "Easy", icon: <ThumbsUp size={20} /> }
  ];

  return (
    <section id="testimonials" className="w-full bg-slate-50 py-16 lg:py-24 overflow-hidden relative border-t border-slate-100">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-amber-700 font-black uppercase tracking-[0.3em] text-[9px]">Voice of the People</span>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6"
          >
            Trusted by thousands of <span className="text-amber-600 italic">Happy Families.</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Discover why Unnati Mart is the preferred choice for premium groceries and household essentials across the city.
          </motion.p>
        </div>

        {/* Social Proof Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20 bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl shadow-slate-200/50">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
            >
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mb-2">
                {stat.icon}
              </div>
              <h5 className="text-xl font-black text-slate-900">{stat.value}</h5>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: rev.delay }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative h-full flex flex-col bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.1)] overflow-hidden">

                {/* Decorative Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${rev.accent}`} />

                {/* Top Quote Icon */}
                <div className="absolute top-8 right-8 text-slate-100 group-hover:text-amber-50 transition-colors duration-500">
                  <Quote size={64} fill="currentColor" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="text-amber-500" />
                  ))}
                </div>

                {/* Review Message */}
                <div className="flex-1 relative z-10">
                  <h4 className="text-lg font-bold text-slate-800 leading-relaxed mb-10 italic">
                    "{rev.msg}"
                  </h4>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 border-t border-slate-50 pt-8 mt-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-slate-200">
                      <img src={rev.img} alt={rev.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-lg border-2 border-white shadow-sm scale-75">
                      <CheckCircle2 size={12} fill="white" className="text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                      {rev.name}
                    </h5>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rev.role}</p>
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mt-0.5">{rev.tag}</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-8 py-4 bg-slate-900 text-white rounded-[2rem] shadow-2xl">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="mini avatar" className="w-full h-full object-cover opacity-60" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-amber-600 flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest">
              Join <span className="text-amber-400">10,000+</span> satisfied customers today!
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-slate-800 to-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-600/20">
              Order Now
            </button>
          </div>
        </motion.div>


      </div>
    </section>
  );
};

export default Testimonials;


