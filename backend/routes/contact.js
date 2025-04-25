const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

// Contact form submission
router.post('/', submitContact);

module.exports = router;
