// routes/services.js
const express = require('express');
const router = express.Router();
const { listServices, showAddService, addService, deleteService } = require('../controllers/serviceController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', listServices);
router.get('/add', showAddService);
router.post('/add', addService);
router.post('/:id/delete', deleteService);

module.exports = router;
