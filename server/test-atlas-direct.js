const mongoose = require('mongoose');

const uri = "mongodb+srv://rv783060_db_user:yYGVOCSWUmwdkVEW@cluster0.k3rzpca.mongodb.net/my_library?retryWrites=true&w=majority";

async function testAtlas() {
  console.log('Testing Atlas URI connection...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas successfully:', mongoose.connection.host);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testAtlas();
