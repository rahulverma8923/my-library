import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { BookCoverPlaceholder } from '../books/BookCoverPlaceholder';
import { formatDate } from '../../utils/dateUtils';
import { getCoverImageUrl } from '../../utils/coverUtils';

export const RecentlyAddedSection = ({ books = [] }) => {
  const navigate = useNavigate();

  if (books.length === 0) return null;

  return (
    <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-ink-50 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-warmAmber-600 dark:text-warmAmber-400" />
            <span>Recently Added</span>
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Latest acquisitions in your collection
          </p>
        </div>

        <button
          onClick={() => navigate('/library')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-forest-700 dark:text-forest-400 hover:text-forest-800 dark:hover:text-forest-300 hover:underline transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => navigate(`/book/${book._id}`)}
            className="group cursor-pointer flex flex-col justify-between p-3 rounded-2xl bg-parchment-50 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800 hover:shadow-book-hover hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <div className="w-full aspect-[2/3] rounded-xl overflow-hidden mb-2.5 bg-parchment-200 dark:bg-ink-800 shadow-sm">
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
              <h3 className="font-serif font-bold text-xs sm:text-sm text-ink-900 dark:text-ink-50 line-clamp-1 group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-[11px] text-ink-500 dark:text-ink-400 truncate">
                {book.author}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-parchment-200 dark:border-ink-800/80 flex items-center justify-between text-[10px] text-ink-400">
              <span className="truncate">{book.category}</span>
              <span className="font-medium text-ink-600 dark:text-ink-300">{formatDate(book.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
