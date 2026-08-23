const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateStatus,
  toggleFavourite,
  uploadBookCover,
  importBulkBooks
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { uploadCover } = require('../middleware/uploadMiddleware');

// All book routes are protected
router.use(protect);

router.post('/import-bulk', importBulkBooks);

router.route('/')
  .get(getBooks)
  .post(createBook);

router.post('/upload-cover', uploadCover.single('cover'), uploadBookCover);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

router.patch('/:id/status', updateStatus);
router.patch('/:id/favourite', toggleFavourite);

module.exports = router;
