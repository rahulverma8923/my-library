const mongoose = require('mongoose');

let mongod = null;
let isInMemory = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/my_library';
    
    // Set connection timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 6000
    });
    
    isInMemory = false;
    console.log(`🌿 MongoDB Connected to: ${mongoose.connection.host}/${mongoose.connection.name} (Permanent Storage)`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection to MONGODB_URI failed (${error.message}).`);
    console.log('🔄 Initializing in-memory MongoDB server fallback (Data will NOT persist across restarts)...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      
      await mongoose.connect(memoryUri);
      isInMemory = true;
      console.log(`⚠️ Running on In-Memory MongoDB (TEMPORARY RAM STORAGE): ${memoryUri}`);
    } catch (memErr) {
      console.error(`❌ In-Memory MongoDB also failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

const getDbInfo = () => {
  return {
    isInMemory,
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    host: mongoose.connection.host || 'unknown',
    storageType: isInMemory ? 'Temporary RAM (Wipes on restart)' : 'Permanent MongoDB Cloud'
  };
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

module.exports = { connectDB, disconnectDB, getDbInfo };

