import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const DB_NAME = process.env.DB_NAME;

let cached = global.mongooseConnection || { conn: null, promise: null };

export async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
        });
    }
    cached.conn = await cached.promise;
    global.mongooseConnection = cached;
    return cached.conn;
}
