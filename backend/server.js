require('dotenv').config();
const uri = process.env.MONGODB_URI;
const app = require('./app');
// const connectDB = require('./config/db');

const PORT = process.env.PORT || 5004;
console.log('Using port:', PORT);
console.log('MongoDB URI:', uri);

// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`); // Fix: Wrap the message inside backticks
//     });
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//   });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`); // Fix: Wrap the message inside backticks
});
