import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { useBooks } from '../../context/BookContext';

export const ViewToggle = ({ className = '' }) => {
  const { viewMode, setViewMode } = useBooks();

  return (
    <div className={`flex items-center p-1 rounded-2xl border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm shadow-sm ${className}`}>
      <button
        type="button"
        onClick={() => setViewMode('grid')}
        className={`p-1.5 rounded-xl transition-all ${
          viewMode === 'grid'
            ? 'bg-forest-800 text-parchment-50 shadow-sm'
            : 'text-ink-500 hover:text-ink-800 dark:hover:text-ink-200'
        }`}
        title="Grid View"
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setViewMode('list')}
        className={`p-1.5 rounded-xl transition-all ${
          viewMode === 'list'
            ? 'bg-forest-800 text-parchment-50 shadow-sm'
            : 'text-ink-500 hover:text-ink-800 dark:hover:text-ink-200'
        }`}
        title="List View"
        aria-label="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};
