import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-charcoal">Get in Touch</h2>
        <p className="text-gray-500 font-medium mt-2 max-w-xl mx-auto text-sm">Have questions about your order or our products? We're here to help! Reach out to us and our team will get back to you shortly.</p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Contact Information */}
        <div className="relative z-10 flex flex-col justify-center space-y-8">
          <div>
            <h3 className="text-xl font-black text-charcoal mb-6">Contact Information</h3>
            <div className="space-y-4">
              
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <MapPin size={22} strokeWidth={2.5} />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-bold text-gray-900">Our Store Location</h4>
                  <p className="text-gray-500 mt-0.5 leading-relaxed text-sm">
                    123 Unnati Marg, Green Valley Plaza<br/>
                    New Delhi, India 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <Phone size={22} strokeWidth={2.5} />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-bold text-gray-900">Phone & WhatsApp</h4>
                  <p className="text-gray-500 mt-0.5 leading-relaxed text-sm">
                    +91 98765 43210<br/>
                    <span className="text-xs">Mon-Sat: 9:00 AM - 8:00 PM</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <Mail size={22} strokeWidth={2.5} />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-bold text-gray-900">Email Address</h4>
                  <p className="text-gray-500 mt-0.5 leading-relaxed text-sm">
                    support@unnatimart.in<br/>
                    <span className="text-xs">We reply within 24 hours</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="relative z-10 bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
          <h3 className="text-xl font-black text-charcoal mb-4">Send us a Message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="John Doe" 
                className="w-full bg-white px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="john@example.com" 
                className="w-full bg-white px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="message">Your Message</label>
              <textarea 
                id="message" 
                rows="3"
                placeholder="How can we help you today?" 
                className="w-full bg-white px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none text-sm"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-red-700 text-white font-black text-base py-3 rounded-xl flex items-center justify-center transition-transform active:scale-95 group shadow-lg shadow-primary/20">
              Send Message
              <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;
