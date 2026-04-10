import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import WishlistComponent from '../../components/profile/wishlist';

const WishlistPage = () => {
    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100 min-h-[500px]"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                                <Heart size={24} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">My Wishlist.</h1>
                        </div>
                        
                        <WishlistComponent />
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default WishlistPage;
