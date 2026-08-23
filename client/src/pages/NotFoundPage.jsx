import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, ArrowLeft, Library } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400 flex items-center justify-center mb-6 shadow-sm">
        <BookX className="w-10 h-10" />
      </div>

      <span className="font-serif font-bold text-6xl text-forest-900 dark:text-forest-300 block mb-2">
        404
      </span>

      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-ink-50 mb-3">
        Looks like this page got lost between the shelves.
      </h1>

      <p className="text-sm text-ink-500 dark:text-ink-400 max-w-md mb-8 leading-relaxed">
        The literary passage you are looking for might have been moved, removed, or never existed in this sanctuary.
      </p>

      <Link
        to="/library"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-700 text-parchment-50 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Library className="w-4 h-4" />
        <span>Back to Library</span>
      </Link>
    </div>
  );
};
