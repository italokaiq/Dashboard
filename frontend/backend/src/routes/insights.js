const express = require('express');
const insightsController = require('../controllers/insightsController');

const router = express.Router();

router.get('/', insightsController.getInsights);

module.exports = router;