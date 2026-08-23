const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function testBulkImport() {
  console.log('🧪 Testing Batch Excel/CSV Book Import API...');

  // 1. Register test user
  const email = `importer-${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Batch Importer',
      email,
      password: 'Password123!'
    })
  });
  const regData = await regRes.json();
  assert.strictEqual(regRes.status, 201);
  const token = regData.token;
  console.log('✅ Registered test user for import testing.');

  // 2. Test importing multiple books
  const booksToImport = [
    {
      'Book Title': 'Siddhartha',
      'Author Name': 'Hermann Hesse',
      'Category': 'Philosophy',
      'Language': 'English',
      'Status': 'Finished',
      'Progress': 100,
      'Tags': 'Classic, Spiritual, Journey',
      'Notes': 'A profound quest for enlightenment.',
      'Favorite': 'Yes'
    },
    {
      'Book Title': 'Thinking, Fast and Slow',
      'Author Name': 'Daniel Kahneman',
      'Category': 'Psychology',
      'Language': 'English',
      'Status': 'Reading',
      'Progress': 35,
      'Tags': 'Behavioral Economics, Focus',
      'Notes': 'System 1 vs System 2 thinking.',
      'Favorite': 'No'
    },
    {
      'Book Title': 'Madhushala',
      'Author Name': 'Harivansh Rai Bachchan',
      'Category': 'Poetry',
      'Language': 'Hindi',
      'Status': 'Finished',
      'Progress': 100,
      'Tags': 'Indian Literature, Poetry',
      'Notes': 'Timeless metaphorical verses.',
      'Favorite': 'Yes'
    },
    {
      'Book Title': 'Dune',
      'Author Name': 'Frank Herbert',
      'Category': 'Science Fiction',
      'Language': 'English',
      'Status': 'Not Started',
      'Progress': 0,
      'Tags': 'Sci-Fi, Space Opera',
      'Notes': 'Desert planet Arrakis.',
      'Favorite': 'No'
    },
    // Row missing author (should be skipped gracefully)
    {
      'Book Title': 'Incomplete Book',
      'Author Name': '',
      'Category': 'Fiction'
    }
  ];

  const importRes = await fetch(`${BASE_URL}/books/import-bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ books: booksToImport })
  });

  const importData = await importRes.json();
  if (importRes.status !== 201) {
    console.error('Import failed with status:', importRes.status, importData);
  }
  assert.strictEqual(importRes.status, 201);
  assert.strictEqual(importData.count, 4);
  assert.strictEqual(importData.skippedCount, 1);
  console.log(`✅ Bulk import successfully inserted ${importData.count} books and skipped ${importData.skippedCount} invalid row.`);

  // 3. Verify user's books in library
  const getRes = await fetch(`${BASE_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const getData = await getRes.json();
  assert.strictEqual(getData.books.length, 4);

  const siddhartha = getData.books.find((b) => b.title === 'Siddhartha');
  assert.ok(siddhartha);
  assert.strictEqual(siddhartha.author, 'Hermann Hesse');
  assert.strictEqual(siddhartha.status, 'Finished');
  assert.strictEqual(siddhartha.isFavourite, true);
  assert.deepStrictEqual(siddhartha.tags, ['Classic', 'Spiritual', 'Journey']);

  const thinking = getData.books.find((b) => b.title === 'Thinking, Fast and Slow');
  assert.ok(thinking);
  assert.strictEqual(thinking.status, 'Reading');
  assert.strictEqual(thinking.progress, 35);

  console.log('✅ Verified all imported books, statuses, progress, tags, and favorites in user library!');
  console.log('\n🎉 BATCH EXCEL/CSV IMPORT TESTS PASSED COMPLETELY!\n');
}

testBulkImport().catch((err) => {
  console.error('❌ Import test failed:', err);
  process.exit(1);
});
