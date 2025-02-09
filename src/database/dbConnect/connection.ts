// Purpose: Connection to the MongoDB database.
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('No Mongodb URI provided');
}

// Caching the database connection to avoid multiple connections in serverless environments.
const cached = (global as any).mongoose || { conn: null, promise: null };

const dbConnect = async () => {
    // If connection is already established, return the cached connection.
    if (cached.conn) {
        return cached.conn;
    }

    try {
        // If the promise isn't set, establish a new connection and set it.
        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
                console.log('Connected to MongoDB');
                return mongooseInstance;
            });
        }

        // Await the promise and assign the result to cached.conn
        cached.conn = await cached.promise;

        // Persist the cached connection globally
        (global as any).mongoose = cached;

        return cached.conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export default dbConnect;
