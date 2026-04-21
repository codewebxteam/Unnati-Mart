import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, PlayCircle, Plus, Sparkles, Globe, X, CheckCircle2 } from 'lucide-react';
import { realtimeDb as db } from '../../../firebase';
import { ref, push, serverTimestamp } from 'firebase/database';
import useScrollLock from '../../../hooks/useScrollLock';

// Import Legacy Images
import legacy1 from '../../../assets/foundation/legacy/grand_opening.png';
const legacy2 = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80';
const legacy3 = 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80';
import legacy4 from '../../../assets/foundation/unnati_hero.png';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '' });
  const [messageSent, setMessageSent] = useState(false);

  // Register Interest States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({ name: '', email: '', contact: '' });
  const [registerMessageSent, setRegisterMessageSent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  useScrollLock(isModalOpen || isRegisterModalOpen);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const messagesRef = ref(db, 'messages');
      await push(messagesRef, {
        name: formData.name,
        email: formData.email,
        message: `Join Foundation Request. Contact: ${formData.contact}`,
        type: 'foundation_join',
        timestamp: serverTimestamp() || new Date().toISOString(),
        status: 'Unread'
      });
      setMessageSent(true);
      setFormData({ name: '', email: '', contact: '' });
      setTimeout(() => { setIsModalOpen(false); setMessageSent(false); }, 2000);
    } catch (err) {
      console.error("Join submission error:", err);
      alert("Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleRegisterChange = (e) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegisterSubmitting(true);
    try {
      const messagesRef = ref(db, 'messages');
      await push(messagesRef, {
        name: registerFormData.name,
        email: registerFormData.email,
        message: `Register Interest for Upcoming Chapter: "${selectedEvent?.title || 'Unknown Event'}". Contact: ${registerFormData.contact}`,
        type: 'event_registration',
        timestamp: serverTimestamp() || new Date().toISOString(),
        status: 'Unread'
      });
      setRegisterMessageSent(true);
      setRegisterFormData({ name: '', email: '', contact: '' });
      setTimeout(() => { setIsRegisterModalOpen(false); setRegisterMessageSent(false); }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    }
    setIsRegisterSubmitting(false);
  };

  const legacyStories = [
    { title: "The Grand Launch", category: "Big Celebration", img: legacy1 },
    { title: "Supply Chain Growth", category: "Expansion", img: legacy2 },
    { title: "Direct Produce Impact", category: "Community", img: legacy3 },
    { title: "The Modern Mart Vision", category: "Sustainable", img: legacy4 },
  ];

  const foundationEvents = [
    {
      title: "Unnati Mart Grand Opening",
      date: "15",
      month: "APR",
      location: "Main Market Hub",
      spots: "Public Access",
      type: "Grand Launch",
      theme: "from-amber-800 to-amber-950",
      accent: "text-amber-400"
    },
    {
      title: "Organic Living Workshop",
      date: "22",
      month: "MAY",
      location: "Unnati Experience Center",
      spots: "30 Slots Open",
      type: "Lifestyle Event",
      theme: "from-teal-700 to-teal-900",
      accent: "text-teal-400"
    }
  ];

  return (
    <section className="w-full bg-white py-12 lg:py-16 overflow-hidden relative border-t border-slate-50">
      <div className="container mx-auto px-6">

        {/* Foundation Header */}
        <div className="max-w-4xl mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Globe size={16} className="text-slate-900" />
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">Foundation Ecosystem</span>
          </div>
          <h3 className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 uppercase">
            Beyond the <br />
            <span className="text-amber-500 italic lowercase">Aisle.</span>
          </h3>
          <p className="text-sm lg:text-base text-slate-500 font-medium max-w-xl leading-relaxed">
            Unnati Mart sirf ek grocery store nahi hai. Hum community aur sustainability mein believe karte hain. 
            Hamare events aapko shuddhata aur behtar lifestyle se jodte hain.
          </p>

          {/* Minimalist Switcher */}
          <div className="mt-12 inline-flex p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}
            >
              Upcoming Chapters
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}
            >
              The Legacy
            </button>
          </div>
        </div>

        {activeTab === 'upcoming' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {foundationEvents.map((event, i) => (
              <div key={i} className="group relative bg-white border border-slate-100 rounded-[3rem] p-10 lg:p-14 transition-all duration-500 hover:border-slate-300 hover:shadow-2xl">
                <div className="flex flex-col h-full gap-12">
                  <div className="flex justify-between items-start">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${event.theme} flex flex-col items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl font-black">{event.date}</span>
                      <span className="text-[10px] font-bold tracking-widest">{event.month}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${event.accent} mb-2 block`}>{event.type}</span>
                      <p className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1">
                        <MapPin size={12} /> {event.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                      {event.title}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium mb-8 max-w-xs">
                      Join the core team to understand our vision for 2026 and how we are scaling purity.
                    </p>
                    <button 
                      onClick={() => { setSelectedEvent(event); setIsRegisterModalOpen(true); }}
                      className="w-full lg:w-fit px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-600 transition-colors active:scale-95"
                    >
                      Join Event <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {legacyStories.map((story, i) => (
              <div key={i} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent opacity-60 group-hover:opacity-100 transition-all z-10"></div>
                <div className="absolute bottom-8 left-8 right-8 z-20 translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">{story.category}</p>
                  <h5 className="text-white font-black text-xl leading-tight">{story.title}</h5>
                  <PlayCircle className="text-white/50 mt-4 group-hover:text-white transition-colors" size={32} strokeWidth={1} />
                </div>
                <img
                  src={story.img}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        )}

        {/* Foundation CTA */}
        <div className="mt-20 p-10 lg:p-16 rounded-[4rem] bg-[#0F172A] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <h4 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-4 italic">
                Grow with <span className="text-amber-500">Unnati.</span>
              </h4>
              <p className="text-slate-400 text-sm font-medium max-w-md">
                Kya aap hamare farm tours ya sustainability drives ka hissa banna chahte hain? Humse judiye.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 sm:px-12 sm:py-6 bg-white text-slate-900 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-2xl flex items-center gap-3 sm:gap-4"
            >
              Join Unnati Mart <ArrowRight size={18} />
            </button>
          </div>
          {/* Abstract Grid BG */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* Join Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl border border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={18} />
              </button>

              {messageSent ? (
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 animate-bounce">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Request Sent!</h4>
                  <p className="text-xs text-slate-500 font-semibold">We will connect with you shorty. Shukriya!</p>
                </div>
              ) : (
                <>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-2">
                    <Sparkles size={20} className="text-amber-500" /> Join Foundation
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mb-6">Typing your details below to become a part of our ecosystem</p>

                  <form onSubmit={handleJoin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                      <input 
                        name="name" value={formData.name} onChange={handleChange} required
                        placeholder="Aditya Kumar"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange} required
                        placeholder="email@example.com"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Contact Number</label>
                      <input 
                        name="contact" value={formData.contact} onChange={handleChange} required
                        placeholder="+91 9999999999"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                      />
                    </div>

                    <button 
                      type="submit" disabled={isSubmitting}
                      className="w-full py-4 mt-6 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Join Now'} <ArrowRight size={14} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Register Modal Overlay */}
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-md p-8 relative shadow-2xl border border-slate-100 overflow-hidden">
              {/* Top Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-teal-500 to-amber-500"></div>
              
              <button 
                onClick={() => setIsRegisterModalOpen(false)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all z-10"
              >
                <X size={18} />
              </button>

              {registerMessageSent ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 animate-pulse scale-110 shadow-lg shadow-amber-100">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">Registration Done!</h4>
                  <p className="text-xs text-slate-500 font-semibold tracking-wide">Aapka spot reserved hai. Shukriya!</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                      <Sparkles size={12} className="text-amber-500" /> Confirm Seat
                    </span>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedEvent?.title || 'Register Interest'}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                      <Users size={12} /> {selectedEvent?.spots}
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                      <input 
                        name="name" value={registerFormData.name} onChange={handleRegisterChange} required
                        placeholder="Aditya Kumar"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                      <input 
                        type="email" name="email" value={registerFormData.email} onChange={handleRegisterChange} required
                        placeholder="email@example.com"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Contact Number</label>
                      <input 
                        name="contact" value={registerFormData.contact} onChange={handleRegisterChange} required
                        placeholder="+91 9999999999"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                      />
                    </div>

                    <button 
                      type="submit" disabled={isRegisterSubmitting}
                      className="w-full py-4 mt-6 bg-amber-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isRegisterSubmitting ? 'Registering...' : 'Register Now'} <ArrowRight size={14} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Events;
