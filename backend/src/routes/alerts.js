const express = require('express');
const alertController = require('../controllers/alertController');

const router = express.Router();

router.get('/', alertController.getAll);
router.put('/:id/read', alertController.markAsRead);
router.post('/generate', alertController.generateAlerts);

module.exports = router;