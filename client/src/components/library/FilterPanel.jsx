import React, { useState } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Heart, ChevronDown } from 'lucide-react';
import { STATUS_OPTIONS } from '../../utils/constants';
import { FilterChip } from './FilterChip';
import { useBooks } from '../../context/BookContext';

export const FilterPanel = ({ isMobileModal = false, onCloseMobile }) => {
  const {
    filters,
    setFilter,
    resetFilters,
    availableCategories,
    availableLanguages,
    availableAuthors
  } = useBooks();

  const [expanded, setExpanded] = useState(!isMobileModal);

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.language !== 'all' ||
    filters.author !== 'all' ||
    filters.isFavourite ||
    Boolean(filters.search);

  return (
    <div className="w-full space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-parchment-200/80 dark:bg-ink-900 rounded-2xl border border-parchment-300 dark:border-ink-800 overflow-x-auto max-w-full">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter('status', opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filters.status === opt.value
                  ? 'bg-forest-800 text-parchment-50 shadow-sm'
                  : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-parchment-100 dark:hover:bg-ink-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Favourites Filter Button */}
          <button
            type="button"
            onClick={() => setFilter('isFavourite', !filters.isFavourite)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all shadow-sm ${
              filters.isFavourite
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'bg-white/80 dark:bg-ink-900/80 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filters.isFavourite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favourites</span>
          </button>

          {/* Toggle More Filters */}
          {!isMobileModal && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-medium text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
              <span>Filters</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-ink-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Multi-Faceted Filter Dropdowns */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/70 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800 shadow-sm animate-slide-down">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-xs font-medium text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1">
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => setFilter('language', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-xs font-medium text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1">
              Author
            </label>
            <select
              value={filters.author}
              onChange={(e) => setFilter('author', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800 text-xs font-medium text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="all">All Authors</option>
              {availableAuthors.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {filters.search && (
            <FilterChip
              label={`Search: "${filters.search}"`}
              onRemove={() => setFilter('search', '')}
            />
          )}
          {filters.status !== 'all' && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => setFilter('status', 'all')}
            />
          )}
          {filters.category !== 'all' && (
            <FilterChip
              label={`Category: ${filters.category}`}
              onRemove={() => setFilter('category', 'all')}
            />
          )}
          {filters.language !== 'all' && (
            <FilterChip
              label={`Language: ${filters.language}`}
              onRemove={() => setFilter('language', 'all')}
            />
          )}
          {filters.author !== 'all' && (
            <FilterChip
              label={`Author: ${filters.author}`}
              onRemove={() => setFilter('author', 'all')}
            />
          )}
          {filters.isFavourite && (
            <FilterChip
              label="Favourites Only"
              onRemove={() => setFilter('isFavourite', false)}
            />
          )}
        </div>
      )}
    </div>
  );
};
