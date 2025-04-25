const mongoose = require('mongoose');
// const { DOMAINS } = require('../config/constants');

const translationSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true,
    maxlength: 5000
  },
  translatedText: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: DOMAINS,
    default: 'common'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Translation', translationSchema);