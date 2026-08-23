import React, { useState, useEffect } from 'react';
import { X, Save, Tag, Edit3, Loader2 } from 'lucide-react';
import { CATEGORIES, LANGUAGES } from '../../utils/constants';
import { BookCoverUpload } from './BookCoverUpload';
import { useBooks } from '../../context/BookContext';
import { useToast } from '../../context/ToastContext';

export const EditBookModal = ({ book, isOpen, onClose }) => {
  const { updateBook } = useBooks();
  const { showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: '',
    category: 'Fiction',
    customCategory: '',
    language: 'English',
    customLanguage: '',
    status: 'Not Started',
    progress: 0,
    notes: '',
    isFavourite: false,
    tags: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      const isKnownCategory = CATEGORIES.includes(book.category);
      const isKnownLanguage = LANGUAGES.includes(book.language);

      setFormData({
        title: book.title || '',
        author: book.author || '',
        coverImage: book.coverImage || '',
        category: isKnownCategory ? book.category : 'Other',
        customCategory: isKnownCategory ? '' : book.category || '',
        language: isKnownLanguage ? book.language : 'Other',
        customLanguage: isKnownLanguage ? '' : book.language || '',
        status: book.status || 'Not Started',
        progress: book.progress || 0,
        notes: book.notes || '',
        isFavourite: Boolean(book.isFavourite),
        tags: Array.isArray(book.tags) ? book.tags : []
      });
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusChange = (status) => {
    let progress = formData.progress;
    if (status === 'Finished') progress = 100;
    else if (status === 'Not Started') progress = 0;
    else if (status === 'Reading' && (progress === 0 || progress === 100)) progress = 50;

    setFormData((prev) => ({
      ...prev,
      status,
      progress
    }));
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && currentTag.trim()) {
      e.preventDefault();
      const newTag = currentTag.trim().replace(/^#/, '');
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      showError('Please provide both book title and author name');
      return;
    }

    setLoading(true);
    try {
      const finalCategory =
        formData.category === 'Other' && formData.customCategory.trim()
          ? formData.customCategory.trim()
          : formData.category;

      const finalLanguage =
        formData.language === 'Other' && formData.customLanguage.trim()
          ? formData.customLanguage.trim()
          : formData.language;

      await updateBook(book._id, {
        title: formData.title,
        author: formData.author,
        coverImage: formData.coverImage,
        category: finalCategory,
        language: finalLanguage,
        status: formData.status,
        progress: formData.progress,
        notes: formData.notes,
        isFavourite: formData.isFavourite,
        tags: formData.tags
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-ink-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-warmAmber-100 dark:bg-warmAmber-950/60 text-warmAmber-700 dark:text-warmAmber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-ink-50">
                Edit Book
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Update details, notes, or reading progress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              Book Cover
            </label>
            <BookCoverUpload
              currentCover={formData.coverImage}
              onCoverUploaded={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              onCoverRemoved={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
            />
          </div>

          {/* Book Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                Author Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Category & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formData.category === 'Other' && (
                <input
                  type="text"
                  name="customCategory"
                  placeholder="Enter custom category"
                  value={formData.customCategory}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-xs text-ink-900 dark:text-ink-50"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {formData.language === 'Other' && (
                <input
                  type="text"
                  name="customLanguage"
                  placeholder="Enter custom language"
                  value={formData.customLanguage}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-xs text-ink-900 dark:text-ink-50"
                />
              )}
            </div>
          </div>

          {/* Reading Status Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-2">
              Reading Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {['Not Started', 'Reading', 'Finished'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    formData.status === s
                      ? 'bg-forest-800 text-parchment-50 border-forest-700 shadow-md scale-[1.02]'
                      : 'bg-parchment-50/70 dark:bg-ink-800/60 text-ink-700 dark:text-ink-300 border-parchment-200 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-750'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Progress Slider */}
          {formData.status === 'Reading' && (
            <div className="bg-forest-50/60 dark:bg-forest-950/30 p-4 rounded-2xl border border-forest-200/60 dark:border-forest-900/40 animate-slide-down">
              <div className="flex justify-between items-center text-xs font-semibold text-ink-800 dark:text-ink-200 mb-2">
                <span>Reading Progress</span>
                <span className="text-sm text-forest-700 dark:text-forest-400 font-bold">
                  {formData.progress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, progress: Number(e.target.value) }))
                }
                className="w-full"
              />
            </div>
          )}

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-forest-300 font-medium"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="flex-1 min-w-[120px] bg-transparent border-none text-xs text-ink-900 dark:text-ink-50 focus:outline-none"
              />
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
              Personal Notes & Thoughts
            </label>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Write your thoughts, observations or anything you want to remember about this book..."
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-50/50 dark:bg-ink-800/80 text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-forest-500 focus:outline-none text-sm transition-all resize-none"
            />
          </div>

          {/* Mark as Favourite Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="editIsFavourite"
              name="isFavourite"
              checked={formData.isFavourite}
              onChange={handleChange}
              className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-800"
            />
            <label htmlFor="editIsFavourite" className="text-xs font-medium text-ink-700 dark:text-ink-300 cursor-pointer">
              Mark as Favorite Book ❤️
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-parchment-200 dark:border-ink-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-parchment-50 bg-forest-800 hover:bg-forest-700 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
