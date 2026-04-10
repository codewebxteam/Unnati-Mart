import React from 'react';

const Gallery = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
      </div>
      <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Farm Gallery</h1>
      <p className="text-slate-500 max-w-lg mb-8">
        We are currently curating our best snapshots of the Unnati Mart farm. Check back soon for beautiful pictures of our farm-fresh processes and high-quality inventories!
      </p>
    </div>
  );
};

export default Gallery;
