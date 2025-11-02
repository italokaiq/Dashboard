const EmergencyFund = require('../models/EmergencyFund');

const emergencyFundController = {
  async get(req, res) {
    try {
      let fund = await EmergencyFund.findOne();
      if (!fund) {
        fund = await EmergencyFund.create({
          targetAmount: 0,
          currentAmount: 0,
          monthlyExpenses: 0,
          targetMonths: 6
        });
      }
      res.json(fund);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      let fund = await EmergencyFund.findOne();
      if (!fund) {
        fund = await EmergencyFund.create(req.body);
      } else {
        await fund.update(req.body);
      }
      
      // Recalculate target amount based on monthly expenses and target months
      if (req.body.monthlyExpenses || req.body.targetMonths) {
        fund.targetAmount = fund.monthlyExpenses * fund.targetMonths;
        await fund.save();
      }
      
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async addContribution(req, res) {
    try {
      const { amount } = req.body;
      let fund = await EmergencyFund.findOne();
      
      if (!fund) {
        return res.status(404).json({ error: 'Emergency fund not configured' });
      }
      
      fund.currentAmount = parseFloat(fund.currentAmount) + parseFloat(amount);
      await fund.save();
      
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = emergencyFundController;