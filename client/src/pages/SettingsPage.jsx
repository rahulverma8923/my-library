import React, { useState } from 'react';
import { Sun, Moon, Laptop, Trophy, Globe, Palette, Save, Check, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const [readingGoal, setReadingGoal] = useState(user?.readingGoal || 20);
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [saving, setSaving] = useState(false);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        readingGoal: Number(readingGoal),
        preferredLanguage
      });
      showSuccess('Settings preferences saved successfully');
    } catch (err) {
      console.error(err);
      showError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, desc: 'Warm cream & parchment aesthetic' },
    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Midnight reading-room sanctuary' },
    { value: 'system', label: 'System', icon: Laptop, desc: 'Sync with device system preference' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-ink-50">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1">
          Customize your reading environment and targets
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-parchment-200 dark:border-ink-800">
            <div className="p-2 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Appearance & Atmosphere
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Choose the visual tone that best comforts your eyes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-500 ring-2 ring-forest-500/20 shadow-sm'
                      : 'bg-parchment-50/50 dark:bg-ink-800/40 border-parchment-200 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-forest-700 dark:text-forest-400' : 'text-ink-500 dark:text-ink-400'}`} />
                    {isSelected && <Check className="w-4 h-4 text-forest-700 dark:text-forest-400" />}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-ink-900 dark:text-ink-50 block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-ink-500 dark:text-ink-400 leading-tight block mt-0.5">
                      {opt.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reading Target & Goals */}
        <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-parchment-200 dark:border-ink-800">
            <div className="p-2 rounded-xl bg-warmAmber-100 dark:bg-warmAmber-950/60 text-warmAmber-700 dark:text-warmAmber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Yearly Reading Goal
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Set the annual number of books you aspire to read
              </p>
            </div>
          </div>

          <div className="pt-2 max-w-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Books Target for {new Date().getFullYear()}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="365"
                value={readingGoal}
                onChange={(e) => setReadingGoal(e.target.value)}
                className="w-32 px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-sm font-bold text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
              <span className="text-sm font-medium text-ink-500 dark:text-ink-400">
                books per year
              </span>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-parchment-200 dark:border-ink-800">
            <div className="p-2 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Preferred Reading Language
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Default language selection for newly added volumes
              </p>
            </div>
          </div>

          <div className="pt-2 max-w-sm">
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-sm font-medium text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-700 text-parchment-50 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
