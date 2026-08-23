require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');
const sampleBooks = require('./seedData');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing demo records...');

    const demoEmail = 'demo@mylibrary.com';
    let user = await User.findOne({ email: demoEmail });

    if (user) {
      // Clear previous books for demo user
      await Book.deleteMany({ userId: user._id });
      console.log('Cleared existing books for demo user.');
    } else {
      user = await User.create({
        name: 'Rahul Verma',
        email: demoEmail,
        password: 'Password123!',
        preferredLanguage: 'English',
        readingGoal: 20
      });
      console.log('Created demo user: demo@mylibrary.com / Password123!');
    }

    // Attach userId to all sample books
    const booksToInsert = sampleBooks.map((book) => ({
      ...book,
      userId: user._id
    }));

    await Book.insertMany(booksToInsert);
    console.log(`📚 Successfully inserted ${booksToInsert.length} sample books into demo user's library!`);

    console.log('🎉 Database seeding completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
