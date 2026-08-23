const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Full-Stack End-to-End API Test Suite...');

  // 1. Health check
  console.log('\n1. Testing Health Endpoint...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthData.status, 'online');
  console.log('✅ Health check passed.');

  // 2. Register new user
  console.log('\n2. Testing User Registration...');
  const testUser = {
    name: 'Arundhati Roy',
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
    preferredLanguage: 'English'
  };

  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  assert.strictEqual(regRes.status, 201);
  assert.ok(regData.token);
  assert.strictEqual(regData.user.name, testUser.name);
  console.log('✅ Registration passed. Token generated.');
  const userAToken = regData.token;

  // 3. Login
  console.log('\n3. Testing User Login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginRes.status, 200);
  assert.ok(loginData.token);
  console.log('✅ Login passed.');

  // 4. Get Current User Profile (GET /auth/me)
  console.log('\n4. Testing GET /auth/me...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  const meData = await meRes.json();
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meData.user.email, testUser.email);
  console.log('✅ GET /auth/me passed.');

  // 5. Update Profile & Reading Goal
  console.log('\n5. Testing Profile & Goal Update...');
  const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ readingGoal: 25, preferredLanguage: 'Hindi' })
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateData.user.readingGoal, 25);
  assert.strictEqual(updateData.user.preferredLanguage, 'Hindi');
  console.log('✅ Profile update passed.');

  // 6. Create Book
  console.log('\n6. Testing Create Book (POST /books)...');
  const newBook = {
    title: 'The God of Small Things',
    author: 'Arundhati Roy',
    category: 'Fiction',
    language: 'English',
    status: 'Reading',
    progress: 45,
    tags: ['Indian Literature', 'Classic', 'Booker Prize'],
    notes: 'A lyrical and tragic story of fraternal twins Rahel and Estha in Kerala.',
    isFavourite: true
  };

  const createRes = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify(newBook)
  });
  const createData = await createRes.json();
  assert.strictEqual(createRes.status, 201);
  assert.strictEqual(createData.book.title, newBook.title);
  assert.strictEqual(createData.book.progress, 45);
  assert.strictEqual(createData.book.isFavourite, true);
  console.log('✅ Book creation passed.');
  const bookId = createData.book._id;

  // 7. Get Books & Filter/Search
  console.log('\n7. Testing GET /books and Search & Filter...');
  const searchRes = await fetch(`${BASE_URL}/books?search=Small`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  const searchData = await searchRes.json();
  assert.strictEqual(searchRes.status, 200);
  assert.strictEqual(searchData.books.length, 1);
  assert.strictEqual(searchData.books[0].title, 'The God of Small Things');
  console.log('✅ Search & filter passed.');

  // 8. Update Reading Status & Progress (PATCH /books/:id/status)
  console.log('\n8. Testing PATCH /books/:id/status...');
  const statusRes = await fetch(`${BASE_URL}/books/${bookId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAToken}`
    },
    body: JSON.stringify({ status: 'Finished' })
  });
  const statusData = await statusRes.json();
  assert.strictEqual(statusRes.status, 200);
  assert.strictEqual(statusData.book.status, 'Finished');
  assert.strictEqual(statusData.book.progress, 100);
  assert.ok(statusData.book.finishedAt);
  console.log('✅ Reading status & auto-progress hook passed.');

  // 9. Toggle Favourite (PATCH /books/:id/favourite)
  console.log('\n9. Testing Toggle Favourite...');
  const favRes = await fetch(`${BASE_URL}/books/${bookId}/favourite`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  const favData = await favRes.json();
  assert.strictEqual(favRes.status, 200);
  assert.strictEqual(favData.isFavourite, false);
  console.log('✅ Toggle favourite passed.');

  // 10. Dashboard Stats
  console.log('\n10. Testing Dashboard Analytics...');
  const statsRes = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  const statsData = await statsRes.json();
  assert.strictEqual(statsRes.status, 200);
  assert.strictEqual(statsData.stats.totalBooks, 1);
  assert.strictEqual(statsData.stats.finishedCount, 1);
  assert.strictEqual(statsData.stats.readingGoal.target, 25);
  console.log('✅ Dashboard analytics passed.');

  // 11. Test User Privacy & Data Isolation
  console.log('\n11. Testing User Privacy & Isolation...');
  // Create User B
  const userBRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'User B',
      email: `userB-${Date.now()}@example.com`,
      password: 'Password123!'
    })
  });
  const userBData = await userBRes.json();
  const userBToken = userBData.token;

  // User B tries to view User A's book
  const unauthorizedRes = await fetch(`${BASE_URL}/books/${bookId}`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });
  assert.strictEqual(unauthorizedRes.status, 404);

  // User B views own library (should be 0 books)
  const userBBooksRes = await fetch(`${BASE_URL}/books`, {
    headers: { Authorization: `Bearer ${userBToken}` }
  });
  const userBBooksData = await userBBooksRes.json();
  assert.strictEqual(userBBooksData.books.length, 0);
  console.log('✅ User Privacy & Isolation verified 100%! User B cannot see User A books.');

  // 12. Delete Book
  console.log('\n12. Testing Delete Book (DELETE /books/:id)...');
  const deleteRes = await fetch(`${BASE_URL}/books/${bookId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userAToken}` }
  });
  assert.strictEqual(deleteRes.status, 200);
  console.log('✅ Book deletion passed.');

  console.log('\n🎉 ALL 12 END-TO-END TEST SUITES PASSED FLAWLESSLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
