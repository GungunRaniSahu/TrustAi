// app.js
const express = require('express');
const app = express();

// Update the path to the correct location
const sslController = require('./backend/controllers/sslController'); // Correct path

// Middleware (optional, for logging or parsing requests)
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // For URL encoded bodies

// Define Routes

// SSL check route, with a domain parameter
app.get('/check-ssl/:domain', sslController.checkSSL);

// You can add other routes here if needed, for example:
app.get('/', (req, res) => {
  res.send('Welcome to the SSL Checker!');
});

// Export app so it can be used in server.js
module.exports = app;
