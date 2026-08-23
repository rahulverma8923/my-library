import React, { useState } from 'react';
import { X, Save, User as UserIcon, Loader2 } from 'lucide-react';
import { LANGUAGES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    preferredLanguage: user?.preferredLanguage || 'English',
    readingGoal: user?.readingGoal || 20
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Please provide your full name');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      showSuccess('Profile updated successfully');
      onClose();
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-ink-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-ink-50">
                Edit Profile
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Manage your reader information & reading goals
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Avatar Image URL (Optional)
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Preferred Reading Language
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-sm text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Yearly Reading Goal (Books)
            </label>
            <input
              type="number"
              name="readingGoal"
              min="1"
              max="500"
              value={formData.readingGoal}
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
