const Alert = require('../models/Alert');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Debt = require('../models/Debt');
const EmergencyFund = require('../models/EmergencyFund');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const alertController = {
  async getAll(req, res) {
    try {
      const alerts = await Alert.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const [updated] = await Alert.update(
        { isRead: true },
        { where: { id: req.params.id } }
      );
      if (updated) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Alert not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async generateAlerts(req, res) {
    try {
      // Clear existing alerts
      await Alert.destroy({ where: {} });

      // Budget alerts
      const budgets = await Budget.findAll();
      for (let budget of budgets) {
        const percentage = (budget.spent / budget.amount) * 100;
        
        if (percentage >= 100) {
          await Alert.create({
            type: 'budget_limit',
            title: 'Orçamento Excedido',
            message: `Você excedeu o orçamento em ${(percentage - 100).toFixed(1)}%`,
            severity: 'critical',
            relatedId: budget.id
          });
        } else if (percentage >= 90) {
          await Alert.create({
            type: 'budget_limit',
            title: 'Orçamento Quase Esgotado',
            message: `Você já gastou ${percentage.toFixed(1)}% do orçamento`,
            severity: 'high',
            relatedId: budget.id
          });
        } else if (percentage >= 80) {
          await Alert.create({
            type: 'budget_limit',
            title: 'Orçamento Próximo do Limite',
            message: `Você gastou ${percentage.toFixed(1)}% do orçamento desta categoria`,
            severity: 'medium',
            relatedId: budget.id
          });
        }
      }

      // Goal deadline alerts
      const goals = await Goal.findAll();
      const now = new Date();
      for (let goal of goals) {
        const daysLeft = Math.ceil((new Date(goal.targetDate) - now) / (1000 * 60 * 60 * 24));
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        
        if (daysLeft <= 7 && progress < 50) {
          await Alert.create({
            type: 'goal_deadline',
            title: 'Meta Crítica',
            message: `Meta "${goal.name}" vence em ${daysLeft} dias com apenas ${progress.toFixed(1)}% concluído`,
            severity: 'critical',
            relatedId: goal.id
          });
        } else if (daysLeft <= 15 && progress < 70) {
          await Alert.create({
            type: 'goal_deadline',
            title: 'Meta em Risco',
            message: `Meta "${goal.name}" vence em ${daysLeft} dias e você está ${progress.toFixed(1)}% do objetivo`,
            severity: 'high',
            relatedId: goal.id
          });
        } else if (daysLeft <= 30 && progress < 80) {
          await Alert.create({
            type: 'goal_deadline',
            title: 'Meta Atrasada',
            message: `Meta "${goal.name}" precisa de atenção - ${progress.toFixed(1)}% concluído`,
            severity: 'medium',
            relatedId: goal.id
          });
        }
      }

      // Debt due alerts
      const debts = await Debt.findAll({ where: { status: 'active' } });
      for (let debt of debts) {
        const daysLeft = Math.ceil((new Date(debt.dueDate) - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
          await Alert.create({
            type: 'debt_due',
            title: 'Dívida Vencida',
            message: `A dívida "${debt.name}" está vencida há ${Math.abs(daysLeft)} dias`,
            severity: 'critical',
            relatedId: debt.id
          });
        } else if (daysLeft === 0) {
          await Alert.create({
            type: 'debt_due',
            title: 'Vencimento Hoje',
            message: `A dívida "${debt.name}" vence hoje!`,
            severity: 'critical',
            relatedId: debt.id
          });
        } else if (daysLeft <= 3) {
          await Alert.create({
            type: 'debt_due',
            title: 'Vencimento Urgente',
            message: `A dívida "${debt.name}" vence em ${daysLeft} dias`,
            severity: 'high',
            relatedId: debt.id
          });
        } else if (daysLeft <= 7) {
          await Alert.create({
            type: 'debt_due',
            title: 'Vencimento Próximo',
            message: `A dívida "${debt.name}" vence em ${daysLeft} dias`,
            severity: 'medium',
            relatedId: debt.id
          });
        }
      }

      // Balance alerts
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const income = await Transaction.sum('amount', {
        where: {
          type: 'income'
        }
      }) || 0;
      
      const expenses = await Transaction.sum('amount', {
        where: {
          type: 'expense'
        }
      }) || 0;
      
      const balance = income + expenses; // expenses are negative
      
      console.log('Balance calculation:', { income, expenses, balance });
      
      if (balance < 0) {
        const deficit = Math.abs(balance);
        await Alert.create({
          type: 'budget_limit',
          title: '🚨 Saldo Negativo - Ação Urgente!',
          message: `Suas despesas excedem as receitas em R$ ${deficit.toFixed(2)}. Revise seus gastos imediatamente e considere cortar despesas não essenciais.`,
          severity: 'critical',
          relatedId: null
        });
      }

      // Investment suggestions for positive balance  
      if (balance > 1000) {
        console.log('Creating investment suggestion alert');
        await Alert.create({
          type: 'emergency_fund',
          title: 'Oportunidade de Investimento',
          message: `Você tem R$ ${balance.toFixed(2)} disponível. Considere investir para fazer seu dinheiro render!`,
          severity: 'low',
          relatedId: null
        });
      }
      
      // Low balance warning
      if (balance > 0 && balance <= 500) {
        console.log('Creating low balance alert');
        await Alert.create({
          type: 'emergency_fund',
          title: 'Saldo Baixo',
          message: `Seu saldo está baixo: R$ ${balance.toFixed(2)}. Considere reduzir gastos ou aumentar receitas.`,
          severity: 'medium',
          relatedId: null
        });
      }

      const alerts = await Alert.findAll({ order: [['createdAt', 'DESC']] });
      
      // Sort by severity priority
      const severityOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };
      alerts.sort((a, b) => {
        const aPriority = severityOrder[a.severity] || 5;
        const bPriority = severityOrder[b.severity] || 5;
        return aPriority - bPriority;
      });
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = alertController;