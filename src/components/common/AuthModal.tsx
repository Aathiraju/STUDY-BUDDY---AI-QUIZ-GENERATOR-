import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { loginBackend, registerBackend } from '../../services/apiService';

export const AuthModal: React.FC = () => {
  const { openAuthModal, setOpenAuthModal, loginUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!openAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      setAuthError('Please enter a valid Gmail address (ending with @gmail.com).');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    if (isSignUp) {
      const result = await registerBackend(name || email.split('@')[0], email, password);
      setIsSubmitting(false);

      if (result.success && result.user) {
        loginUser(result.user);
      } else {
        setAuthError(result.error || 'Registration failed. Please try again.');
      }
    } else {
      const result = await loginBackend(email, password);
      setIsSubmitting(false);

      if (result.success && result.user) {
        loginUser(result.user);
      } else {
        setAuthError(result.error || 'Invalid Gmail address or password. Please check your credentials.');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-6 glass-panel rounded-3xl border border-emerald-200 shadow-xl bg-white text-slate-900"
        >
          {/* Close button */}
          <button
            onClick={() => setOpenAuthModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <img
              src="/logo.png"
              alt="Study Buddy Logo"
              className="h-16 w-auto mx-auto mb-2 object-contain"
            />
            <h3 className="text-2xl font-bold text-slate-900 font-outfit">
              {isSignUp ? 'Create Study Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isSignUp
                ? 'Sign up with your Gmail ID to generate AI quizzes and access all features'
                : 'Sign in with your Gmail ID & password to access saved quizzes and features'}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gmail Address (@gmail.com)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.scholar@gmail.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              {!isSignUp && (
                <p className="text-[11px] text-slate-400 pt-1">
                  Demo credentials: <span className="font-mono text-emerald-700">alex.scholar@gmail.com</span> / <span className="font-mono text-emerald-700">password123</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Validating...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError(null);
              }}
              className="text-emerald-700 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up Free'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
