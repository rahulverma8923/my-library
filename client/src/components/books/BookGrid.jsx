import React from 'react';
import { BookCard } from './BookCard';
import { BookListRow } from './BookListRow';

export const BookGrid = ({ books = [], viewMode = 'grid', onEdit, onDelete }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {books.map((book) => (
          <BookListRow
            key={book._id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
