import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, MessageCircle, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';

const ShareModal = ({ isOpen, onClose, product }) => {
    const [copied, setCopied] = useState(false);
    useScrollLock(isOpen);
    const shareUrl = window.location.href;
    const shareText = `Check out this ${product?.name} on Unnati Mart!`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialPlatforms = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={20} />,
            color: 'bg-[#25D366]',
            link: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        },
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            color: 'bg-[#1877F2]',
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'X (Twitter)',
            icon: <Twitter size={20} />,
            color: 'bg-[#000000]',
            link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-[2.5rem] p-8 z-[101] shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Share Product.</h3>
                            <button
                                onClick={onClose}
                                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Social Icons */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {socialPlatforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={`w-14 h-14 ${platform.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        {platform.icon}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {platform.name}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Copy Link */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Or Copy Link</p>
                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex-1 px-3 py-2 text-xs font-bold text-slate-500 truncate">
                                    {shareUrl}
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${copied ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white hover:bg-amber-600'
                                        }`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
