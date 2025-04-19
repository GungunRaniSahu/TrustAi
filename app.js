const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

// Update the path to the correct location
const sslController = require('./backend/controllers/sslController'); // Correct path

// Middleware (optional, for logging or parsing requests)
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // For URL encoded bodies

// Moz API credentials from .env file
const MOZ_ACCESS_ID = process.env.MOZ_ACCESS_ID;
const MOZ_SECRET_KEY = process.env.MOZ_SECRET_KEY;

// Moz API URL
const apiUrl = 'https://lsapi.seomoz.com/v2/url_metrics';

// Function to get Domain Authority (DA)
async function getDomainAuthority(url) {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${MOZ_ACCESS_ID}`,
      },
      params: {
        url: url,
      },
    });
    return response.data.domain_authority;
  } catch (error) {
    console.error('Error fetching Domain Authority:', error);
    return null;
  }
}

// Define Routes

// SSL check route, with a domain parameter
app.get('/check-ssl/:domain', sslController.checkSSL);

// New route to check Domain Authority
app.get('/check-da/:domain', async (req, res) => {
  const domain = req.params.domain;
  const da = await getDomainAuthority(domain);

  if (da !== null) {
    res.json({
      domain: domain,
      domain_authority: da
    });
  } else {
    res.status(500).json({
      error: 'Unable to fetch Domain Authority.'
    });
  }
});

// You can add other routes here if needed, for example:
app.get('/', (req, res) => {
  res.send('Welcome to the SSL and DA Checker!');
});

// Export app so it can be used in server.js
module.exports = app;
