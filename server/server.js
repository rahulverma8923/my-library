require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const { seedDatabase } = require('./utils/seed');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Connect to Database and auto-seed if empty
const initDB = async () => {
  await connectDB();
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Creating initial demo account and sample library...');
      await seedDatabase({ autoDisconnect: false });
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err.message);
  }
};
initDB();

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS with dynamic origin support for Vercel and local development
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded cover images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '📖 My Library API Server is live and healthy! 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      books: '/api/books',
      dashboard: '/api/dashboard'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'My Library API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`📖 My Library Backend Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
});

module.exports = { app, server };
