import React from 'react';
import { Plus, BookMarked, Sparkles } from 'lucide-react';
import { getGreeting } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

export const GreetingHero = ({ onAddBook }) => {
  const { user } = useAuth();
  const greeting = getGreeting();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Reader';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-ink-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-forest-700/50">
      {/* Decorative ambient background glows */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-warmAmber-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-parchment-200 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-warmAmber-400" />
            <span>Personal Digital Sanctuary</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-parchment-50">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-parchment-200/90 leading-relaxed">
            Ready to continue your reading journey? Pick up where you left off or add a new literary volume.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAddBook}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-parchment-50 hover:bg-white text-forest-900 font-semibold text-sm shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
