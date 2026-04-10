import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
    isOpen,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Yes, Remove',
    cancelText = 'Cancel',
    confirmColor = 'bg-red-500 hover:bg-red-600',
    onConfirm,
    onCancel,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                /* Backdrop */
                <motion.div
                    key="confirm-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                    onClick={onCancel}
                >
                    {/* Dialog Box */}
                    <motion.div
                        key="confirm-box"
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shadow-inner">
                                <AlertTriangle size={30} className="text-red-500" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
                        <p className="text-sm text-slate-500 font-semibold leading-relaxed mb-8">{message}</p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-3 rounded-2xl text-white text-sm font-black uppercase tracking-widest transition-all shadow-lg ${confirmColor}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
