// backend/routes/sslRoutes.js
const express = require('express');
const router = express.Router();
const sslController = require('../controllers/sslController');

router.get('/check-ssl/:domain', sslController.checkSSL);

module.exports = router;
