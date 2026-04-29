// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { showDashboard } = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, showDashboard);

module.exports = router;
