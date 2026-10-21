// ✅ Sahi (App Router ke liye)
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};

process.on('warning', (warning) => {
  console.error('=== EXACT ERROR LOCATION ===');
  console.error(warning.stack);
});

export default connectDB;