import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth, isAdminEmail } from '../../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { user, loading, signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        if (isAdminEmail(email)) {
            setError('This email is reserved for administrators.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await signup(name, email, password);
            if (result.success) {
                if (isAdminEmail(email)) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.message || 'Signup failed. Email might already be in use.');
            }
        } catch (err) {
            setError('An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200 border border-slate-100"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-block mb-4"
                        onClick={() => navigate('/')}
                    >
                        <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none cursor-pointer">
                            UNNATI <span className="text-blue-600 italic">MART</span>
                        </span>
                    </motion.div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Join Us.</h2>
                    <p className="text-slate-500 font-semibold mt-2">Create your account to get started</p>
                    {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4">{error}</p>}
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hello@example.com"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className={`w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 mt-8 shadow-xl shadow-slate-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                        <ArrowRight size={16} />
                    </motion.button>
                </form>

                <p className="text-center mt-10 text-slate-500 font-semibold text-sm">
                    Already have an account? {' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 font-black hover:underline underline-offset-4"
                    >
                        Login
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
