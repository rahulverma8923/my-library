import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  User,
  Settings,
  Plus,
  LogOut,
  Library,
  BookMarked,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from './Avatar';
import { ThemeToggle } from './ThemeToggle';
import { useBooks } from '../../context/BookContext';

export const Sidebar = ({ onAddBook, onImportBooks }) => {
  const { user, logout } = useAuth();
  const { totalCount, currentlyReading } = useBooks();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/library', label: 'My Library', icon: Library, badge: totalCount || undefined },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-white dark:bg-ink-900 border-r border-parchment-200 dark:border-ink-800 h-screen sticky top-0 px-4 py-6 z-30 select-none">
      {/* Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 text-parchment-50 flex items-center justify-center shadow-md">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50 leading-tight block">
                My Library
              </span>
              <span className="text-[10px] text-ink-400 dark:text-ink-400 font-medium tracking-tight block">
                Your books. Your progress.
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onAddBook}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-forest-800 hover:bg-forest-700 text-parchment-50 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>

          <button
            type="button"
            onClick={onImportBooks}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-parchment-100 hover:bg-parchment-200 dark:bg-ink-800 dark:hover:bg-ink-750 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 font-semibold text-xs shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import from Excel</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest-50 dark:bg-forest-950/80 text-forest-800 dark:text-forest-300 font-semibold border border-forest-200/80 dark:border-forest-900/60 shadow-xs'
                      : 'text-ink-600 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800/80 hover:text-ink-900 dark:hover:text-ink-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-ink-800 text-ink-600 dark:text-ink-400 font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="pt-4 border-t border-parchment-200 dark:border-ink-800 space-y-3">
        {/* Currently reading mini widget */}
        {currentlyReading.length > 0 && (
          <div
            onClick={() => navigate(`/book/${currentlyReading[0]._id}`)}
            className="p-3 rounded-2xl bg-parchment-50 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800/80 cursor-pointer hover:border-forest-500/40 transition-colors"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-forest-700 dark:text-forest-400 block mb-1">
              Currently Reading
            </span>
            <p className="font-serif font-bold text-xs text-ink-900 dark:text-ink-100 truncate">
              {currentlyReading[0].title}
            </p>
            <div className="w-full bg-parchment-200 dark:bg-ink-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-forest-600 h-full rounded-full"
                style={{ width: `${currentlyReading[0].progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-2xl bg-parchment-50 dark:bg-ink-800/50 border border-parchment-200 dark:border-ink-800">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
          >
            <Avatar name={user?.name} avatar={user?.avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink-900 dark:text-ink-50 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-ink-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
