import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/constants';
import { useBooks } from '../../context/BookContext';

export const SortDropdown = ({ className = '' }) => {
  const { filters, setFilter } = useBooks();

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm text-xs font-medium text-ink-700 dark:text-ink-300 shadow-sm">
        <ArrowUpDown className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
        <span className="hidden sm:inline text-ink-500 dark:text-ink-400">Sort:</span>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="bg-transparent border-none text-xs font-semibold text-ink-900 dark:text-ink-100 focus:outline-none cursor-pointer pr-2"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
