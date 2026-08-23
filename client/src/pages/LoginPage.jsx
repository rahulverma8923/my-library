import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getErrorMessage = (err) => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
      return 'Unable to connect to backend server. If using Render free tier, please wait 30 seconds for the server to wake up.';
    }
    return 'Invalid email or password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      showSuccess('Welcome back to your library!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotModalOpen(false);
    showInfo(
      'Password reset request received. (In production, configure SMTP to deliver reset links).'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Sign in to access your personal reading sanctuary
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            Remember my session
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3.5 px-4 rounded-2xl bg-[#143B2D] hover:bg-[#184736] active:bg-[#0f2d22] text-[#FDFBF7] font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Entering Library...' : 'Log In'}</span>
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          New to My Library?{' '}
          <Link
            to="/register"
            className="font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 underline underline-offset-2 ml-1"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              Enter your registered email address to receive password reset instructions.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#143B2D] text-white rounded-xl shadow-sm hover:bg-[#184736] transition-colors"
                >
                  Send Instructions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
