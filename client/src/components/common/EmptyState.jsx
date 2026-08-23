import React from 'react';
import { BookOpen, Search, Sparkles, Plus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No books found',
  description = 'Your collection is waiting for its next chapter.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-parchment-300 dark:border-ink-700 bg-parchment-100/50 dark:bg-ink-900/30 my-6 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-parchment-200 dark:bg-ink-800 flex items-center justify-center text-forest-700 dark:text-forest-400 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink-900 dark:text-ink-50 mb-2">
        {title}
      </h3>
      <p className="text-sm text-ink-500 dark:text-ink-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-forest-800 hover:bg-forest-700 text-parchment-50 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
