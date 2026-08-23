import api from './api';

export const bookService = {
  async getBooks(params = {}) {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async createBook(bookData) {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  async updateBook(id, bookData) {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  async updateStatus(id, status, progress) {
    const response = await api.patch(`/books/${id}/status`, { status, progress });
    return response.data;
  },

  async toggleFavourite(id) {
    const response = await api.patch(`/books/${id}/favourite`);
    return response.data;
  },

  async uploadCover(file) {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await api.post('/books/upload-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async importBulkBooks(books) {
    const response = await api.post('/books/import-bulk', { books });
    return response.data;
  }
};

