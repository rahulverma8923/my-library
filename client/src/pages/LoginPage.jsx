import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, KeyRound, Check, X, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ServerConfigModal } from '../components/common/ServerConfigModal';
import { getApiBaseUrl } from '../services/api';

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
  const [serverModalOpen, setServerModalOpen] = useState(false);

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
    if (err.isHtmlFallback) {
      return 'Backend API URL is not reaching the server. Please check VITE_API_URL on Vercel.';
    }
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
      return 'Unable to connect to backend server. If using Render, please wait 30 seconds for the free server to wake up.';
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

  // Quick 1-click Demo Account Login
  const handleQuickDemoLogin = async () => {
    setFormData({
      email: 'demo@mylibrary.com',
      password: 'Password123!',
      rememberMe: true
    });

    setLoading(true);
    try {
      await login({ email: 'demo@mylibrary.com', password: 'Password123!' });
      showSuccess('Logged into Demo Reader Account!');
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
      'Password reset request received. (Note: In production, configure an SMTP email provider like SendGrid/Resend to deliver reset links).'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-ink-50">
          Welcome back
        </h2>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          Enter your credentials to enter your private library
        </p>
      </div>

      {/* Demo Account Banner Button */}
      <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-forest-700 dark:text-forest-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-forest-900 dark:text-forest-200 block">
              Want to explore right away?
            </span>
            <span className="text-forest-700/80 dark:text-forest-400">
              demo@mylibrary.com / Password123!
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-forest-800 hover:bg-forest-700 text-parchment-50 shadow-sm transition-transform active:scale-95"
        >
          1-Click Demo Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-xs text-forest-700 dark:text-forest-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 border-parchment-300 dark:border-ink-700"
          />
          <label htmlFor="rememberMe" className="text-xs text-ink-600 dark:text-ink-300 cursor-pointer">
            Remember my session
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-2xl bg-forest-800 hover:bg-forest-700 text-parchment-50 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Entering Library...' : 'Log In'}</span>
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2">
        <p className="text-xs text-ink-500 dark:text-ink-400">
          New to My Library?{' '}
          <Link
            to="/register"
            className="font-semibold text-forest-700 dark:text-forest-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Backend Connection Status Trigger */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setServerModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-200 bg-parchment-100 hover:bg-parchment-200 dark:bg-ink-800 dark:hover:bg-ink-700 border border-parchment-200 dark:border-ink-700 transition-all"
        >
          <Server className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
          <span>Server: <span className="font-mono text-ink-700 dark:text-ink-200">{getApiBaseUrl()}</span></span>
        </button>
      </div>

      {/* Backend Configuration Modal */}
      <ServerConfigModal
        isOpen={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
      />

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-warmAmber-100 dark:bg-warmAmber-950/60 text-warmAmber-700 dark:text-warmAmber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50 mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-ink-500 dark:text-ink-400 mb-4 leading-relaxed">
              Enter your registered email address to receive password reset instructions.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-xs text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-ink-600 dark:text-ink-400 hover:bg-parchment-100 dark:hover:bg-ink-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-forest-800 text-parchment-50 rounded-xl shadow-sm hover:bg-forest-700"
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
