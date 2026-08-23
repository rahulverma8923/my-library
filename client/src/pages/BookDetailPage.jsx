import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  Globe,
  Compass,
  BookOpen,
  CheckCircle,
  Clock,
  Save,
  MessageSquareQuote,
  Sparkles,
  FileText
} from 'lucide-react';
import { bookService } from '../services/bookService';
import { BookCoverPlaceholder } from '../components/books/BookCoverPlaceholder';
import { ProgressBar } from '../components/common/ProgressBar';
import { EditBookModal } from '../components/books/EditBookModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { formatDate } from '../utils/dateUtils';
import { getCoverImageUrl } from '../utils/coverUtils';
import { useBooks } from '../context/BookContext';
import { useToast } from '../context/ToastContext';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavourite, deleteBook, updateBook } = useBooks();
  const { showSuccess, showError } = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notes editing state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Quick live progress editing
  const [tempProgress, setTempProgress] = useState(0);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await bookService.getBookById(id);
      setBook(res.book);
      setNotesContent(res.book.notes || '');
      setTempProgress(res.book.progress || 0);
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to load book details');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      let progress = tempProgress;
      if (newStatus === 'Finished') progress = 100;
      else if (newStatus === 'Not Started') progress = 0;
      else if (newStatus === 'Reading' && (progress === 0 || progress === 100)) progress = 50;

      const updated = await updateBook(book._id, { status: newStatus, progress });
      setBook(updated);
      setTempProgress(updated.progress);
      showSuccess(`Reading status updated to ${newStatus}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProgressChange = async (val) => {
    setTempProgress(val);
    try {
      const updated = await updateBook(book._id, { progress: val });
      setBook(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const updated = await updateBook(book._id, { notes: notesContent });
      setBook(updated);
      setIsEditingNotes(false);
      showSuccess('Personal notes saved');
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleFav = async () => {
    try {
      const updated = await toggleFavourite(book._id);
      setBook((prev) => ({ ...prev, isFavourite: updated.isFavourite }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBook(book._id);
      navigate('/library');
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-forest-200 border-t-forest-700 animate-spin mb-4" />
        <p className="font-serif text-ink-600 dark:text-ink-300">Retrieving volume from your shelves...</p>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-forest-700 dark:hover:text-forest-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFav}
            className={`p-2.5 rounded-xl border transition-all ${
              book.isFavourite
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-900 text-rose-500 shadow-sm'
                : 'bg-white dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-500 hover:text-ink-900 dark:hover:text-ink-100'
            }`}
            title={book.isFavourite ? 'Remove Favourite' : 'Mark as Favourite'}
          >
            <Heart className={`w-4 h-4 ${book.isFavourite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-xs font-semibold text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Book</span>
          </button>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Showcase Hero Section */}
      <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        {/* Cover Column */}
        <div className="w-full sm:w-64 md:w-72 flex-shrink-0 mx-auto md:mx-0">
          <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-book bg-parchment-200 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700">
            {book.coverImage ? (
              <img
                src={getCoverImageUrl(book.coverImage)}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookCoverPlaceholder title={book.title} author={book.author} />
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 space-y-6 w-full">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
                {book.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-parchment-300 dark:border-ink-700">
                {book.language}
              </span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-900 dark:text-ink-50 leading-tight">
              {book.title}
            </h1>
            <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 font-medium mt-1">
              by <span className="font-serif italic">{book.author}</span>
            </p>
          </div>

          {/* Interactive Reading Status Stepper */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-parchment-50 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800 space-y-3 sm:space-y-4">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink-600 dark:text-ink-300 block">
              Reading Status
            </span>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {['Not Started', 'Reading', 'Finished'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  className={`py-2 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center truncate ${
                    book.status === s
                      ? 'bg-forest-800 text-parchment-50 border-forest-700 shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Live Progress Slider if Reading */}
            {book.status === 'Reading' && (
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-ink-700 dark:text-ink-300">
                  <span>Current Progress</span>
                  <span className="text-sm font-bold text-forest-700 dark:text-forest-400">
                    {tempProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tempProgress}
                  onChange={(e) => handleProgressChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Tags Chips */}
          {book.tags && book.tags.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-2">
                Tags & Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-parchment-300 dark:border-ink-700 font-medium"
                  >
                    <Tag className="w-3 h-3 text-forest-600 dark:text-forest-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reading Dates & Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-parchment-200 dark:border-ink-800 text-xs">
            <div>
              <span className="text-ink-400 block">Added to Sanctuary</span>
              <span className="font-semibold text-ink-800 dark:text-ink-200">
                {formatDate(book.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block">Reading Started</span>
              <span className="font-semibold text-ink-800 dark:text-ink-200">
                {formatDate(book.startedAt)}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block">Completed</span>
              <span className="font-semibold text-ink-800 dark:text-ink-200">
                {formatDate(book.finishedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Notes & Reflections Section */}
      <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-ink-50">
                My Notes & Reflections
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Private literary thoughts, key takeaways, and memorable passages
              </p>
            </div>
          </div>

          {!isEditingNotes ? (
            <button
              type="button"
              onClick={() => setIsEditingNotes(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-800 text-xs font-semibold text-ink-800 dark:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-750 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{book.notes ? 'Edit Notes' : 'Add Notes'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNotesContent(book.notes || '');
                  setIsEditingNotes(false);
                }}
                className="px-3 py-1.5 text-xs text-ink-500 hover:text-ink-800 dark:hover:text-ink-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 text-parchment-50 text-xs font-semibold shadow-sm hover:bg-forest-700 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
              </button>
            </div>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              rows={8}
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder="Write your thoughts, observations, favorite quotes, or takeaways from this book..."
              className="w-full p-4 rounded-2xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all resize-y leading-relaxed"
            />
          </div>
        ) : book.notes ? (
          <div className="p-6 rounded-2xl bg-parchment-50/70 dark:bg-ink-950/50 border border-parchment-200 dark:border-ink-800 text-sm text-ink-800 dark:text-ink-200 whitespace-pre-wrap leading-relaxed font-sans">
            {book.notes}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border border-dashed border-parchment-300 dark:border-ink-700 rounded-2xl">
            <FileText className="w-8 h-8 mx-auto text-ink-400 mb-2 opacity-60" />
            <p className="text-sm font-serif italic text-ink-500 dark:text-ink-400">
              No notes added yet.
            </p>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="mt-3 text-xs font-semibold text-forest-700 dark:text-forest-400 hover:underline"
            >
              + Write your first thought about this book
            </button>
          </div>
        )}
      </div>

      {/* Edit Book Modal */}
      <EditBookModal
        book={book}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          fetchBook();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete this book?"
        message={`Are you sure you want to remove "${book.title}" from your library? This action cannot be undone.`}
        confirmText="Delete Book"
        isLoading={deleteLoading}
      />
    </div>
  );
};
