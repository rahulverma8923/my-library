import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useBooks } from '../../context/BookContext';

export const QuickStatusModal = ({ book, isOpen, onClose }) => {
  const { updateBookStatus } = useBooks();
  const [status, setStatus] = useState(book?.status || 'Not Started');
  const [progress, setProgress] = useState(book?.progress || 0);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !book) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBookStatus(book._id, status, progress);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Finished') {
      setProgress(100);
    } else if (newStatus === 'Not Started') {
      setProgress(0);
    } else if (newStatus === 'Reading' && progress === 100) {
      setProgress(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
            Update Reading Status
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-serif italic text-ink-500 dark:text-ink-400 mb-5 truncate">
          {book.title} — {book.author}
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Not Started', 'Reading', 'Finished'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all text-center ${
                    status === s
                      ? 'bg-forest-800 text-parchment-50 border-forest-700 shadow-sm'
                      : 'bg-parchment-50 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-200 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-750'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {status === 'Reading' && (
            <div className="bg-parchment-50 dark:bg-ink-950/50 p-4 rounded-2xl border border-parchment-200 dark:border-ink-800">
              <div className="flex justify-between items-center text-xs font-semibold text-ink-700 dark:text-ink-300 mb-2">
                <span>Reading Progress</span>
                <span className="text-forest-700 dark:text-forest-400">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-ink-600 dark:text-ink-400 hover:bg-parchment-100 dark:hover:bg-ink-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-forest-800 hover:bg-forest-700 text-parchment-50 rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
