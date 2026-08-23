import React from 'react';

export const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, className = '' }) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-ink-500 dark:text-ink-300 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-forest-700 dark:text-forest-400">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-parchment-200 dark:bg-ink-700 rounded-full overflow-hidden ${heightClasses[size] || heightClasses.md}`}>
        <div
          className="bg-gradient-to-r from-forest-600 to-forest-500 dark:from-forest-500 dark:to-forest-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
