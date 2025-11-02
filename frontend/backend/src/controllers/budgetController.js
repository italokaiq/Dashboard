const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const budgetController = {
  async create(req, res) {
    try {
      const budget = await Budget.create(req.body);
      res.status(201).json(budget);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { month, year } = req.query;
      const where = {};
      if (month) where.month = month;
      if (year) where.year = year;

      const budgets = await Budget.findAll({ where });
      
      // Calculate spent amounts
      for (let budget of budgets) {
        const spent = await Transaction.sum('amount', {
          where: {
            categoryId: budget.categoryId,
            type: 'expense',
            createdAt: {
              [Op.between]: [
                new Date(budget.year, budget.month - 1, 1),
                new Date(budget.year, budget.month, 0)
              ]
            }
          }
        });
        budget.spent = Math.abs(spent || 0);
        await budget.save();
      }

      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Budget.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const budget = await Budget.findByPk(req.params.id);
        res.json(budget);
      } else {
        res.status(404).json({ error: 'Budget not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async initDefaults(req, res) {
    try {
      const { seedBudgetCategories } = require('../seeders/budgetCategories');
      const count = await seedBudgetCategories();
      res.json({ message: `${count} orçamentos padrão criados!` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Budget.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Budget not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = budgetController;