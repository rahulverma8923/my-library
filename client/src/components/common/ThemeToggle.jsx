import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { activeTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors ${className}`}
      title={activeTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {activeTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-warmAmber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-ink-700 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};
