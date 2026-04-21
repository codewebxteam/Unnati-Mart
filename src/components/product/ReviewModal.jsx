import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Sparkles } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, push, set } from 'firebase/database';

const ReviewModal = ({ product, user, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        if (!comment.trim()) return;
        setIsSubmitting(true);
        try {
            const reviewsRef = ref(db, `reviews/${product.id}`);
            const newReviewRef = push(reviewsRef);
            await set(newReviewRef, {
                userId: user.id,
                userName: user.name,
                rating,
                comment,
                date: new Date().toISOString(),
                productName: product.name
            });
            onReviewSubmitted();
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-white/50"
            >
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 leading-none mb-1">Rate Product</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your feedback matters</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-3xl">
                        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 p-1 shrink-0 overflow-hidden">
                            <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{product.name}</p>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">How was your experience?</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onMouseEnter={() => setHoveredRating(num)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(num)}
                                    className="p-1 transition-transform active:scale-90"
                                >
                                    <Star
                                        size={36}
                                        fill={(hoveredRating || rating) >= num ? "#d97706" : "transparent"}
                                        className={(hoveredRating || rating) >= num ? "text-amber-600" : "text-slate-200"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Write your review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you liked or what could be better..."
                            rows={4}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !comment.trim()}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all ${
                            isSubmitting || !comment.trim() 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-[#111827] text-white hover:bg-amber-600 shadow-xl shadow-slate-200'
                        }`}
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Submit Review <Send size={16} /></>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ReviewModal;
