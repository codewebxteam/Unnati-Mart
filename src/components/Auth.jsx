import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Layout, Globe } from 'lucide-react';

const Auth = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for auth would go here
    console.log('Auth data:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-charcoal/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-[480px] rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-charcoal mb-2">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-500 font-medium">
              {mode === 'login' 
                ? 'Sign in to access your orders and favorites' 
                : 'Join Unnati Mart for fresh groceries at your doorstep'}
            </p>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
              <Globe size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
              <Layout size={18} /> Social Login
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black tracking-widest text-gray-300 uppercase">Or continue with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Forgot Password?</button>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-10 text-sm font-medium text-gray-500">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-black hover:underline underline-offset-4"
            >
              {mode === 'login' ? 'Join Now' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
