import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Library as LibraryIcon, Search, SlidersHorizontal, BookPlus, FileSpreadsheet } from 'lucide-react';
import { SearchBar } from '../components/library/SearchBar';
import { FilterPanel } from '../components/library/FilterPanel';
import { SortDropdown } from '../components/library/SortDropdown';
import { ViewToggle } from '../components/library/ViewToggle';
import { BookGrid } from '../components/books/BookGrid';
import { EditBookModal } from '../components/books/EditBookModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonGrid } from '../components/common/SkeletonLoader';
import { useBooks } from '../context/BookContext';

export const LibraryPage = () => {
  const { openAddBookModal, openImportModal } = useOutletContext();
  const { books, totalCount, loading, viewMode, deleteBook, filters, resetFilters } = useBooks();

  const [selectedBookForEdit, setSelectedBookForEdit] = useState(null);
  const [selectedBookForDelete, setSelectedBookForDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedBookForDelete) return;
    setDeleteLoading(true);
    try {
      await deleteBook(selectedBookForDelete._id);
      setSelectedBookForDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const isFiltering =
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.language !== 'all' ||
    filters.author !== 'all' ||
    filters.isFavourite ||
    Boolean(filters.search);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-parchment-200 dark:border-ink-800">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-ink-50">
            My Library
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1">
            {totalCount} {totalCount === 1 ? 'book' : 'books'} in your collection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={openImportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-200 font-semibold text-xs shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import Excel</span>
          </button>

          <button
            type="button"
            onClick={openAddBookModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-700 text-parchment-50 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Search & View Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <SortDropdown />
          <ViewToggle />
        </div>
      </div>

      {/* Filter Tabs & Facets */}
      <FilterPanel />

      {/* Book Grid / List Content */}
      <div className="pt-2">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : books.length > 0 ? (
          <BookGrid
            books={books}
            viewMode={viewMode}
            onEdit={(book) => setSelectedBookForEdit(book)}
            onDelete={(book) => setSelectedBookForDelete(book)}
          />
        ) : isFiltering ? (
          <EmptyState
            icon={Search}
            title="No books match your criteria"
            description="Try changing your search term or clearing some filters to explore your shelves."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        ) : (
          <EmptyState
            icon={BookPlus}
            title="Your library is waiting for its first story"
            description="Start building your personal sanctuary by adding your first book."
            actionLabel="+ Add Your First Book"
            onAction={openAddBookModal}
          />
        )}
      </div>

      {/* Edit Book Modal */}
      <EditBookModal
        book={selectedBookForEdit}
        isOpen={Boolean(selectedBookForEdit)}
        onClose={() => setSelectedBookForEdit(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(selectedBookForDelete)}
        onClose={() => setSelectedBookForDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this book?"
        message={`Are you sure you want to remove "${selectedBookForDelete?.title}" from your library? This action cannot be undone.`}
        confirmText="Delete Book"
        isLoading={deleteLoading}
      />
    </div>
  );
};
