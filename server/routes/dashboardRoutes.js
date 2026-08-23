const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCurrentlyReading,
  getRecentBooks,
  getReadingActivity
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/reading', getCurrentlyReading);
router.get('/recent', getRecentBooks);
router.get('/activity', getReadingActivity);

module.exports = router;
