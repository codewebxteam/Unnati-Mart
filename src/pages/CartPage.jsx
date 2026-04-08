import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';

const CartPage = ({ cartItems, onUpdateQuantity, onRemove, onClose }) => {
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseInt(item.price.replace('₹', ''));
    return acc + (price * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-500">
        <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
           <ShoppingBag size={80} className="text-emerald-500 opacity-20" />
           <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag size={60} className="text-emerald-600" />
           </div>
        </div>
        <h3 className="text-3xl font-black text-charcoal mb-3">Your cart is empty</h3>
        <p className="text-gray-500 font-medium mb-10 max-w-xs text-center">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={onClose}
          className="bg-primary text-white font-black px-10 py-4 rounded-full hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase tracking-widest text-sm"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onClose}
          className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-4xl font-black text-charcoal tracking-tight">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all">
              <div className="w-32 h-32 bg-gray-50 rounded-[1.8rem] overflow-hidden flex items-center justify-center p-4 border border-gray-50">
                <img src={item.img} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
              </div>
              
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{item.category}</span>
                <h3 className="text-xl font-black text-charcoal mb-2">{item.name}</h3>
                <p className="text-gray-400 font-bold text-sm mb-4">Unit Price: {item.price}</p>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-primary transition-all active:scale-90"
                    >
                      <Minus size={18} className="stroke-[3]" />
                    </button>
                    <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-primary transition-all active:scale-90"
                    >
                      <Plus size={18} className="stroke-[3]" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-rose-400 hover:text-rose-600 font-bold flex items-center gap-1.5 transition-colors group/del"
                  >
                    <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                    <span className="hidden md:inline uppercase tracking-widest text-[10px] font-black">Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-center md:text-right px-4">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">Subtotal</p>
                <p className="text-2xl font-black text-charcoal">₹{parseInt(item.price.replace('₹', '')) * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-charcoal text-white rounded-[3rem] p-8 sticky top-28 shadow-2xl relative overflow-hidden">
             {/* Decorative background element */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
             
             <h2 className="text-2xl font-black mb-8 border-b border-white/10 pb-4 relative z-10">Order Summary</h2>
             
             <div className="space-y-4 mb-8 relative z-10 text-white/70 font-medium">
               <div className="flex justify-between">
                 <span>Subtotal</span>
                 <span className="text-white font-black">₹{subtotal}</span>
               </div>
               <div className="flex justify-between">
                 <span>Tax (GST 5%)</span>
                 <span className="text-white font-black">₹{tax}</span>
               </div>
               <div className="flex justify-between">
                 <span>Delivery Fee</span>
                 <span className="text-white font-black">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
               </div>
             </div>

             <div className="border-t border-white/10 pt-6 mb-10 relative z-10">
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Grand Total</p>
                   <p className="text-4xl font-black">₹{total}</p>
                 </div>
                 <div className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-tighter">Saving ₹120</span>
                 </div>
               </div>
             </div>

             <div className="space-y-4 relative z-10">
               <button className="w-full bg-primary text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:shadow-[0_15px_40px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] group">
                 <CreditCard size={22} className="group-hover:rotate-12 transition-transform" />
                 CHECKOUT NOW
               </button>
               
               <p className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-primary" />
                 Secure 256-bit SSL encrypted payment
               </p>
             </div>
          </div>
          
          <div className="mt-6 bg-white border border-gray-100 rounded-[2rem] p-6 text-center">
             <p className="text-gray-400 text-sm font-medium">Free delivery over ₹500</p>
             <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
                ></div>
             </div>
             {subtotal < 500 && (
               <p className="mt-3 text-xs font-bold text-primary italic">Add ₹{500 - subtotal} more for FREE delivery!</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
