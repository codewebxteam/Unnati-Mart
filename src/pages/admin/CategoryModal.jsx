import React, { useState, useEffect } from 'react';
import { X, Save, Tags, Link as LinkIcon, Eye, EyeOff, Upload, Trash2, Box } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';

const CategoryModal = ({ isOpen, onClose, onSave, category = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image: '',
        segmentId: '',
        status: 'Active',
        description: ''
    });
    const [segments, setSegments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    // Fetch segments for the dropdown
    useEffect(() => {
        if (isOpen) {
            const segRef = ref(db, 'segments');
            const unsub = onValue(segRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setSegments(Object.entries(data).map(([key, val]) => ({
                        ...val,
                        firebaseId: key
                    })));
                } else {
                    setSegments([]);
                }
            });
            return () => unsub();
        }
    }, [isOpen]);

    useEffect(() => {
        if (category) {
            setFormData({
                ...category,
                status: category.status || 'Active',
                segmentId: category.segmentId || ''
            });
            setPreview(category.image || null);
        } else {
            setFormData({
                name: '',
                slug: '',
                image: '',
                segmentId: '',
                status: 'Active',
                description: ''
            });
            setPreview(null);
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            updatedAt: new Date().toISOString()
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };
        
        if (name === 'name' && !category) {
            newFormData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        setFormData(newFormData);
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

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Tags size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {category ? 'Edit Category' : 'New Category'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Market Segmentation
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Image and Status */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Category Photo <span className="text-rose-500">*</span></label>
                                <div className="relative group p-1 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center min-h-[220px] cursor-pointer hover:bg-emerald-50/50 transition-all">
                                    {preview ? (
                                        <div className="relative w-full h-full flex items-center justify-center group">
                                            <img src={preview} alt="Preview" className="w-32 h-32 object-contain" />
                                            <button 
                                                type="button"
                                                onClick={() => { setPreview(null); setFormData(prev => ({ ...prev, image: '' })); }}
                                                className="absolute top-2 right-2 p-2 bg-white rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-400 text-center px-4">
                                            <Upload size={32} strokeWidth={1.5} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Select Category Photo</span>
                                            <span className="text-[9px] font-bold text-slate-300">JPG/PNG Up to 500KB</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Business Segment <span className="text-rose-500">*</span></label>
                                <div className="relative group">
                                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                    <select
                                        name="segmentId"
                                        value={formData.segmentId}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none"
                                    >
                                        <option value="">Select a Segment</option>
                                        {segments.map(s => (
                                            <option key={s.firebaseId} value={s.firebaseId}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {segments.length === 0 && (
                                    <p className="text-[9px] font-bold text-slate-400 ml-1 italic">Note: Consider adding Business Segments in the main view for better organization.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Name, Slug, Description */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Category Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Fresh Fruits"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Slug</label>
                                <div className="relative group">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
                                    <input
                                        required
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Visibility Status</label>
                                <div className="flex h-[54px] bg-slate-50 border border-slate-100 rounded-2xl p-1">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.status === 'Active' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <Eye size={14} /> Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, status: 'Hidden' }))}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.status === 'Hidden' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <EyeOff size={14} /> Hidden
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Market info..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 pb-4">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={18} strokeWidth={3} />
                            {category ? 'Update Category' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
