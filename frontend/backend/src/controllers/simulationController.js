const Simulation = require('../models/Simulation');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const simulationController = {
  async create(req, res) {
    try {
      const { name, targetAmount, targetMonths } = req.body;
      
      // Calcular média de receitas e despesas dos últimos 3 meses
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const transactions = await Transaction.findAll({
        where: {
          date: {
            [Op.gte]: threeMonthsAgo
          }
        }
      });
      
      const monthlyIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) / 3;
        
      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) / 3;
        
      const monthlySavings = monthlyIncome - monthlyExpenses;
      const totalSavings = monthlySavings * targetMonths;
      const isViable = totalSavings >= targetAmount;
      
      const simulation = await Simulation.create({
        name,
        targetAmount: parseFloat(targetAmount),
        targetMonths: parseInt(targetMonths),
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        isViable
      });
      
      // Calcular dados adicionais para resposta
      const neededMonthlySavings = targetAmount / targetMonths;
      const surplus = monthlySavings - neededMonthlySavings;
      const adjustedMonths = monthlySavings > 0 ? Math.ceil(targetAmount / monthlySavings) : null;
      
      res.status(201).json({
        ...simulation.toJSON(),
        totalSavings,
        neededMonthlySavings,
        surplus,
        adjustedMonths,
        recommendations: generateRecommendations(monthlySavings, neededMonthlySavings, monthlyExpenses)
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const simulations = await Simulation.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Simulation.destroy({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

function generateRecommendations(monthlySavings, neededSavings, monthlyExpenses) {
  const recommendations = [];
  
  if (monthlySavings >= neededSavings) {
    recommendations.push('✅ Objetivo viável! Você consegue economizar o suficiente.');
  } else {
    const deficit = neededSavings - monthlySavings;
    recommendations.push(`❌ Você precisa economizar mais R$ ${deficit.toFixed(2)} por mês.`);
    
    const reductionPercentage = (deficit / monthlyExpenses) * 100;
    if (reductionPercentage <= 10) {
      recommendations.push(`💡 Reduza seus gastos em ${reductionPercentage.toFixed(1)}% para atingir o objetivo.`);
    } else if (reductionPercentage <= 25) {
      recommendations.push(`⚠️ Será necessário reduzir gastos em ${reductionPercentage.toFixed(1)}%. Revise suas despesas.`);
    } else {
      recommendations.push(`🚨 Meta muito ambiciosa. Considere aumentar o prazo ou reduzir o valor.`);
    }
  }
  
  return recommendations;
}

module.exports = simulationController;