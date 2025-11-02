const Debt = require('../models/Debt');

const debtController = {
  async create(req, res) {
    try {
      const debt = await Debt.create(req.body);
      res.status(201).json(debt);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const debts = await Debt.findAll({
        order: [['dueDate', 'ASC']]
      });
      res.json(debts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async makePayment(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      
      const debt = await Debt.findByPk(id);
      if (!debt) {
        return res.status(404).json({ error: 'Debt not found' });
      }

      debt.remainingAmount = Math.max(0, debt.remainingAmount - amount);
      if (debt.remainingAmount === 0) {
        debt.status = 'paid';
      }
      
      await debt.save();
      res.json(debt);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Debt.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const debt = await Debt.findByPk(req.params.id);
        res.json(debt);
      } else {
        res.status(404).json({ error: 'Debt not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Debt.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Debt not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = debtController;