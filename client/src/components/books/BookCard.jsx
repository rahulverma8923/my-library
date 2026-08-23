import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MoreVertical, BookOpen, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { BookCoverPlaceholder } from './BookCoverPlaceholder';
import { ProgressBar } from '../common/ProgressBar';
import { QuickStatusModal } from './QuickStatusModal';
import { useBooks } from '../../context/BookContext';
import { getCoverImageUrl } from '../../utils/coverUtils';

export const BookCard = ({ book, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { toggleFavourite } = useBooks();
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleCardClick = (e) => {
    // Avoid triggering navigation if interacting with buttons/menus
    if (e.target.closest('.no-nav')) return;
    navigate(`/book/${book._id}`);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavourite(book._id);
  };

  const getStatusBadge = () => {
    switch (book.status) {
      case 'Finished':
        return {
          label: 'Finished',
          classes: 'bg-warmAmber-100 dark:bg-warmAmber-950/80 text-warmAmber-800 dark:text-warmAmber-300 border-warmAmber-300 dark:border-warmAmber-800'
        };
      case 'Reading':
        return {
          label: 'Reading',
          classes: 'bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-forest-300 border-forest-300 dark:border-forest-800'
        };
      default:
        return {
          label: 'Not Started',
          classes: 'bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white dark:bg-ink-900 rounded-2xl border border-parchment-200 dark:border-ink-800 p-3 sm:p-4 shadow-sm hover:shadow-book-hover transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
      >
        {/* Top Cover Image Area */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-parchment-100 dark:bg-ink-800 shadow-inner">
          {book.coverImage ? (
            <img
              src={getCoverImageUrl(book.coverImage)}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <BookCoverPlaceholder title={book.title} author={book.author} />
          )}

          {/* Top floating badges: Favourite button & Status */}
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 no-nav">
            <button
              type="button"
              onClick={handleFav}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                book.isFavourite
                  ? 'bg-rose-500 text-white scale-105'
                  : 'bg-black/30 hover:bg-black/50 text-white/90'
              }`}
              title={book.isFavourite ? 'Remove Favourite' : 'Add to Favourite'}
            >
              <Heart className={`w-3.5 h-3.5 ${book.isFavourite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border shadow-sm backdrop-blur-md ${badge.classes}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1 mb-1">
              <h3 className="font-serif font-bold text-sm sm:text-base text-ink-900 dark:text-ink-50 line-clamp-2 leading-snug group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
                {book.title}
              </h3>
              
              {/* Three dots action dropdown */}
              <div className="relative no-nav flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                  className="p-1 text-ink-400 hover:text-ink-800 dark:hover:text-ink-100 rounded-lg hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                    />
                    <div className="absolute right-0 top-6 z-40 w-40 bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700 rounded-xl shadow-xl py-1 text-xs animate-slide-up">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          navigate(`/book/${book._id}`);
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-parchment-100 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-forest-600" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          setStatusModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-parchment-100 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200"
                      >
                        <Clock className="w-3.5 h-3.5 text-warmAmber-600" />
                        <span>Change Status</span>
                      </button>
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            onEdit(book);
                          }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-parchment-100 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-ink-500" />
                          <span>Edit Book</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            onDelete(book);
                          }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-t border-parchment-200 dark:border-ink-700 mt-1 pt-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-xs text-ink-600 dark:text-ink-400 font-medium truncate mb-2">
              {book.author}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-parchment-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-parchment-200 dark:border-ink-700 font-medium">
                {book.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-parchment-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 border border-parchment-200 dark:border-ink-700">
                {book.language}
              </span>
            </div>
          </div>

          {/* Progress Indicator for Reading Books */}
          {book.status === 'Reading' && (
            <div className="mt-1 pt-2 border-t border-parchment-100 dark:border-ink-800/80">
              <ProgressBar progress={book.progress} size="sm" showLabel={true} />
            </div>
          )}
        </div>
      </div>

      <QuickStatusModal
        book={book}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />
    </>
  );
};
