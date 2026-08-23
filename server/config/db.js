const mongoose = require('mongoose');

let mongod = null;
let isInMemory = false;
let lastDbError = null;

const DEFAULT_ATLAS_URI =
  'mongodb+srv://rv783060_db_user:yYGVOCSWUmwdkVEW@cluster0.k3rzpca.mongodb.net/my_library?retryWrites=true&w=majority';

const tryConnectCloud = async () => {
  let rawUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGODB_URL ||
    DEFAULT_ATLAS_URI;

  let mongoUri = rawUri ? rawUri.trim().replace(/^["']|["']$/g, '') : DEFAULT_ATLAS_URI;

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000
  });

  isInMemory = false;
  lastDbError = null;
  console.log(`🌿 MongoDB Connected to: ${mongoose.connection.host}/${mongoose.connection.name} (Permanent Storage)`);

  if (mongod) {
    try {
      await mongod.stop();
      mongod = null;
    } catch (e) {
      // ignore
    }
  }
};

const connectDB = async () => {
  try {
    await tryConnectCloud();
  } catch (error) {
    lastDbError = error.message;
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

const reconnectToCloud = async () => {
  if (!isInMemory && mongoose.connection.readyState === 1) {
    return { success: true, message: 'Already connected to MongoDB Atlas Cloud!' };
  }
  try {
    await mongoose.disconnect();
    await tryConnectCloud();
    return { success: true, message: 'Successfully connected to MongoDB Atlas Cloud! 🌿' };
  } catch (err) {
    lastDbError = err.message;
    // reconnect back to memory if cloud fails
    if (mongod) {
      await mongoose.connect(mongod.getUri());
      isInMemory = true;
    }
    return { success: false, error: err.message };
  }
};

const getDbInfo = () => {
  return {
    isInMemory,
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    host: mongoose.connection.host || 'unknown',
    storageType: isInMemory ? 'Temporary RAM (Wipes on restart)' : 'Permanent MongoDB Cloud',
    lastError: lastDbError
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

module.exports = { connectDB, disconnectDB, getDbInfo, reconnectToCloud };


