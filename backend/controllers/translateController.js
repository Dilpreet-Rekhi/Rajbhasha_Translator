const express = require('express');
const router = express.Router();
const axios = require('axios');
const Translation = require('../models/Translation');

router.post('/', async (req, res) => {
  const { text, domain = 'common', user = null } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required and should be a non-empty string.' });
  }

  try {
    const response = await axios.post('http://localhost:5000/translate', {
      q: text,
      source: 'en',
      target: 'hi',
      format: 'text'
    },
    {
      headers: {
        'Content-Type' : 'application/json'
      }
    }
    );

    if (response.status !== 200 || !response.data || !response.data.translatedText) {
      return res.status(500).json({ error: 'Error from translation service.' });
    }

    const translatedText = response.data.translatedText;

    const translation = new Translation({
      originalText: text,
      translatedText,
      domain,
      user,
      ipAddress: req.ip
    });

    await translation.save();

    res.json({ translatedText });

  } catch (error) {
    console.error('Translation error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    res.status(500).json({ error: 'Translation failed. Please try again later.' });
  }
});

module.exports = router;
