import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LogOut, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ReadingAnalyticsView } from '../components/profile/ReadingAnalyticsView';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { books, stats, fetchBooks, fetchDashboardData } = useBooks();
  const navigate = useNavigate();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchDashboardData();
  }, [fetchBooks, fetchDashboardData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        onEditProfile={() => setEditProfileOpen(true)}
      />

      {/* Quick Action Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setChangePasswordOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-xs font-semibold text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-xs"
        >
          <KeyRound className="w-4 h-4 text-forest-700 dark:text-forest-400" />
          <span>Change Password</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-xs font-semibold text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-xs"
        >
          <SettingsIcon className="w-4 h-4 text-warmAmber-600 dark:text-warmAmber-400" />
          <span>Reading Settings</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shadow-xs ml-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Reading Analytics & Category Breakdown */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-ink-50">
          Reading Analytics & Literary Profile
        </h2>
        <ReadingAnalyticsView stats={stats} books={books} />
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
};
