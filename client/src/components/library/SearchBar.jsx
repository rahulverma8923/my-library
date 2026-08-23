import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useBooks } from '../../context/BookContext';

export const SearchBar = ({ className = '' }) => {
  const { filters, setFilter } = useBooks();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilter('search', debouncedSearch);
  }, [debouncedSearch]);

  const handleClear = () => {
    setSearchTerm('');
    setFilter('search', '');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-ink-500 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search books, authors, categories, tags..."
        className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm text-sm text-ink-900 dark:text-ink-50 placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-forest-500 shadow-sm transition-all"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
