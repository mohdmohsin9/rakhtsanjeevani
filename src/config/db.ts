import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri) {
      console.warn(
        'MongoDB URI not found in env (MONGO_URI / MONGODB_URI). Skipping DB connection.'
      );
      return;
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`);
    } else {
      console.error('MongoDB connection error: unknown error');
    }
    process.exit(1);
  }
};

export default connectDB;
