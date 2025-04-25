require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); // ✅ Login/Register routes
const PORT = process.env.PORT || 5004;

// Initialize express
const app = express();

// Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// ✅ Use Auth Routes
app.use('/api', authRoutes);

// ✅ Translation logic
async function translateText(text, sourceLang, targetLang) {
  try {
    console.log(`🔁 Sending translation request: ${text}`);
    const response = await axios.post(
      'http://localhost:5000/translate',
      {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📝 Response from LibreTranslate:', response.data);

    if (response.data && response.data.translatedText) {
      return { success: true, translatedText: response.data.translatedText };
    } else {
      throw new Error('Invalid response from LibreTranslate');
    }

  } catch (error) {
    console.error('❌ Translation error:', error.message || error);
    return { success: false, error: 'Translation failed. Please try again later.' };
  }
}

// ✅ Translate endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ success: false, error: 'Missing input fields' });
    }

    const result = await translateText(text, sourceLang, targetLang);
    return res.json(result);

  } catch (err) {
    console.error('Translation endpoint error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🌐 Global Error Handler:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;

