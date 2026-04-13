import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, loginWithGoogle, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get origin path or default
    const from = location.state?.from?.pathname || '/';
    const fromAdmin = location.state?.fromAdmin || false;

    // Auto-toggle admin mode if coming from admin route
    useEffect(() => {
        if (fromAdmin) {
            setIsAdminLogin(true);
        }
    }, [fromAdmin]);

    // Redirect if already logged in
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

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(email, password);
            if (result.success) {
                // The useEffect will handle redirection if user object updates,
                // but for immediate response using the same logic as AuthContext:
                const isAdmin = email === 'meraj786@gmail.com' || email === 'admin786@gmail.com' || email.toLowerCase().includes('admin');
                if (isAdmin) {
                    navigate('/admin', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setError(result.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await loginWithGoogle();
            if (result.success) {
                // Since we don't have the user role immediately here, 
                // the useEffect [user, loading] will handle the redirect.
                // However, if we want to be safe and wait for the listener:
                // We'll let the useEffect handle it for consistency.
            } else {
                setError(result.message || 'Google Login failed');
            }
        } catch (err) {
            setError('An error occurred during Google Login');
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
                            UNNATI <span className="text-amber-600 italic">MART</span>
                        </span>
                    </motion.div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
                        {isAdminLogin ? 'Admin Portal.' : 'Welcome Back.'}
                    </h2>
                    <p className="text-slate-500 font-semibold mt-2">
                        {isAdminLogin ? 'Sign in to dashboard' : 'Sign in to your account'}
                    </p>
                    {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4">{error}</p>}
                </div>

                {/* Admin Toggle */}
                <div className="flex justify-center mb-10">
                    <button
                        type="button"
                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                        className={`text-[10px] uppercase font-black tracking-widest px-6 py-2.5 rounded-full border-2 transition-all duration-300 ${isAdminLogin
                                ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-lg shadow-amber-500/10'
                                : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                            }`}
                    >
                        {isAdminLogin ? 'Admin Mode Active' : 'Switch to Admin Portal'}
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hello@example.com"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-4 mr-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-blue-700 transition-colors">Forgot?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className={`w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 mt-8 shadow-xl shadow-slate-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        <ArrowRight size={16} />
                    </motion.button>
                </form>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                        <span className="bg-white px-4">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <Github size={18} className="text-slate-900" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
                    </motion.button>
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                    </motion.button>
                </div>

                <p className="text-center mt-10 text-slate-500 font-semibold text-sm">
                    Don't have an account? {' '}
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-amber-600 font-black hover:underline underline-offset-4"
                    >
                        Sign Up
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
