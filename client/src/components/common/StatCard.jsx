import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'forest', className = '' }) => {
  const colorStyles = {
    forest: {
      bg: 'bg-forest-50 dark:bg-forest-950/40',
      icon: 'text-forest-700 dark:text-forest-300 bg-forest-100 dark:bg-forest-950/80',
      border: 'border-forest-200 dark:border-forest-900/40'
    },
    amber: {
      bg: 'bg-warmAmber-50 dark:bg-warmAmber-950/40',
      icon: 'text-warmAmber-800 dark:text-warmAmber-300 bg-warmAmber-100 dark:bg-warmAmber-950/80',
      border: 'border-warmAmber-200 dark:border-warmAmber-900/40'
    },
    ink: {
      bg: 'bg-ink-50 dark:bg-ink-900/40',
      icon: 'text-ink-800 dark:text-ink-200 bg-parchment-200 dark:bg-ink-800',
      border: 'border-ink-200 dark:border-ink-800'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      icon: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80',
      border: 'border-rose-200 dark:border-rose-900/40'
    }
  };

  const style = colorStyles[color] || colorStyles.forest;

  return (
    <div
      className={`p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink-600 dark:text-ink-300 truncate">
            {title}
          </p>
          <h3 className="text-xl sm:text-3xl font-bold font-serif text-ink-950 dark:text-ink-50 mt-1 sm:mt-1.5 leading-none">
            {value}
          </h3>
          {subtitle && (
            <p className="hidden sm:block text-[11px] text-ink-500 dark:text-ink-400 mt-1.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 sm:p-2.5 rounded-xl ${style.icon} flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
