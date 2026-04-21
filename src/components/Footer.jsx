import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Facebook, ShieldCheck } from 'lucide-react';
import LegalModal from './common/LegalModal';

const Footer = () => {
  const navigate = useNavigate();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('terms');

  const openLegalModal = (type) => {
    setLegalModalType(type);
    setIsLegalModalOpen(true);
  };

  const WhatsappIcon = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );

  const YoutubeIcon = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );

  return (
    <footer className="relative bg-slate-100/80 backdrop-blur-3xl text-slate-900 pt-[70px] pb-[40px] px-8 font-sans border-t-2 border-slate-200 flex justify-center w-full">
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[60px] mb-12 w-full">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <h3
              className="text-3xl font-black tracking-tighter cursor-pointer select-none text-slate-900 uppercase italic"
              onClick={() => navigate('/')}
            >
              Unnati<br /><span className="text-amber-600">Mart.</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider opacity-80">
              Redefining purity in the modern age. Fresh farm produce optimized for your doorstep.
            </p>
            <div className="flex gap-4 mt-4">
              {[
                { icon: <Instagram size={18} />, href: "https://www.instagram.com/unnatimart/", hoverBg: "hover:bg-[#E4405F]", hoverText: "hover:text-white" },
                { icon: <Facebook size={18} fill="currentColor" />, href: "https://facebook.com", hoverBg: "hover:bg-[#1877F2]", hoverText: "hover:text-white" },
                { icon: <WhatsappIcon size={18} />, href: "https://wa.me/919569603163", hoverBg: "hover:bg-[#25D366]", hoverText: "hover:text-white" },
                { icon: <YoutubeIcon size={20} />, href: "https://youtube.com", hoverBg: "hover:bg-[#FF0000]", hoverText: "hover:text-white" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-white text-slate-600 flex items-center justify-center hover:scale-110 transition-all duration-500 ${social.hoverBg} ${social.hoverText}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 flex flex-col gap-6 md:pl-12">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Systems</h4>
            {['Home', 'Categories', 'Deals', 'Orders', 'Admin Login'].map((item) => {
              let route = `/${item.toLowerCase().replace(' ', '-')}`;
              if (item === 'Home') route = '/';
              if (item === 'Admin Login') route = '/admin';

              return (
                <button
                  key={item}
                  onClick={() => navigate(route)}
                  className="text-[12px] font-black text-slate-600 uppercase tracking-widest hover:text-amber-500 hover:pl-2 transition-all duration-300 text-left w-fit"
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Help */}
          <div className="col-span-1 flex flex-col gap-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Support</h4>
            {['Payments', 'Shipping', 'Returns', 'FAQ'].map((item) => {
              const typeMap = {
                'Payments': 'payments',
                'Shipping': 'shipping',
                'Returns': 'cancellation-returns',
                'FAQ': 'faq'
              };
              return (
                <button
                  key={item}
                  onClick={() => openLegalModal(typeMap[item])}
                  className="text-[12px] font-black text-slate-600 uppercase tracking-widest hover:text-amber-500 hover:pl-2 transition-all duration-300 text-left w-fit"
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Contact */}
          <div className="col-span-1 flex flex-col gap-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">DirectLine</h4>
            <div className="text-[12px] text-slate-600 flex flex-col gap-4 font-black uppercase tracking-widest">
              <a href="mailto:support@unnatimart.com" className="hover:text-amber-500 transition-colors">
                support@unnatimart.com
              </a>
              <a href="tel:+919569603163" className="hover:text-amber-500 transition-colors">
                +91 95696 03163
              </a>
              <p className="leading-relaxed opacity-60  hover:text-amber-500 transition-colors">
                Village- Badua, Post- Marhatha, Tehsil- Campairganj, District- Gorakhpur. Pin- 273158 - UP, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Links */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-slate-400 font-black tracking-[0.2em] uppercase">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p>© {new Date().getFullYear()} Unnati Mart Lab. Systems Core v2.</p>
            <p className="text-slate-400 normal-case tracking-normal font-medium">Made with ❤️ by <a href="https://www.codewebx.in" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-black hover:underline">CodeWebX</a></p>
          </div>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms'].map((text, idx) => (
              <button
                key={idx}
                onClick={() => openLegalModal(text.toLowerCase())}
                className="hover:text-slate-900 transition-colors"
              >
                {text}
              </button>
            ))}
            <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">
              <ShieldCheck size={12} />
              <span>TRACED PURITY</span>
            </div>
          </div>
        </div>
      </div>
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        type={legalModalType}
      />
    </footer>
  );
};

export default Footer;
