const express = require('express');
const investmentController = require('../controllers/investmentController');

const router = express.Router();

router.get('/', investmentController.getAll);
router.post('/', investmentController.create);
router.put('/:id', investmentController.update);
router.delete('/:id', investmentController.delete);
router.post('/contributions', investmentController.addContribution);
router.get('/:investmentId/contributions', investmentController.getContributions);

module.exports = router;