const express = require('express');
const budgetController = require('../controllers/budgetController');

const router = express.Router();

// Validation middleware
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }
  next();
};

router.post('/', budgetController.create);
router.get('/', budgetController.getAll);
router.put('/:id', validateId, budgetController.update);
router.delete('/:id', validateId, budgetController.delete);
router.post('/init-defaults', budgetController.initDefaults);

module.exports = router;