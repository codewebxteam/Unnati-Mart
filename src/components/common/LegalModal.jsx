import React from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollLock from '../../hooks/useScrollLock';

const LegalModal = ({ isOpen, onClose, type }) => {

  const contentMap = {
    'privacy': {
      icon: <Shield className="text-amber-500 w-8 h-8" />,
      title: 'Privacy Policy',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Information We Collect', text: 'At Unnati Mart, we collect personal information such as your name, email address, shipping address, and phone number when you place an order for our farm products or subscribe to our newsletter.' },
        { heading: '2. How We Use Your Information', text: 'We use your data strictly to process your orders, schedule deliveries for fresh products, and send you important updates regarding your purchases.' },
        { heading: '3. Data Security', text: 'Your privacy is as important to us as the purity of our products. We implement industry-standard security measures to ensure your personal information is protected against unauthorized access.' },
        { heading: '4. Sharing of Information', text: 'We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification internally.' }
      ]
    },
    'terms': {
      icon: <FileText className="text-amber-500 w-8 h-8" />,
      title: 'Terms & Conditions',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Product Quality & Delivery', text: 'Unnati Mart guarantees the delivery of fresh, natural farm products. Customers must ensure someone is available to receive the delivery during the chosen time slot to maintain product freshness.' },
        { heading: '2. Cancellations & Refunds', text: 'Orders for fresh produce can only be cancelled up to 12 hours before the scheduled delivery time. Refunds for quality issues must be reported within 6 hours of delivery with photographic evidence.' },
        { heading: '3. Pricing Changes', text: 'Our prices are subject to change based on seasonal availability and farming costs without prior notice. However, once an order is confirmed, the price will be honored.' },
        { heading: '4. User Responsibilities', text: 'By using our website, you agree to provide accurate and current information for all purchases. You are responsible for maintaining the confidentiality of your account and password.' }
      ]
    },
    'payments': {
      icon: <FileText className="text-amber-500 w-8 h-8" />,
      title: 'Payments',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Accepted Payment Methods', text: 'We accept a variety of payment methods including Major Credit/Debit cards, UPI (GPay, PhonePe, Paytm), NetBanking, and Cash on Delivery (COD) for eligible pincodes.' },
        { heading: '2. Payment Security', text: 'All online transactions are secured with industry-leading encryption and 3D Secure authentication. We do not store your credit card details.' },
        { heading: '3. Failed Transactions', text: 'If your account is debited but the order is not confirmed, the amount will be automatically refunded to your original payment method within 3-5 business days.' }
      ]
    },
    'shipping': {
      icon: <FileText className="text-amber-500 w-8 h-8" />,
      title: 'Shipping & Delivery',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Farm Fresh Promise', text: 'To ensure maximum freshness, our delivery team brings products directly from the farm to your doorstep in quality packaging.' },
        { heading: '2. Delivery Time Slots', text: 'We offer convenient morning (6 AM - 9 AM) and evening (4 PM - 7 PM) slots depending on your location.' },
        { heading: '3. Delivery Charges', text: 'Delivery is free for orders above the threshold specified in your zip code. For smaller orders, a flat delivery fee applies.' }
      ]
    },
    'cancellation-returns': {
      icon: <FileText className="text-amber-500 w-8 h-8" />,
      title: 'Cancellation & Returns',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Cancellation Policy', text: 'You can cancel your order up until 12 hours before your scheduled delivery slot through your profile dashboard or by contacting support.' },
        { heading: '2. Returns & Replacements', text: 'Due to the perishable nature of our products, we do not accept standard returns. However, if a product is damaged or spoiled upon arrival, we will issue a full replacement or refund.' },
        { heading: '3. Refund Turnaround', text: 'Approved refunds are credited to your original payment method within 5-7 business days, or instantly if deposited as store credit.' }
      ]
    },
    'faq': {
      icon: <FileText className="text-amber-500 w-8 h-8" />,
      title: 'Frequently Asked Questions (FAQ)',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: 'Are your products organic?', text: 'Yes, our products are grown using natural methods and our groceries are sourced from vetted local farms ensuring the highest quality.' },
        { heading: 'How do I track my order?', text: 'You can track the status of your order directly from the My Orders section in your profile.' },
        { heading: 'Can I change my delivery address?', text: 'Address changes are permitted up to 12 hours prior to the delivery slot. Contact support for emergency reroutes.' }
      ]
    },
    'security': {
      icon: <Shield className="text-amber-500 w-8 h-8" />,
      title: 'Security',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Safe Shopping', text: 'We utilize 256-bit SSL encryption to protect your data during checkout and account registration.' },
        { heading: '2. Fraud Prevention', text: 'Our systems continuously monitor for suspicious activity to protect your account from unauthorized access.' }
      ]
    },
    'sitemap': {
      icon: <FileText className="text-amber-500 w-8 h-8" />,
      title: 'Sitemap',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: 'Navigation', text: 'Home | Products | About Us | Gallery | Contact | Profile | Orders | Cart' }
      ]
    },
    'grievance-redressal': {
      icon: <Shield className="text-amber-500 w-8 h-8" />,
      title: 'Grievance Redressal',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Grievance Officer', text: 'In accordance with consumer protection rules, our Grievance Officer can be reached at grievance@unnatimart.com.' },
        { heading: '2. Resolution Timeline', text: 'We acknowledge complaints within 24 hours and aim to resolve them within 15 days of receipt.' }
      ]
    },
    'epr-compliance': {
      icon: <Shield className="text-amber-500 w-8 h-8" />,
      title: 'EPR Compliance',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: 'Extended Producer Responsibility', text: 'Unnati Mart is committed to environmental sustainability. We comply with EPR framing regarding plastic waste management and encourage returning packaging for reuse.' }
      ]
    },
    'fssai': {
      icon: <Shield className="text-amber-500 w-8 h-8" />,
      title: 'FSSAI Compliance',
      lastUpdated: 'March 10, 2026',
      sections: [
        { heading: '1. Food Safety Standards', text: 'We are fully registered and compliant with the Food Safety and Standards Authority of India (FSSAI). Our premises undergo regular health inspections.' },
        { heading: '2. Food Safety Connect App', text: 'Consumers can verify our licensing and register food queries using the official FSSAI Food Safety Connect App.' }
      ]
    }
  };

  const content = contentMap[type] || contentMap['terms-of-use'] || contentMap['terms'];

  useScrollLock(isOpen);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 relative z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                {content.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{content.title}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Last Updated: {content.lastUpdated}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all shadow-sm"
            >
              <X size={20} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative bg-white">
            <div className="space-y-8 pr-2">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Please read these {content.title.toLowerCase()} carefully before using the Unnati Mart platform.
                  Your continued use of our services constitutes acceptance of these terms.
                </p>
                
                <div className="space-y-6">
                  {content.sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 hover:bg-amber-50/30 hover:border-amber-100 transition-colors">
                      <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                        {section.heading}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 shrink-0">
             <div className="flex items-center gap-2">
                <Shield size={16} className="text-amber-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-amber-600/70">Purity Guaranteed</span>
             </div>
             <button
               onClick={onClose}
               className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-200 transition-all active:scale-95"
             >
               I Understand
             </button>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LegalModal;

