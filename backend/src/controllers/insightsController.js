const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { Op } = require('sequelize');

const insightsController = {
  async getInsights(req, res) {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Últimos 6 meses
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const transactions = await Transaction.findAll({
          where: {
            date: {
              [Op.between]: [startDate, endDate]
            }
          }
        });

        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        monthlyData.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          income,
          expenses,
          balance: income - expenses
        });
      }

      // Média de gastos
      const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
      const averageExpenses = totalExpenses / monthlyData.length;

      // Maior categoria de gasto no mês atual
      const currentMonthStart = new Date(currentYear, currentMonth, 1);
      const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      const currentMonthTransactions = await Transaction.findAll({
        where: {
          date: {
            [Op.between]: [currentMonthStart, currentMonthEnd]
          },
          type: 'expense'
        },
        include: [Category]
      });

      const categoryTotals = currentMonthTransactions.reduce((acc, t) => {
        const categoryName = t.Category?.name || 'Sem categoria';
        acc[categoryName] = (acc[categoryName] || 0) + parseFloat(t.amount);
        return acc;
      }, {});

      const topCategory = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)[0];

      res.json({
        monthlyData,
        averageExpenses,
        topCategory: topCategory ? {
          name: topCategory[0],
          amount: topCategory[1]
        } : null,
        insights: [
          `Sua média de gastos é R$ ${averageExpenses.toFixed(2)}`,
          topCategory ? `Sua maior categoria de gasto este mês é ${topCategory[0]} (R$ ${topCategory[1].toFixed(2)})` : 'Nenhuma transação encontrada este mês'
        ]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = insightsController;