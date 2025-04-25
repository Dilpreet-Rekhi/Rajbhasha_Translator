require('dotenv').config();
const axios = require('axios');

// Function to interact with the LibreTranslate API
const translateWithLibreTranslate = async (text, targetLang = 'hi', sourceLang = 'en') => {
  try {
    const apiUrl = process.env.LIBRE_TRANSLATE_API_URL || 'https://libretranslate.com/translate'; // Use env variable for flexibility

    // Sending request to the LibreTranslate API
    const response = await axios.post(apiUrl, {
      q: text,
      source_language: sourceLang,
      target_language: targetLang
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log("Translation Response:", response.data);  // Log the response for debugging

    return response.data.translatedText;  // Ensure this matches the actual response structure
  } catch (error) {
    console.error('Translation API error:', error);
    throw error;  // Throw error to fallback if API fails
  }
};

// Fallback mock translation if the API fails
const mockTranslate = (text, domain = 'common') => {
  const translations = {
    common: "यह एक सामान्य प्रशासनिक पाठ का अनुवाद है।",
    education: "शिक्षा क्षेत्र के लिए विशेष अनुवाद।",
    healthcare: "स्वास्थ्य सेवा संबंधी शब्दावली के साथ अनुवाद।",
    legal: "कानूनी दस्तावेज़ के लिए प्रमाणित अनुवाद।"
  };

  console.warn(`Fallback translation for domain '${domain}'`);

  return translations[domain] || translations.common;
};

// Main translation function
exports.translateText = async (text, domain = 'common') => {
  try {
    console.log(`Attempting to translate text in domain '${domain}': ${text}`);

    return await translateWithLibreTranslate(text);
  } catch (err) {
    console.error('Translation error (using fallback):', err);
    return mockTranslate(text, domain);  // Return mock translation if API fails
  }
};
