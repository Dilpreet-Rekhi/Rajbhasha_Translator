const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const dbURI = process.env.MONGODB_URI;

    // Check if the URI is set in the environment variables
    if (!dbURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Ensures automatic index creation
      useFindAndModify: false, // Avoids deprecation warnings
    });

    // Log success message if connected
    console.log('MongoDB connected successfully');
  } catch (err) {
    // Log the error if the connection fails
    console.error('MongoDB connection error:', err.message);

    // Optionally log to a custom logger or error tracking service
    // logger.error('MongoDB connection error:', err);

    // Exit the process if MongoDB connection fails
    process.exit(1); // Exit code 1 indicates failure
  }
};

// Export the connectDB function so it can be used in other files (like app.js or server.js)
module.exports = connectDB;
