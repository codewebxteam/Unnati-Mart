import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Sparkles, Camera, ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { realtimeDb as db, storage } from '../../firebase';
import { ref, push, set } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const ReviewModal = ({ product, user, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]); // Array of File objects
    const [imagePreviews, setImagePreviews] = useState([]); // Array of base64 strings
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedImages.length + files.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size 5MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
                setSelectedImages(prev => [...prev, file]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (reviewId) => {
        const imageUrls = [];
        for (const file of selectedImages) {
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = sRef(storage, `reviews/${product.id}/${reviewId}/${fileName}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            imageUrls.push(url);
        }
        return imageUrls;
    };

    const handleSubmit = async () => {
        if (!comment.trim()) return;
        setIsSubmitting(true);
        try {
            const reviewsRef = ref(db, `reviews/${product.id}`);
            const newReviewRef = push(reviewsRef);
            const reviewId = newReviewRef.key;

            let imageUrls = [];
            if (selectedImages.length > 0) {
                imageUrls = await uploadImages(reviewId);
            }

            await set(newReviewRef, {
                userId: user.id,
                userName: user.name,
                userPhoto: user.photo || '',
                rating,
                comment,
                images: imageUrls,
                date: new Date().toISOString(),
                productName: product.name,
                productId: product.id
            });

            onReviewSubmitted();
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
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
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-none mb-1">Rate Product</h3>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Share your experience</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    {/* Product Summary */}
                    <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 p-1 shrink-0 overflow-hidden">
                            <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{product.name}</p>
                    </div>

                    {/* Star Rating */}
                    <div className="text-center mb-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quality Rating</p>
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
                                        size={32}
                                        fill={(hoveredRating || rating) >= num ? "#f59e0b" : "transparent"}
                                        className={(hoveredRating || rating) >= num ? "text-amber-500 fill-amber-500" : "text-slate-200"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Review */}
                    <div className="space-y-2 mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Review Comments</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was the product quality and delivery? (Optional)"
                            rows={3}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none shadow-sm placeholder:text-slate-300"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Photos</label>
                            <span className="text-[9px] font-bold text-slate-300">{selectedImages.length}/5 photos</span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                            <AnimatePresence>
                                {imagePreviews.map((preview, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group"
                                    >
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {selectedImages.length < 5 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50/30 transition-all group"
                                >
                                    <ImagePlus size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Add Photo</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !comment.trim()}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all ${
                            isSubmitting || !comment.trim() 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-[#111827] text-white hover:bg-amber-600 shadow-xl shadow-amber-500/10'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Uploading Review...</span>
                            </>
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
