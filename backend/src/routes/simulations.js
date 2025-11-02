const express = require('express');
const simulationController = require('../controllers/simulationController');

const router = express.Router();

router.get('/', simulationController.getAll);
router.post('/', simulationController.create);
router.delete('/:id', simulationController.delete);

module.exports = router;