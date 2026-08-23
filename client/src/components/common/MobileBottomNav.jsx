import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, User, Plus, Settings } from 'lucide-react';

export const MobileBottomNav = ({ onAddBook }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border-t border-parchment-200 dark:border-ink-800 pb-safe shadow-lg">
      <div className="flex items-center justify-between h-16 px-2 sm:px-4 relative max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-200'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </NavLink>

        {/* Library */}
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-200'
            }`
          }
        >
          <Library className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Library</span>
        </NavLink>

        {/* Floating Add Book Button in Center */}
        <div className="flex justify-center flex-1 px-1">
          <button
            type="button"
            onClick={onAddBook}
            className="-mt-6 w-12 h-12 rounded-full bg-forest-800 hover:bg-forest-700 active:scale-95 text-parchment-50 flex items-center justify-center shadow-lg border-4 border-parchment-50 dark:border-ink-950 transition-all focus:outline-none"
            aria-label="Add Book"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-200'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Profile</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-200'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};
