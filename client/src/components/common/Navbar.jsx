import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookMarked, Search, Plus, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from './Avatar';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onAddBook }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-parchment-200 dark:border-ink-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-forest-800 text-parchment-50 flex items-center justify-center shadow-sm">
            <BookMarked className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-base text-ink-900 dark:text-ink-50">
            My Library
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div
            onClick={() => navigate('/profile')}
            className="cursor-pointer"
          >
            <Avatar name={user?.name} avatar={user?.avatar} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
