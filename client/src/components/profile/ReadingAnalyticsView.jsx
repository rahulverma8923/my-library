import React from 'react';
import { BookOpen, BookCheck, Clock, Heart, Library, Compass, Languages } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const ReadingAnalyticsView = ({ stats, books = [] }) => {
  // Compute categories & languages distribution from current books
  const categoryMap = {};
  const languageMap = {};

  books.forEach((book) => {
    if (book.category) {
      categoryMap[book.category] = (categoryMap[book.category] || 0) + 1;
    }
    if (book.language) {
      languageMap[book.language] = (languageMap[book.language] || 0) + 1;
    }
  });

  const topCategories = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topLanguages = Object.entries(languageMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const total = books.length || 1;

  return (
    <div className="space-y-6">
      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Books"
          value={books.length}
          subtitle="Full library"
          icon={Library}
          color="forest"
        />
        <StatCard
          title="Finished"
          value={books.filter((b) => b.status === 'Finished').length}
          subtitle="Completed"
          icon={BookCheck}
          color="amber"
        />
        <StatCard
          title="Reading"
          value={books.filter((b) => b.status === 'Reading').length}
          subtitle="In progress"
          icon={Clock}
          color="forest"
        />
        <StatCard
          title="Not Started"
          value={books.filter((b) => b.status === 'Not Started').length}
          subtitle="To be read"
          icon={BookOpen}
          color="ink"
        />
        <StatCard
          title="Favourites"
          value={books.filter((b) => b.isFavourite).length}
          subtitle="Loved stories"
          icon={Heart}
          color="rose"
        />
      </div>

      {/* Category & Language Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favourite Categories */}
        <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Top Categories
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Your most explored literary genres
              </p>
            </div>
          </div>

          {topCategories.length === 0 ? (
            <p className="text-xs text-ink-400 py-4 text-center">No categories recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topCategories.slice(0, 6).map((cat) => {
                const percent = Math.round((cat.count / total) * 100);
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-ink-700 dark:text-ink-300">
                      <span>{cat.name}</span>
                      <span className="font-semibold text-ink-500 dark:text-ink-400">
                        {cat.count} {cat.count === 1 ? 'book' : 'books'} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-parchment-200 dark:bg-ink-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-forest-600 dark:bg-forest-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Favourite Languages */}
        <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2.5 rounded-xl bg-warmAmber-100 dark:bg-warmAmber-950/60 text-warmAmber-700 dark:text-warmAmber-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Reading Languages
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Linguistic diversity in your library
              </p>
            </div>
          </div>

          {topLanguages.length === 0 ? (
            <p className="text-xs text-ink-400 py-4 text-center">No languages recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topLanguages.slice(0, 6).map((lang) => {
                const percent = Math.round((lang.count / total) * 100);
                return (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-ink-700 dark:text-ink-300">
                      <span>{lang.name}</span>
                      <span className="font-semibold text-ink-500 dark:text-ink-400">
                        {lang.count} {lang.count === 1 ? 'book' : 'books'} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-parchment-200 dark:bg-ink-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-warmAmber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
