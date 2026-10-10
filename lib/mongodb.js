import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Windows Node.js reliably resolves MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

function sanitizeMongoUri(rawUri) {
  if (!rawUri) return '';
  let uri = rawUri.trim();
  // Strip accidental angle brackets from password: user:<pass>@ -> user:pass@
  uri = uri.replace(/:<([^>]+)>/, ':$1');
  // Ensure default database name exists before query params: .net/? -> .net/orbit?
  if (uri.includes('.mongodb.net/?')) {
    uri = uri.replace('.mongodb.net/?', '.mongodb.net/orbit?');
  }
  return uri;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri || rawUri.trim().length === 0) {
    // Graceful fallback when MongoDB is not configured
    return null;
  }

  const MONGODB_URI = sanitizeMongoUri(rawUri);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e.message);
    return null;
  }

  return cached.conn;
}

export default connectMongo;
