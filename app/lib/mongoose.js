import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongooseConnection || { conn: null, promise: null };

export async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(`mongodb+srv://harshdodi:fJDOL411NFwz1PkQ@booking-travelxp.9cmrgch.mongodb.net/?retryWrites=true&w=majority&appName=booking-travelxp`, {
            dbName: 'booking-section-travelxp',
        });
    }
    cached.conn = await cached.promise;
    global.mongooseConnection = cached;
    return cached.conn;
}
