const Goal = require('../models/Goal');

const goalController = {
  async getAll(req, res) {
    try {
      const goals = await Goal.findAll({
        order: [['targetDate', 'ASC']]
      });
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const goal = await Goal.create(req.body);
      res.status(201).json(goal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      await Goal.update(req.body, { where: { id } });
      const goal = await Goal.findByPk(id);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Goal.destroy({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getProjections(req, res) {
    try {
      const goals = await Goal.findAll();
      const projections = goals.map(goal => {
        const monthsRemaining = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30));
        const neededMonthly = monthsRemaining > 0 ? (goal.targetAmount - goal.currentAmount) / monthsRemaining : 0;
        const projectedAmount = goal.currentAmount + (goal.monthlyContribution * monthsRemaining);
        
        return {
          ...goal.toJSON(),
          monthsRemaining,
          neededMonthly,
          projectedAmount,
          onTrack: projectedAmount >= goal.targetAmount
        };
      });
      
      res.json(projections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = goalController;