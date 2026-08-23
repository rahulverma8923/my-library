import React from 'react';
import { Plus, BookMarked, Sparkles } from 'lucide-react';
import { getGreeting } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

export const GreetingHero = ({ onAddBook }) => {
  const { user } = useAuth();
  const greeting = getGreeting();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Reader';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-ink-950 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-forest-700/50">
      {/* Decorative ambient background glows */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-warmAmber-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-parchment-200 mb-2.5 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-warmAmber-400" />
            <span>Personal Digital Sanctuary</span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-3xl lg:text-4xl leading-tight text-parchment-50">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-parchment-200/90 leading-relaxed">
            Ready to continue your reading journey? Track your books, reflections, and yearly reading goals.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1 md:pt-0">
          <button
            type="button"
            onClick={onAddBook}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-parchment-50 hover:bg-white text-forest-900 font-bold text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
