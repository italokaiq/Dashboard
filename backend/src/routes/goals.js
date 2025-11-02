const express = require('express');
const goalController = require('../controllers/goalController');

const router = express.Router();

router.get('/', goalController.getAll);
router.post('/', goalController.create);
router.put('/:id', goalController.update);
router.delete('/:id', goalController.delete);
router.get('/projections', goalController.getProjections);

module.exports = router;