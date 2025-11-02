const express = require('express');
const debtController = require('../controllers/debtController');

const router = express.Router();

router.post('/', debtController.create);
router.get('/', debtController.getAll);
router.put('/:id', debtController.update);
router.put('/:id/payment', debtController.makePayment);
router.delete('/:id', debtController.delete);

module.exports = router;