import React from 'react';
import { Mail, Calendar, Edit, Globe, Trophy } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/dateUtils';

export const ProfileHeader = ({ user, onEditProfile, onChangePassword }) => {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Large Avatar */}
        <Avatar name={user?.name} avatar={user?.avatar} size="xl" />

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-ink-50">
                {user?.name || 'Reader'}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs sm:text-sm text-ink-500 dark:text-ink-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-forest-700 dark:text-forest-400" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-forest-700 dark:text-forest-400" />
                  Member since {formatDate(user?.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-800 text-xs font-semibold text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-750 transition-colors shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 pt-4 border-t border-parchment-200 dark:border-ink-800">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-forest-50 dark:bg-forest-950 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
              <Globe className="w-3.5 h-3.5" />
              <span>Language: {user?.preferredLanguage || 'English'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warmAmber-50 dark:bg-warmAmber-950 text-warmAmber-800 dark:text-warmAmber-300 border border-warmAmber-200 dark:border-warmAmber-800">
              <Trophy className="w-3.5 h-3.5" />
              <span>Goal: {user?.readingGoal || 20} books / yr</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
