import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowRight, PlayCircle, Plus, Sparkles, Globe, X, CheckCircle2 } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

// Import Legacy Images
import legacy1 from '../../../assets/foundation/legacy/grand_opening.webp';
import legacy2 from '../../../assets/foundation/hero_fresh_new.webp';
import legacy3 from '../../../assets/foundation/hero_lifestyle.webp';
import legacy4 from '../../../assets/foundation/hero_storefront.webp';

const LEGACY_MAP = {
  'legacy1': legacy1,
  'legacy2': legacy2,
  'legacy3': legacy3,
  'legacy4': legacy4,
};

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Admin WhatsApp details
  const ADMIN_PHONE = "919060982706";

  const [legacyStories, setLegacyStories] = useState([
    { title: "The Grand Launch", category: "Big Celebration", img: 'legacy1' },
    { title: "Supply Chain Growth", category: "Expansion", img: 'legacy2' },
    { title: "Direct Produce Impact", category: "Community", img: 'legacy3' },
    { title: "The Modern Mart Vision", category: "Sustainable", img: 'legacy4' },
  ]);

  const [foundationEvents, setFoundationEvents] = useState([
    {
      title: "Unnati Mart Grand Opening",
      date: "04",
      month: "june",
      location: "bihata Main Market Hub",
      spots: "Public Access",
      type: "Grand Launch",
      theme: "from-amber-500 to-orange-600",
      accent: "text-amber-500"
    },
    {
      title: "Organic Living Workshop",
      date: "22",
      month: "july",
      location: "Unnati Experience Center",
      spots: "30 Slots Open",
      type: "Lifestyle Event",
      theme: "from-teal-500 to-emerald-600",
      accent: "text-teal-500"
    }
  ]);

  // Sync with RTDB
  useEffect(() => {
    const eventsRef = ref(db, 'settings/events');
    const legacyRef = ref(db, 'settings/legacy');

    const unsubEvents = onValue(eventsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setFoundationEvents(Object.values(data));
      }
    });

    const unsubLegacy = onValue(legacyRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setLegacyStories(Object.values(data));
      }
    });

    return () => {
      unsubEvents();
      unsubLegacy();
    };
  }, []);

  // WhatsApp Redirection Handler for Particular Events
  const handleEventJoinWhatsApp = (eventTitle) => {
    const message = `नमस्ते उन्नति मार्ट टीम, मैं आपके इस इवेंट "${eventTitle}" में आना चाहता हूँ। अगर आप मुझे इसकी लोकेशन और बाकी जरूरी डिटेल्स दे सकें, तो मेरे लिए चीजें आसान हो जाएंगी। धन्यवाद!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // WhatsApp Redirection Handler for General Foundation Join
  const handleGeneralJoinWhatsApp = () => {
    const message = `नमस्ते उन्नति मार्ट टीम, मैं आपके फाउंडेशन इकोसिстом और सस्टेनेबिलिटी ड्राइव्स का हिस्सा बनना चाहता हूँ। कृपया मुझे इससे जुड़ने की आगे की प्रक्रिया और डिटेल्स साझा करें। धन्यवाद!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="w-full bg-slate-50/50 py-16 lg:py-24 overflow-hidden relative border-t border-slate-100">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/30 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Foundation Header */}
        <div className="max-w-4xl mb-12 lg:mb-20">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-slate-900 text-white rounded-xl shadow-md shadow-slate-900/10">
              <Globe size={16} className="animate-spin-slow" />
            </div>
            <span className="text-[11px] font-black tracking-[0.35em] text-slate-500 uppercase">
              Foundation Ecosystem
            </span>
          </div>
          
          <h3 className="text-5xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6 uppercase">
            Beyond the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 italic lowercase font-serif pr-2">
              aisle.
            </span>
          </h3>
          
          <p className="text-base text-slate-600 font-medium max-w-xl leading-relaxed">
            Unnati Mart sirf ek grocery store nahi hai. Hum community aur sustainability mein believe karte hain. 
            Hamare events aapko shuddhata aur behtar lifestyle se jodte hain.
          </p>

          {/* Premium Tab Switcher */}
          <div className="mt-10 inline-flex p-1.5 bg-white border border-slate-200/80 shadow-sm rounded-2xl relative z-10">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 sm:px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === 'upcoming' 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Upcoming Chapters
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 sm:px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === 'past' 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              The Legacy
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'upcoming' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {foundationEvents.map((event, i) => (
              <div 
                key={i} 
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-slate-200/80 hover:shadow-xl hover:shadow-slate-200/40 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle Hover Glow Line */}
                <div className={`absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r ${event.theme || 'from-amber-500 to-orange-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="flex flex-col gap-10">
                  {/* Top Row: Date Badge & Meta Info */}
                  <div className="flex justify-between items-start gap-4">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${event.theme || 'from-amber-500 to-orange-600'} flex flex-col items-center justify-center text-white shadow-xl shadow-slate-900/5 group-hover:scale-105 transition-transform duration-500`}>
                      <span className="text-2xl sm:text-3xl font-black tracking-tight">{event.date}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-90">{event.month}</span>
                    </div>
                    
                    <div className="text-right max-w-[65%]">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${event.accent || 'text-amber-500'} bg-slate-50 border border-slate-100 px-3 py-1 rounded-full inline-block mb-3`}>
                        {event.type}
                      </span>
                      <p className="text-xs font-semibold text-slate-500 flex items-center justify-end gap-1.5 break-words">
                        <MapPin size={13} className="text-slate-400 shrink-0" /> 
                        <span className="line-clamp-2">{event.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Mid Row: Title & Text */}
                  <div>
                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3 group-hover:text-amber-600 transition-colors duration-300">
                      {event.title}
                    </h4>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                      Join the core team to understand our vision for 2026 and how we are scaling purity. Experience pure living firsthand.
                    </p>
                  </div>
                </div>

                {/* Bottom Row: CTA Button & Additional Info */}
                <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => handleEventJoinWhatsApp(event.title)}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]"
                  >
                    Join Event <Plus size={14} className="stroke-[3]" />
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {event.spots || "Slots Open"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {legacyStories.map((story, i) => (
              <div 
                key={i} 
                className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-200/60 shadow-md cursor-pointer"
              >
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 sm:opacity-60 group-hover:opacity-90 transition-all duration-500 z-10" />
                
                {/* Content Container (Persistent on mobile, shifts up seamlessly on desktop) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 transform translate-y-0 sm:translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-100 sm:opacity-0 group-hover:opacity-100">
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1.5">
                    {story.category}
                  </p>
                  <h5 className="text-white font-black text-lg sm:text-xl leading-snug tracking-tight">
                    {story.title}
                  </h5>
                  <div className="mt-4 flex items-center gap-2 text-white/70 group-hover:text-white transition-colors duration-300 text-[10px] font-bold uppercase tracking-wider">
                    <PlayCircle size={28} strokeWidth={1.5} className="text-amber-400" />
                    <span>Watch Story</span>
                  </div>
                </div>

                {/* Legacy Media Image Asset */}
                <img
                  src={LEGACY_MAP[story.img] || (typeof story.img === 'string' ? story.img.replace('.png', '.webp') : story.img) || legacy1}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
        )}

        {/* Foundation Hero CTA Banner */}
        <div className="mt-16 lg:mt-24 p-8 sm:p-12 lg:p-16 rounded-[3rem] bg-[#0F172A] relative overflow-hidden shadow-2xl shadow-slate-900/30 group">
          {/* Neon Radial Gradient Effect */}
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-125" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="text-center lg:text-left max-w-2xl">
              <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4">
                Grow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 italic font-serif lowercase">Unnati.</span>
              </h4>
              <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
                Kya aap hamare farm tours ya sustainability drives ka hissa banna chahte hain? Humse judiye aur badlaav ka hissa baniye.
              </p>
            </div>
            
            <button
              onClick={handleGeneralJoinWhatsApp}
              className="w-full sm:w-auto shrink-0 px-8 py-5 bg-white text-slate-900 font-serif rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-white transition-all duration-300 shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
            >
              Join Unnati Mart 
              <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Abstract Matrix Minimalist Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

      </div>
    </section>
  );
};

export default Events;