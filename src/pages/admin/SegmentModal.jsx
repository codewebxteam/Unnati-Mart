import React, { useState, useEffect } from 'react';
import { X, Save, Layers, Upload, Trash2 } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';

const SegmentModal = ({ isOpen, onClose, onSave, segment = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        status: 'Active'
    });
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (segment) {
            setFormData({
                ...segment,
                status: segment.status || 'Active'
            });
            setPreview(segment.image || null);
        } else {
            setFormData({
                name: '',
                image: '',
                status: 'Active'
            });
            setPreview(null);
        }
    }, [segment, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const base64 = await compressImage(file, 400, 400, 0.7);
            setPreview(base64);
            setFormData(prev => ({ ...prev, image: base64 }));
        } catch (err) {
            console.error("Image processing failed:", err);
            alert("Failed to process image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            updatedAt: new Date().toISOString()
        });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {segment ? 'Edit Segment' : 'New Segment'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Business Classification
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Segment Image</label>
                        <div className="relative group p-1 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center min-h-[160px] cursor-pointer hover:bg-indigo-50/50 transition-all">
                            {preview ? (
                                <div className="relative w-full h-full flex items-center justify-center group">
                                    <img src={preview} alt="Preview" className="w-24 h-24 object-contain" />
                                    <button 
                                        type="button"
                                        onClick={() => { setPreview(null); setFormData(prev => ({ ...prev, image: '' })); }}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <Upload size={32} strokeWidth={1.5} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Select Image</span>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Segment Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Grocery, Fashion, Electronics"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={18} strokeWidth={3} />
                            {segment ? 'Update Segment' : 'Create Segment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SegmentModal;
