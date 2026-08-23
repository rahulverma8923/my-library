import React, { useState } from 'react';
import { X, Lock, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      showError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword
      });
      showSuccess('Password updated successfully');
      onClose();
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-ink-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-ink-50">
                Change Password
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Update your account security credentials
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              required
              minLength={6}
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-parchment-200 dark:border-ink-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-parchment-50 bg-forest-800 hover:bg-forest-700 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
