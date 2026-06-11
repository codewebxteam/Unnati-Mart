import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for routing redirect
import { motion } from 'framer-motion';
import { Quote, Star, CheckCircle2, Award, Users, ThumbsUp, ShoppingBag } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

// Import local testimonial images
import raviImg from '../../../assets/testimonials/ravi.webp';
import priyaImg from '../../../assets/testimonials/priya.webp';
import amitImg from '../../../assets/testimonials/amit.webp';
import avatarsImg from '../../../assets/testimonials/avatars.webp';

const TESTIMONIAL_IMG_MAP = {
  'ravi': raviImg,
  'priya': priyaImg,
  'amit': amitImg,
  'avatars': avatarsImg
};

const Testimonials = () => {
  const navigate = useNavigate(); // Initialize navigation logic

  const [reviews, setReviews] = useState([
    {
      name: "Ravi Kumar",
      role: "Software Engineer",
      msg: "I was looking for fresh organic produce in Gorakhpur and Unnati Mart delivered exactly what I needed. The quality of fruits is unmatched.",
      tag: "Verified Shopper",
      image: 'ravi', // Match sync naming
      accent: "from-amber-500 to-orange-600",
      delay: 0.1
    },
    {
      name: "Priya Singh",
      role: "Lifestyle Blogger",
      msg: "The variety and freshness at Unnati Mart are incredible. Their delivery is always on time, which is a lifesaver for my busy schedule.",
      tag: "Quality Enthusiast",
      image: 'priya',
      accent: "from-teal-500 to-emerald-600",
      delay: 0.2
    },
    {
      name: "Amit Patel",
      role: "Local Business Owner",
      msg: "Supporting local businesses is important to me, and Unnati Mart makes it easy with their high-quality local produce. Best grocery app I've used.",
      tag: "Verified Buyer",
      image: 'amit',
      accent: "from-orange-500 to-amber-500",
      delay: 0.3
    }
  ]);

  const [stats, setStats] = useState([
    { label: "Happy Customers", value: "10k+", icon: 'users' },
    { label: "Positive Reviews", value: "4.9/5", icon: 'star' },
    { label: "Quality Checks", value: "100%", icon: 'award' },
    { label: "Fast Returns", value: "Easy", icon: 'thumbs-up' }
  ]);

  const ICON_MAP = {
    'users': <Users size={20} className="text-slate-900" />,
    'star': <Star size={20} className="text-amber-500 fill-amber-500" />,
    'award': <Award size={20} className="text-slate-900" />,
    'thumbs-up': <ThumbsUp size={20} className="text-slate-900" />
  };

  useEffect(() => {
    const reviewsRef = ref(db, 'settings/testimonials/reviews');
    const statsRef = ref(db, 'settings/testimonials/stats');

    const unsubReviews = onValue(reviewsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const resolved = Object.values(data).map(r => ({
          ...r,
          image: TESTIMONIAL_IMG_MAP[r.image] || (typeof r.image === 'string' ? r.image.replace('.png', '.webp') : r.image) || raviImg
        }));
        setReviews(resolved);
      }
    });

    const unsubStats = onValue(statsRef, (snap) => {
      if (snap.exists()) setStats(Object.values(snap.val()));
    });

    return () => {
      unsubReviews();
      unsubStats();
    };
  }, []);

  // Handler to smoothly route users to product showcase pipeline
  const handleOrderNowRedirect = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/products');
  };

  return (
    <section id="testimonials" className="w-full bg-slate-50/50 py-20 lg:py-28 overflow-hidden relative border-t border-slate-100">
      {/* Immersive Blur Ambient Glow Backdrops */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[130px] rounded-full pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/20 blur-[130px] rounded-full pointer-events-none -ml-48 -mb-48" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Voice of the People</span>
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight uppercase"
          >
            Trusted by thousands of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 italic font-serif lowercase pr-2">
              happy families.
            </span>
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed"
          >
            Discover why Unnati Mart is the preferred choice for premium groceries and household essentials across the city.
          </motion.p>
        </div>

        {/* Dynamic Social Proof Performance Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20 lg:mb-24 bg-white/60 backdrop-blur-xl rounded-[2rem] p-5 border border-white shadow-xl shadow-slate-200/40 relative z-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl mb-3 shadow-inner">
                {ICON_MAP[stat.icon] || <Star size={20} />}
              </div>
              <h5 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">{stat.value}</h5>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bento Columns Testimonial Grid Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {reviews.map((rev, i) => {
            const mappedImg = TESTIMONIAL_IMG_MAP[rev.image] || rev.img || raviImg;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: rev.delay || 0.1 }}
                whileHover={{ y: -6 }}
                className="group flex"
              >
                <div className="relative w-full flex flex-col bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 transition-all duration-500 shadow-sm hover:border-slate-200/80 hover:shadow-2xl hover:shadow-slate-200/60 overflow-hidden justify-between">
                  
                  {/* Decorative Premium Top Hue Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r ${rev.accent || 'from-amber-500 to-orange-500'}`} />

                  {/* Absolute Quote Asset Block */}
                  <div className="absolute top-10 right-10 text-slate-50/80 group-hover:text-amber-50/50 transition-colors duration-500 pointer-events-none">
                    <Quote size={56} fill="currentColor" strokeWidth={0} />
                  </div>

                  <div>
                    {/* Quality Verification Rating Row */}
                    <div className="flex gap-1 mb-8 bg-slate-50 border border-slate-100 w-fit px-3 py-1.5 rounded-full shadow-inner">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star key={starIndex} size={13} fill="currentColor" className="text-amber-500" />
                      ))}
                    </div>

                    {/* Testimonial Core Content Text */}
                    <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed mb-10 italic relative z-10 pr-2">
                      "{rev.msg}"
                    </p>
                  </div>

                  {/* User Account Profile Subtier footer */}
                  <div className="flex items-center gap-4 border-t border-slate-100/80 pt-6 mt-auto">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-slate-200/80">
                        <img 
                          src={mappedImg} 
                          alt={rev.name} 
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-lg border-2 border-white shadow-sm scale-90">
                        <CheckCircle2 size={11} fill="white" className="text-emerald-500" />
                      </div>
                    </div>
                    
                    <div className="min-w-0">
                      <h5 className="font-black text-slate-900 text-base truncate group-hover:text-amber-600 transition-colors duration-300">
                        {rev.name}
                      </h5>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-0.5">{rev.role}</p>
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md inline-block text-amber-600`}>
                        {rev.tag || "Verified Shopper"}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Conversion Call-to-Action Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 lg:mt-24 text-center relative z-20"
        >
          <div className="inline-flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 px-6 py-5 md:py-4 md:px-8 bg-[#0F172A] text-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 max-w-3xl mx-auto w-full border border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="flex -space-x-3 shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-md">
                  <img src={avatarsImg} alt="customer bundles" className="w-full h-full object-cover" />
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-black shadow-md">
                  +2k
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-left text-slate-200 leading-tight">
                Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-serif lowercase italic text-base px-0.5">10,000+</span> satisfied shoppers!
              </p>
            </div>
            
            <button 
              onClick={handleOrderNowRedirect}
              className="w-full md:w-auto shrink-0 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[11px] font-black uppercase tracking-[0.18em] rounded-2xl transition-all duration-300 hover:brightness-110 active:scale-[0.97] shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group"
            >
              Order Now
              <ShoppingBag size={14} className="stroke-[2.5] transform group-hover:translate-y-[-1px] transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;