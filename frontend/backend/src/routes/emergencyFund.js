const express = require('express');
const emergencyFundController = require('../controllers/emergencyFundController');

const router = express.Router();

router.get('/', emergencyFundController.get);
router.put('/', emergencyFundController.update);
router.post('/contribute', emergencyFundController.addContribution);

module.exports = router;