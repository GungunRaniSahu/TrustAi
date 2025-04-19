require('dotenv').config();
const axios = require('axios');

// Moz API credentials
const MOZ_ACCESS_ID = process.env.MOZ_ACCESS_ID;
const MOZ_SECRET_KEY = process.env.MOZ_SECRET_KEY;

// URL of the website you want to track
const websiteURL = 'https://yourwebsite.com';

// Moz API URL
const apiUrl = 'https://lsapi.seomoz.com/v2/url_metrics';

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

    const domainAuthority = response.data.domain_authority;
    console.log(`Domain Authority for ${url}: ${domainAuthority}`);
  } catch (error) {
    console.error('Error fetching Domain Authority:', error);
  }
}

getDomainAuthority(websiteURL);
