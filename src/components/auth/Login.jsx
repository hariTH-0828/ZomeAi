import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');

        if (isSignUp && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', '').replace(/Error \([^)]+\)\./, '').trim() || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex items-center justify-center p-4 transition-colors">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 flex flex-col items-center relative z-10"
            >
                {/* Logo */}
                <div className="w-16 h-16 bg-[#5C45FD] text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Sparkles className="w-8 h-8" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight text-center mb-2">
                    {isSignUp ? 'Create an account' : 'Welcome to ZOME Ai'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-center text-[15px] mb-8">
                    {isSignUp ? 'Sign up to get started.' : 'Log in to continue your conversation.'}
                </p>

                {error && (
                    <div className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-[13px] mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4 mb-6">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#f9fafb] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3.5 rounded-xl text-[15px] outline-none transition-all focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white"
                        required
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#f9fafb] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3.5 pr-12 rounded-xl text-[15px] outline-none transition-all focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[50%] -translate-y-[50%] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {isSignUp && (
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#f9fafb] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3.5 pr-12 rounded-xl text-[15px] outline-none transition-all focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#5C45FD] hover:bg-indigo-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] mt-2 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>

                    <div className="text-center mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                                setConfirmPassword('');
                            }}
                            className="text-[14px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="flex w-full items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">OR CONTINUE WITH</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
                </div>

                {/* Google Button */}
                <button
                    onClick={signInWithGoogle}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Continue with Google
                </button>
            </motion.div>
        </div>
    );
};

export default Login;
