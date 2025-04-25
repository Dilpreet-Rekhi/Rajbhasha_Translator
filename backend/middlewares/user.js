const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  REVIEWER: 'reviewer'
};

const userSchema = new mongoose.Schema({
  officialId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[A-Z]{2}\d{6}$/, 'Invalid official ID format']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  department: {
    type: String,
    required: true,
    enum: ['education', 'healthcare', 'legal', 'administration']
  },
  role: {
    type: String,
    enum: [ROLES.USER, ROLES.ADMIN], // or Object.values(ROLES)
    default: ROLES.USER
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
