import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, User, Plus } from 'lucide-react';

export const MobileBottomNav = ({ onAddBook }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-ink-900/95 backdrop-blur-lg border-t border-parchment-200 dark:border-ink-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-4 relative">
        {/* Home */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </NavLink>

        {/* Floating Add Book Button in center */}
        <div className="relative -top-5 flex justify-center flex-1">
          <button
            type="button"
            onClick={onAddBook}
            className="w-12 h-12 rounded-full bg-forest-800 hover:bg-forest-700 text-parchment-50 flex items-center justify-center shadow-lg border-4 border-parchment-50 dark:border-ink-950 transition-transform active:scale-95"
            aria-label="Add Book"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Library */}
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400'
            }`
          }
        >
          <Library className="w-5 h-5" />
          <span className="text-[11px]">Library</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive
                ? 'text-forest-700 dark:text-forest-400 font-bold'
                : 'text-ink-500 dark:text-ink-400'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
