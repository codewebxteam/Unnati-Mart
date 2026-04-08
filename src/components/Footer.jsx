import React from 'react';
import { Globe, Share2, MapPin, Phone, Mail } from 'lucide-react';
import logo from '../assets/logo/logo.webp';

const Footer = ({ onHomeClick, onDealsClick }) => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 px-6 md:px-12 border-t border-gray-200 mt-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Unnati Mart" className="w-14 h-14 object-contain" />
            <span className="text-2xl font-bold text-primary">Unnati Mart</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[300px]">
            Bringing the freshest produce from local farms directly to your pantry. Sustainability and nutrition in every bite.
          </p>
          <div className="flex gap-4">
            <button className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md hover:text-primary transition-all group" title="Facebook"><Globe size={20} /></button>
            <button className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md hover:text-primary transition-all group" title="Twitter"><Share2 size={20} /></button>
            <button className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md hover:text-primary transition-all group" title="Instagram"><Share2 size={18} /></button>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-charcoal mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-500 text-sm font-medium">
            <li><a href="#home" onClick={(e) => { if(onHomeClick) onHomeClick(); }} className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="#categories" onClick={(e) => { if(onHomeClick) onHomeClick(); }} className="hover:text-primary transition-colors">Categories</a></li>
            <li><a href="#deals" onClick={(e) => { e.preventDefault(); if(onDealsClick) onDealsClick(); }} className="hover:text-primary transition-colors">Special Deals</a></li>
            <li><a href="#brands" className="hover:text-primary transition-colors">Top Brands</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-charcoal mb-6">Categories</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Vegetables</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Fruits</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Beverages</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Personal Care</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-charcoal mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="flex gap-3 items-center">
              <MapPin size={18} className="text-gray-400" /> 123 Green Ave, Farm City
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={18} className="text-gray-400" /> +91 98765 43210
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={18} className="text-gray-400" /> support@unnatimart.com
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>© 2026 Unnati Mart. All rights reserved. Designed with ❤️ for health.</p>
      </div>
    </footer>
  );
};

export default Footer;
