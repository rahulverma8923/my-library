import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
  ExternalLink,
  Wifi
} from 'lucide-react';
import {
  getApiBaseUrl,
  getCustomApiUrl,
  setCustomApiUrl,
  checkServerHealth
} from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ServerConfigModal = ({ isOpen, onClose }) => {
  const { showSuccess, showError } = useToast();

  const [inputUrl, setInputUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null); // { ok: boolean, message: string }

  useEffect(() => {
    if (isOpen) {
      const active = getCustomApiUrl() || import.meta.env.VITE_API_URL || '';
      setInputUrl(active);
      checkCurrent(active);
    }
  }, [isOpen]);

  const checkCurrent = async (urlToCheck) => {
    setTesting(true);
    setHealthStatus(null);
    try {
      const res = await checkServerHealth(urlToCheck);
      setHealthStatus({
        ok: true,
        message: res.message || 'Server is online and responding healthy! 🟢'
      });
    } catch (err) {
      setHealthStatus({
        ok: false,
        message: err.message || 'Unable to connect to server.'
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setTesting(true);
    try {
      const cleaned = inputUrl.trim();
      const res = await checkServerHealth(cleaned);
      setCustomApiUrl(cleaned);
      setHealthStatus({
        ok: true,
        message: 'Successfully connected! 🟢'
      });
      showSuccess('Connected to backend server successfully!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err) {
      setHealthStatus({
        ok: false,
        message: `Connection failed: ${err.message}. If using Render free tier, please wait 30s for the server to wake up.`
      });
      showError('Could not connect to this URL. Please verify and try again.');
    } finally {
      setTesting(false);
    }
  };

  const handleResetDefault = () => {
    setCustomApiUrl('');
    setInputUrl('');
    showSuccess('Reset to default environment URL');
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-forest-100 dark:bg-forest-950/80 text-forest-700 dark:text-forest-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Backend Server Connection
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Connect this frontend with your Render backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
              Render Backend URL
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://your-app-name.onrender.com"
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-100 text-xs font-mono focus:ring-2 focus:ring-forest-600 focus:outline-none transition-all"
            />
            <p className="text-[11px] text-ink-400 dark:text-ink-500 mt-1">
              Paste your Render Web Service URL (e.g. <code>https://my-library-xyz.onrender.com</code>)
            </p>
          </div>

          {/* Active Status Pill */}
          <div className="p-3.5 rounded-2xl bg-parchment-50 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-600 dark:text-ink-400">
                Active Endpoint:
              </span>
              <span className="font-mono text-[11px] text-forest-700 dark:text-forest-400 truncate max-w-[220px]">
                {getApiBaseUrl()}
              </span>
            </div>

            {/* Health Result */}
            {testing ? (
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 pt-1">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Pinging server (waking up if sleeping)...</span>
              </div>
            ) : healthStatus ? (
              <div
                className={`flex items-start gap-2 text-xs pt-1 ${
                  healthStatus.ok
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {healthStatus.ok ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-[11px] leading-relaxed">{healthStatus.message}</span>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-parchment-200 dark:border-ink-800">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-ink-500 hover:text-ink-800 dark:hover:text-ink-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => checkCurrent(inputUrl)}
                disabled={testing}
                className="px-3.5 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 text-xs font-semibold text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
              >
                Test Ping
              </button>

              <button
                type="submit"
                disabled={testing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-parchment-50 text-xs font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save & Connect</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
