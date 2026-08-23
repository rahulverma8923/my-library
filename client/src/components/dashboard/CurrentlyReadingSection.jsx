import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { BookCoverPlaceholder } from '../books/BookCoverPlaceholder';
import { ProgressBar } from '../common/ProgressBar';
import { EmptyState } from '../common/EmptyState';
import { getCoverImageUrl } from '../../utils/coverUtils';

export const CurrentlyReadingSection = ({ books = [] }) => {
  const navigate = useNavigate();

  if (books.length === 0) {
    return (
      <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-ink-50 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-forest-700 dark:text-forest-400" />
          <span>Currently Reading</span>
        </h2>
        <EmptyState
          icon={BookOpen}
          title="Nothing you're reading right now"
          description="Pick a book from your library or add a new one to begin tracking your reading session."
          actionLabel="Explore Library"
          onAction={() => navigate('/library')}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-ink-50 flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-forest-700 dark:text-forest-400" />
            <span>Currently Reading</span>
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Pick up right where you left off
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
          {books.length} in progress
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => navigate(`/book/${book._id}`)}
            className="group relative bg-parchment-50 dark:bg-ink-950/60 rounded-2xl border border-parchment-200 dark:border-ink-800 p-4 hover:border-forest-500/50 hover:shadow-book-hover transition-all duration-300 cursor-pointer flex gap-4"
          >
            {/* Thumbnail cover */}
            <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm bg-parchment-200 dark:bg-ink-800">
              {book.coverImage ? (
                <img
                  src={getCoverImageUrl(book.coverImage)}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <BookCoverPlaceholder title={book.title} author={book.author} />
              )}
            </div>

            {/* Content & Progress */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-forest-700 dark:text-forest-400 bg-forest-100/80 dark:bg-forest-950/80 px-2 py-0.5 rounded-md border border-forest-200/50 dark:border-forest-900/50">
                  {book.category}
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-ink-900 dark:text-ink-50 line-clamp-1 mt-1.5 group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-ink-600 dark:text-ink-400 truncate">
                  {book.author}
                </p>
              </div>

              <div className="pt-2">
                <ProgressBar progress={book.progress} size="sm" showLabel={true} />
                <div className="mt-2 flex items-center text-xs font-semibold text-forest-700 dark:text-forest-400 group-hover:translate-x-1 transition-transform">
                  <span>Continue Reading</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
