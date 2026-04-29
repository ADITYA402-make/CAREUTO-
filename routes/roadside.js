// routes/roadside.js
const express = require('express');
const router = express.Router();
const { showRoadside, requestHelp } = require('../controllers/roadsideController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', showRoadside);
router.post('/request', requestHelp);

module.exports = router;
