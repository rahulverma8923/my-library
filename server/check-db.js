require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');

async function checkDatabase() {
  console.log('🔍 Checking Database Status...\n');
  await connectDB();

  const users = await User.find({}).select('name email preferredLanguage readingGoal createdAt');
  console.log(`👤 Total Users Found: ${users.length}`);
  users.forEach((u, i) => {
    console.log(`  ${i + 1}. Name: "${u.name}", Email: "${u.email}", Created: ${u.createdAt}`);
  });

  const books = await Book.find({}).select('title author category language status progress isFavourite userId');
  console.log(`\n📚 Total Books Found: ${books.length}`);
  books.slice(0, 15).forEach((b, i) => {
    console.log(`  ${i + 1}. "${b.title}" by ${b.author} [${b.status} - ${b.progress}%] (Category: ${b.category})`);
  });
  if (books.length > 15) {
    console.log(`  ... and ${books.length - 15} more books.`);
  }

  await disconnectDB();
  process.exit(0);
}

checkDatabase().catch((err) => {
  console.error('Error checking DB:', err);
  process.exit(1);
});
