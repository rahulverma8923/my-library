const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/my_library';
    
    // Set connection timeout to 4 seconds for fast fallback if local Mongo isn't active
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    
    console.log(`🌿 MongoDB Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed (${error.message}).`);
    console.log('🔄 Initializing in-memory MongoDB server fallback...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(`✨ In-Memory MongoDB Connected successfully: ${memoryUri}`);
    } catch (memErr) {
      console.error(`❌ In-Memory MongoDB also failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
