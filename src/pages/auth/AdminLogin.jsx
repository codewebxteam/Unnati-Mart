import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in as admin
    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                setError('Access Denied: Highly restricted area.');
            }
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Administrator credentials required.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.message || 'Authentication failed. Unauthorized entry attempt logged.');
            }
            // Redirection is handled by the useEffect above
        } catch (err) {
            setError('A system error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back to Home if desired */}
                <button 
                   onClick={() => navigate('/')}
                   className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 mx-auto font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <Home size={14} />
                    Back to Terminal
                </button>

                <div className="bg-[#111827] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 to-amber-400"></div>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6 border border-amber-600/20 shadow-inner">
                            <ShieldAlert size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                            Admin <span className="text-amber-500">Console</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">
                            Authorized Access Only
                        </p>
                        
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mt-6"
                            >
                                <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                    {error}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Secure ID</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Admin ID"
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className={`w-full bg-amber-600 hover:bg-amber-500 text-[#111827] rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 mt-8 shadow-xl shadow-amber-600/10 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span>{isLoading ? 'Verifying...' : 'Initiate Access'}</span>
                            <ArrowRight size={16} strokeWidth={3} />
                        </motion.button>
                    </form>

                    <div className="mt-12 text-center border-t border-white/5 pt-8">
                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em]">
                            End-to-End Encrypted Node
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
