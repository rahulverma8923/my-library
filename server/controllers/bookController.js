const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// @desc    Get all books for authenticated user with search, filter, and sort
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      search,
      status,
      category,
      language,
      author,
      isFavourite,
      sort = 'newest',
      page = 1,
      limit = 100
    } = req.query;

    // Base query scoped to current user
    const query = { userId };

    // Search functionality across title, author, category, language, and tags
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { category: searchRegex },
        { language: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Filter by reading status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by language
    if (language && language !== 'all') {
      query.language = language;
    }

    // Filter by author
    if (author && author !== 'all') {
      query.author = new RegExp(`^${author.trim()}$`, 'i');
    }

    // Filter by favourite
    if (isFavourite === 'true' || isFavourite === true) {
      query.isFavourite = true;
    }

    // Sorting configuration
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'recently_updated':
        sortOptions = { updatedAt: -1 };
        break;
      case 'title_asc':
        sortOptions = { title: 1 };
        break;
      case 'title_desc':
        sortOptions = { title: -1 };
        break;
      case 'author_asc':
        sortOptions = { author: 1 };
        break;
      case 'author_desc':
        sortOptions = { author: -1 };
        break;
      case 'progress_desc':
        sortOptions = { progress: -1, updatedAt: -1 };
        break;
      case 'progress_asc':
        sortOptions = { progress: 1, updatedAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    // Execute queries in parallel for efficiency
    const [books, totalCount, allUserBooks] = await Promise.all([
      Book.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Book.countDocuments(query),
      Book.find({ userId }).select('category language author isFavourite status')
    ]);

    // Extract dynamic filters available in user's library
    const categories = [...new Set(allUserBooks.map((b) => b.category).filter(Boolean))].sort();
    const languages = [...new Set(allUserBooks.map((b) => b.language).filter(Boolean))].sort();
    const authors = [...new Set(allUserBooks.map((b) => b.author).filter(Boolean))].sort();

    res.status(200).json({
      success: true,
      count: books.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      filters: {
        categories,
        languages,
        authors
      },
      books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or you do not have permission to view it'
      });
    }

    res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      coverImage,
      language,
      category,
      status,
      progress,
      notes,
      isFavourite,
      tags,
      startedAt,
      finishedAt
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both book title and author'
      });
    }

    // Prepare tags as array if string was passed
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const bookData = {
      userId: req.user._id,
      title: title.trim(),
      author: author.trim(),
      coverImage: coverImage || '',
      language: language ? language.trim() : 'English',
      category: category ? category.trim() : 'Fiction',
      status: status || 'Not Started',
      progress: progress !== undefined ? Number(progress) : (status === 'Finished' ? 100 : 0),
      notes: notes || '',
      isFavourite: Boolean(isFavourite),
      tags: Array.isArray(parsedTags) ? parsedTags : [],
      startedAt: startedAt || (status === 'Reading' ? new Date() : null),
      finishedAt: finishedAt || (status === 'Finished' ? new Date() : null)
    };

    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      message: 'Book added to your library successfully',
      book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or you do not have permission to update it'
      });
    }

    const {
      title,
      author,
      coverImage,
      language,
      category,
      status,
      progress,
      notes,
      isFavourite,
      tags,
      startedAt,
      finishedAt
    } = req.body;

    if (title !== undefined) book.title = title.trim();
    if (author !== undefined) book.author = author.trim();
    if (coverImage !== undefined) book.coverImage = coverImage;
    if (language !== undefined) book.language = language.trim();
    if (category !== undefined) book.category = category.trim();
    if (status !== undefined) book.status = status;
    if (progress !== undefined) book.progress = Number(progress);
    if (notes !== undefined) book.notes = notes;
    if (isFavourite !== undefined) book.isFavourite = Boolean(isFavourite);
    if (tags !== undefined) {
      book.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
    }
    if (startedAt !== undefined) book.startedAt = startedAt;
    if (finishedAt !== undefined) book.finishedAt = finishedAt;

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or you do not have permission to delete it'
      });
    }

    // Clean up local uploaded cover file if exists
    if (book.coverImage && book.coverImage.startsWith('/uploads/covers/')) {
      const filePath = path.join(__dirname, '..', book.coverImage);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Failed to delete cover file:', e.message);
        }
      }
    }

    await Book.deleteOne({ _id: book._id });

    res.status(200).json({
      success: true,
      message: 'Book removed from your library'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update reading status and progress
// @route   PATCH /api/books/:id/status
// @access  Private
const updateStatus = async (req, res, next) => {
  try {
    const { status, progress } = req.body;

    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (status) book.status = status;
    if (progress !== undefined) book.progress = Number(progress);

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: `Reading status updated to "${updatedBook.status}"`,
      book: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favourite status
// @route   PATCH /api/books/:id/favourite
// @access  Private
const toggleFavourite = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book.isFavourite = !book.isFavourite;
    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: updatedBook.isFavourite ? 'Added to favourites' : 'Removed from favourites',
      isFavourite: updatedBook.isFavourite,
      book: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload book cover image
// @route   POST /api/books/upload-cover
// @access  Private
const uploadBookCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload'
      });
    }

    const relativeUrl = `/uploads/covers/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Cover image uploaded successfully',
      imageUrl: relativeUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import multiple books in batch (e.g. from Excel/CSV)
// @route   POST /api/books/import-bulk
// @access  Private
const importBulkBooks = async (req, res, next) => {
  try {
    const { books } = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of books to import'
      });
    }

    const userId = req.user._id;
    const validBooks = [];
    const skipped = [];

    for (let i = 0; i < books.length; i++) {
      const item = books[i];
      const title = item.title || item.Title || item['Book Title'] || item['Book Name'];
      const author = item.author || item.Author || item['Author Name'];

      if (!title || !author || !String(title).trim() || !String(author).trim()) {
        skipped.push({ row: i + 1, reason: 'Missing title or author' });
        continue;
      }

      let category = item.category || item.Category || item.Genre || 'Fiction';
      let language = item.language || item.Language || 'English';
      let status = item.status || item.Status || 'Not Started';

      // Normalize status
      const statusLower = String(status).toLowerCase().trim();
      if (statusLower === 'reading' || statusLower.includes('reading') || statusLower.includes('progress') || statusLower.includes('in progress') || statusLower.includes('current')) {
        status = 'Reading';
      } else if (statusLower === 'finished' || statusLower.includes('finish') || statusLower.includes('done') || statusLower.includes('completed') || statusLower === 'read') {
        status = 'Finished';
      } else {
        status = 'Not Started';
      }

      let progress = 0;
      if (status === 'Finished') {
        progress = 100;
      } else if (status === 'Reading') {
        const rawProgress = item.progress !== undefined ? item.progress : item.Progress;
        progress = Number(rawProgress) || 50;
        progress = Math.min(100, Math.max(0, progress));
      }

      // Handle tags
      let tags = [];
      const rawTags = item.tags || item.Tags || item.Tag;
      if (Array.isArray(rawTags)) {
        tags = rawTags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof rawTags === 'string') {
        tags = rawTags.split(/[,;|]/).map((t) => t.trim()).filter(Boolean);
      }

      const notes = item.notes || item.Notes || item.Review || item.Comments || '';
      const rawFav = item.isFavourite !== undefined 
        ? item.isFavourite 
        : (item.isFavorite !== undefined ? item.isFavorite : (item.Favorite !== undefined ? item.Favorite : item.Favourite));
      const isFavourite = rawFav === true || String(rawFav).toLowerCase() === 'true' || String(rawFav).toLowerCase() === 'yes' || String(rawFav) === '1';

      validBooks.push({
        userId,
        title: String(title).trim(),
        author: String(author).trim(),
        coverImage: item.coverImage || item.Cover || '',
        category: String(category).trim(),
        language: String(language).trim(),
        status,
        progress,
        notes: String(notes),
        isFavourite,
        tags,
        startedAt: status === 'Reading' ? new Date() : null,
        finishedAt: status === 'Finished' ? new Date() : null
      });
    }

    if (validBooks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid books found in the import payload. Make sure Title and Author columns exist.',
        skipped
      });
    }

    const insertedBooks = await Book.insertMany(validBooks);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${insertedBooks.length} books into your library!`,
      count: insertedBooks.length,
      skippedCount: skipped.length,
      skipped
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateStatus,
  toggleFavourite,
  uploadBookCover,
  importBulkBooks
};

