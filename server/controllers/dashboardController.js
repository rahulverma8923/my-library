const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBooks,
      readingCount,
      finishedCount,
      notStartedCount,
      favouriteCount,
      finishedThisYear,
      finishedThisMonth,
      addedThisMonth
    ] = await Promise.all([
      Book.countDocuments({ userId }),
      Book.countDocuments({ userId, status: 'Reading' }),
      Book.countDocuments({ userId, status: 'Finished' }),
      Book.countDocuments({ userId, status: 'Not Started' }),
      Book.countDocuments({ userId, isFavourite: true }),
      Book.countDocuments({
        userId,
        status: 'Finished',
        finishedAt: { $gte: startOfYear }
      }),
      Book.countDocuments({
        userId,
        status: 'Finished',
        finishedAt: { $gte: startOfMonth }
      }),
      Book.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth }
      })
    ]);

    const readingGoal = user.readingGoal || 20;
    // Calculate goal progress based on books finished this year, fallback to all finished if dates weren't tracked
    const goalCompleted = finishedThisYear > 0 ? finishedThisYear : finishedCount;
    const goalPercentage = Math.min(100, Math.round((goalCompleted / readingGoal) * 100));
    const goalRemaining = Math.max(0, readingGoal - goalCompleted);

    res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        readingCount,
        finishedCount,
        notStartedCount,
        favouriteCount,
        finishedThisMonth,
        addedThisMonth,
        readingGoal: {
          year: currentYear,
          target: readingGoal,
          completed: goalCompleted,
          remaining: goalRemaining,
          percentage: goalPercentage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently reading books
// @route   GET /api/dashboard/reading
// @access  Private
const getCurrentlyReading = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const readingBooks = await Book.find({
      userId,
      status: 'Reading'
    })
      .sort({ updatedAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: readingBooks.length,
      books: readingBooks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recently added books
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentBooks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const recentBooks = await Book.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: recentBooks.length,
      books: recentBooks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed reading analytics and activity
// @route   GET /api/dashboard/activity
// @access  Private
const getReadingActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allBooks = await Book.find({ userId }).select(
      'category language status progress finishedAt createdAt isFavourite'
    );

    // Compute Category breakdown
    const categoryMap = {};
    const languageMap = {};

    allBooks.forEach((book) => {
      if (book.category) {
        categoryMap[book.category] = (categoryMap[book.category] || 0) + 1;
      }
      if (book.language) {
        languageMap[book.language] = (languageMap[book.language] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topLanguages = Object.entries(languageMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Compute monthly finished activity for last 6 months
    const monthlyActivity = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });

      const finishedInMonth = allBooks.filter((b) => {
        if (!b.finishedAt) return false;
        const d = new Date(b.finishedAt);
        return d >= monthDate && d < nextMonthDate;
      }).length;

      const addedInMonth = allBooks.filter((b) => {
        const d = new Date(b.createdAt);
        return d >= monthDate && d < nextMonthDate;
      }).length;

      monthlyActivity.push({
        month: monthName,
        finished: finishedInMonth,
        added: addedInMonth
      });
    }

    res.status(200).json({
      success: true,
      analytics: {
        topCategories,
        topLanguages,
        monthlyActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getCurrentlyReading,
  getRecentBooks,
  getReadingActivity
};
