import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useScrollLock from '../../hooks/useScrollLock';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState(initialView); // 'login' or 'signup'
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useScrollLock(isOpen);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (view === 'login') {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    onClose();
                    if (formData.email?.toLowerCase() === 'admin786@gmail.com') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }
                else setError(result.message || 'Invalid email or password');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
                const result = await signup(formData.name, formData.email, formData.password);
                if (result.success) {
                    onClose();
                    navigate('/');
                }
                else setError(result.message || 'Signup failed. Email might already be in use.');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        const result = await loginWithGoogle();
        if (result.success) {
            onClose();
            navigate('/');
        }
        else setError(result.message || 'Google Login failed');
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Wrapper for centering */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 sm:p-10 border border-slate-100"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-black tracking-tight mb-2">
                                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent italic">
                                        {view === 'login' ? (isAdminLogin ? 'Admin Portal' : 'Welcome Back') : 'Create Account'}
                                    </span>
                                </h2>
                                <p className="text-slate-500 text-sm font-semibold">
                                    {view === 'login' ? 'Sign in to your account' : 'Join our premium collection'}
                                </p>
                            </div>

                            {/* Admin Toggle */}
                            {view === 'login' && (
                                <div className="flex justify-center mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                                        className={`text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full border-2 transition-all ${isAdminLogin
                                            ? 'border-amber-500 bg-amber-50 text-amber-600'
                                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {isAdminLogin ? 'Admin Login Mode Active' : 'Login as Admin'}
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {view === 'signup' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Full Name"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="admin@example.com"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-4 mr-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                        {view === 'login' && (
                                            <button type="button" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors">Forgot Password?</button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {view === 'signup' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Processing...' : (view === 'login' ? 'Login' : 'Create Account')}
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-7">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-300">
                                    <span className="bg-white px-4">OR</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-3 py-3.5 border border-amber-600/30 rounded-2xl text-slate-900 text-sm font-bold transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                </svg>
                                <span>{view === 'login' ? 'Log in with Google' : 'Sign up with Google'}</span>
                            </motion.button>

                            {/* Footer Toggle */}
                            <div className="mt-8 text-center text-slate-400 text-xs font-semibold">
                                {view === 'login' ? (
                                    <>Don't have an account? <button onClick={() => setView('signup')} className="text-amber-600 font-black hover:underline underline-offset-4">Sign Up</button></>
                                ) : (
                                    <>Already have an account? <button onClick={() => setView('login')} className="text-amber-600 font-black hover:underline underline-offset-4">Login</button></>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;

