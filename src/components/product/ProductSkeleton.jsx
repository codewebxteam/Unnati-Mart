import React from 'react';
import { motion } from 'framer-motion';

const ProductSkeleton = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12 lg:pt-32 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button Skeleton */}
        <div className="w-32 h-4 bg-slate-100 rounded-lg mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Image Skeleton */}
          <div className="space-y-8">
            <div className="aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center overflow-hidden p-12">
              <div className="w-2/3 h-2/3 bg-slate-100 rounded-3xl animate-pulse" />
            </div>
            
            {/* Trust Badges Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-50 rounded-3xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right Side: Details Skeleton */}
          <div className="space-y-10">
            <div className="space-y-4">
              {/* Category & Stars */}
              <div className="flex gap-4">
                <div className="w-20 h-6 bg-slate-100 rounded-full animate-pulse" />
                <div className="w-32 h-6 bg-slate-50 rounded-full animate-pulse" />
              </div>
              
              {/* Title */}
              <div className="h-16 lg:h-24 bg-slate-100 rounded-3xl w-full animate-pulse" />
              <div className="h-16 lg:h-24 bg-slate-100 rounded-3xl w-2/3 animate-pulse" />

              {/* Price */}
              <div className="flex gap-4 items-baseline pt-4">
                <div className="w-32 h-12 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="w-20 h-8 bg-slate-50 rounded-xl animate-pulse" />
              </div>

              {/* Description */}
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Controls Skeleton */}
            <div className="space-y-6 max-w-md">
              <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
                <div className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="h-16 flex-1 bg-slate-100 rounded-[2rem] animate-pulse" />
                <div className="h-16 flex-1 bg-slate-900/10 rounded-[2rem] animate-pulse" />
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="pt-8">
              <div className="flex gap-8 border-b border-slate-100 mb-8 pb-4">
                <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
                <div className="w-24 h-4 bg-slate-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-slate-50 rounded animate-pulse" />
              </div>
              <div className="h-32 bg-slate-50 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
