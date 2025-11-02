const express = require('express');
const transactionController = require('../controllers/transactionController');
const Category = require('../models/Category');

const router = express.Router();

// Validation middleware
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }
  next();
};

router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', validateId, transactionController.update);
router.delete('/:id', validateId, transactionController.delete);
router.get('/summary', transactionController.getSummary);

// Rotas para categorias
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/categories/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;