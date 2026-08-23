import React from 'react';
import { X } from 'lucide-react';

export const FilterChip = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-forest-100 dark:bg-forest-950 text-forest-900 dark:text-forest-300 border border-forest-300 dark:border-forest-800 animate-fade-in shadow-xs">
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-900 text-forest-700 dark:text-forest-300 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
