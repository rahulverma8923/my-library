import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MoreVertical, Edit2, Trash2, BookOpen, Clock } from 'lucide-react';
import { BookCoverPlaceholder } from './BookCoverPlaceholder';
import { ProgressBar } from '../common/ProgressBar';
import { QuickStatusModal } from './QuickStatusModal';
import { useBooks } from '../../context/BookContext';

export const BookListRow = ({ book, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { toggleFavourite } = useBooks();
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleRowClick = (e) => {
    if (e.target.closest('.no-nav')) return;
    navigate(`/book/${book._id}`);
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
        onClick={handleRowClick}
        className="group bg-white dark:bg-ink-900 rounded-2xl border border-parchment-200 dark:border-ink-800 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-forest-500/40"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Thumbnail */}
          <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-parchment-100 dark:bg-ink-800 shadow-sm">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookCoverPlaceholder title={book.title} author={book.author} />
            )}
          </div>

          {/* Book Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-ink-900 dark:text-ink-50 truncate group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
                {book.title}
              </h3>
            </div>
            <p className="text-xs text-ink-600 dark:text-ink-400 font-medium truncate mb-1.5">
              {book.author}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-parchment-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-parchment-200 dark:border-ink-700 font-medium">
                {book.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-parchment-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 border border-parchment-200 dark:border-ink-700">
                {book.language}
              </span>
            </div>
          </div>
        </div>

        {/* Progress & Status Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 no-nav">
          {book.status === 'Reading' ? (
            <div className="w-32 hidden md:block">
              <ProgressBar progress={book.progress} size="sm" showLabel={true} />
            </div>
          ) : (
            <span className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border shadow-sm ${badge.classes}`}>
              {badge.label}
            </span>
          )}

          {book.status === 'Reading' && (
            <span className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border shadow-sm md:hidden ${badge.classes}`}>
              {book.progress}%
            </span>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(book._id);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                book.isFavourite
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-500'
                  : 'bg-parchment-50 dark:bg-ink-800 border-parchment-200 dark:border-ink-700 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${book.isFavourite ? 'fill-current' : ''}`} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-2 rounded-xl border border-parchment-200 dark:border-ink-700 bg-parchment-50 dark:bg-ink-800 text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
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
                  <div className="absolute right-0 top-8 z-40 w-44 bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700 rounded-xl shadow-xl py-1 text-xs animate-slide-up">
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
