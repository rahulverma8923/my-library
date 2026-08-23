import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookService } from '../services/bookService';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const BookContext = createContext(null);

const initialFilters = {
  search: '',
  status: 'all',
  category: 'all',
  language: 'all',
  author: 'all',
  isFavourite: false,
  sort: 'newest'
};

export const BookProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  
  const [filters, setFiltersState] = useState(initialFilters);
  const [viewMode, setViewModeState] = useState(() => {
    return localStorage.getItem('library_view_mode') || 'grid';
  });

  const [stats, setStats] = useState(null);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const setViewMode = (mode) => {
    localStorage.setItem('library_view_mode', mode);
    setViewModeState(mode);
  };

  const setFilter = (key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFiltersState(initialFilters);
  };

  // Fetch Books with active filters
  const fetchBooks = useCallback(async (customParams = {}) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const queryParams = { ...filters, ...customParams };
      const response = await bookService.getBooks(queryParams);
      setBooks(response.books || []);
      setTotalCount(response.totalCount || 0);
      if (response.filters) {
        setAvailableCategories(response.filters.categories || []);
        setAvailableLanguages(response.filters.languages || []);
        setAvailableAuthors(response.filters.authors || []);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
      showError(error.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters, showError]);

  // Fetch Dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setDashboardLoading(true);
    try {
      const [statsRes, readingRes, recentRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getCurrentlyReading(),
        dashboardService.getRecentBooks()
      ]);
      setStats(statsRes.stats);
      setCurrentlyReading(readingRes.books || []);
      setRecentBooks(recentRes.books || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  }, [isAuthenticated]);

  // Trigger book fetch on filter change
  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, filters.status, filters.category, filters.language, filters.author, filters.isFavourite, filters.sort, filters.search]);

  // Trigger dashboard fetch on auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  // CRUD & Interaction handlers
  const createBook = async (bookData) => {
    try {
      const res = await bookService.createBook(bookData);
      showSuccess('Book added to your library!');
      await fetchBooks();
      await fetchDashboardData();
      return res.book;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add book';
      showError(msg);
      throw error;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      const res = await bookService.updateBook(id, bookData);
      showSuccess('Book updated successfully');
      setBooks((prev) => prev.map((b) => (b._id === id ? res.book : b)));
      await fetchDashboardData();
      return res.book;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update book';
      showError(msg);
      throw error;
    }
  };

  const deleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      showSuccess('Book deleted from library');
      setBooks((prev) => prev.filter((b) => b._id !== id));
      await fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete book';
      showError(msg);
      throw error;
    }
  };

  const updateBookStatus = async (id, status, progress) => {
    try {
      const res = await bookService.updateStatus(id, status, progress);
      showSuccess(`Status changed to ${status}`);
      setBooks((prev) => prev.map((b) => (b._id === id ? res.book : b)));
      await fetchDashboardData();
      return res.book;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update status';
      showError(msg);
      throw error;
    }
  };

  const toggleFavourite = async (id) => {
    try {
      const res = await bookService.toggleFavourite(id);
      showSuccess(res.isFavourite ? 'Added to favourites ❤️' : 'Removed from favourites');
      setBooks((prev) => prev.map((b) => (b._id === id ? { ...b, isFavourite: res.isFavourite } : b)));
      await fetchDashboardData();
      return res.book;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update favourite';
      showError(msg);
      throw error;
    }
  };

  const importBulkBooks = async (booksToImport) => {
    try {
      const res = await bookService.importBulkBooks(booksToImport);
      showSuccess(res.message || `Successfully imported ${res.count} books!`);
      await fetchBooks();
      await fetchDashboardData();
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to import books';
      showError(msg);
      throw error;
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        totalCount,
        availableCategories,
        availableLanguages,
        availableAuthors,
        filters,
        viewMode,
        stats,
        currentlyReading,
        recentBooks,
        loading,
        dashboardLoading,
        fetchBooks,
        fetchDashboardData,
        createBook,
        updateBook,
        deleteBook,
        updateBookStatus,
        toggleFavourite,
        importBulkBooks,
        setFilter,
        resetFilters,
        setViewMode
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
