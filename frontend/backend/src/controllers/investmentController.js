const Investment = require('../models/Investment');
const Contribution = require('../models/Contribution');

const investmentController = {
  async getAll(req, res) {
    try {
      const investments = await Investment.findAll({
        include: [Contribution],
        order: [['name', 'ASC']]
      });
      res.json(investments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const investment = await Investment.create(req.body);
      res.status(201).json(investment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      await Investment.update(req.body, { where: { id } });
      const investment = await Investment.findByPk(id);
      res.json(investment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Investment.destroy({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async addContribution(req, res) {
    try {
      const contribution = await Contribution.create(req.body);
      
      // Atualizar total investido
      const investment = await Investment.findByPk(req.body.investmentId);
      if (investment) {
        investment.totalInvested = parseFloat(investment.totalInvested) + parseFloat(req.body.amount);
        await investment.save();
      }
      
      res.status(201).json(contribution);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getContributions(req, res) {
    try {
      const { investmentId } = req.params;
      const contributions = await Contribution.findAll({
        where: { investmentId },
        include: [Investment],
        order: [['date', 'DESC']]
      });
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = investmentController;