import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'forest', className = '' }) => {
  const colorStyles = {
    forest: {
      bg: 'bg-forest-50 dark:bg-forest-950/40',
      icon: 'text-forest-700 dark:text-forest-400 bg-forest-100 dark:bg-forest-900/60',
      border: 'border-forest-200 dark:border-forest-900/40'
    },
    amber: {
      bg: 'bg-warmAmber-50 dark:bg-warmAmber-950/40',
      icon: 'text-warmAmber-700 dark:text-warmAmber-400 bg-warmAmber-100 dark:bg-warmAmber-900/60',
      border: 'border-warmAmber-200 dark:border-warmAmber-900/40'
    },
    ink: {
      bg: 'bg-ink-50 dark:bg-ink-900/40',
      icon: 'text-ink-700 dark:text-ink-300 bg-ink-100 dark:bg-ink-800',
      border: 'border-ink-200 dark:border-ink-800'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      icon: 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60',
      border: 'border-rose-200 dark:border-rose-900/40'
    }
  };

  const style = colorStyles[color] || colorStyles.forest;

  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-800 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-ink-900 dark:text-ink-50 mt-1.5">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${style.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
