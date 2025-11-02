const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { Op } = require('sequelize');

const transactionController = {
  async getAll(req, res) {
    try {
      const { month, year, search, type, category, dateFrom, dateTo, amountMin, amountMax } = req.query;

      let whereClause = {};
      
      // Filtro por busca de texto
      if (search && search.trim()) {
        whereClause.description = {
          [Op.like]: `%${search.trim()}%`
        };
      }
      
      // Filtro por período (mês/ano)
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      // Filtro por tipo
      if (type) {
        whereClause.type = type;
      }
      
      // Filtro por categoria
      if (category) {
        whereClause.categoryId = category;
      }
      
      // Filtro por data personalizada
      if (dateFrom || dateTo) {
        whereClause.date = {};
        if (dateFrom) whereClause.date[Op.gte] = new Date(dateFrom);
        if (dateTo) whereClause.date[Op.lte] = new Date(dateTo);
      }
      
      // Filtro por valor
      if (amountMin || amountMax) {
        whereClause.amount = {};
        if (amountMin) whereClause.amount[Op.gte] = parseFloat(amountMin);
        if (amountMax) whereClause.amount[Op.lte] = parseFloat(amountMax);
      }

      const transactions = await Transaction.findAll({
        where: whereClause,
        include: [Category],
        order: [['date', 'DESC']]
      });
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { description, amount, type, categoryId, date } = req.body;
      
      if (!description || !amount || !type || !date) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: description, amount, type, date' 
        });
      }
      
      if (typeof amount !== 'number' && isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'Amount must be a valid number' });
      }
      
      // Se categoryId for null ou undefined, buscar categoria "Outros"
      let finalCategoryId = categoryId;
      if (!categoryId) {
        const defaultCategory = await Category.findOne({ where: { name: 'Outros' } });
        finalCategoryId = defaultCategory?.id;
      }
      
      const transactionData = {
        description,
        amount: type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
        type,
        categoryId: finalCategoryId,
        date: new Date(date)
      };
      
      const transaction = await Transaction.create(transactionData);
      
      const transactionWithCategory = await Transaction.findByPk(transaction.id, {
        include: [Category]
      });
      
      res.status(201).json(transactionWithCategory);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      await Transaction.update(req.body, { where: { id } });
      const transaction = await Transaction.findByPk(id, {
        include: [Category]
      });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Transaction.destroy({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getSummary(req, res) {
    try {
      const { month, year, search, type, category, dateFrom, dateTo, amountMin, amountMax } = req.query;
      let whereClause = {};
      
      // Aplicar os mesmos filtros do getAll
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      if (search) {
        whereClause.description = {
          [Op.like]: `%${search}%`
        };
      }
      
      if (type) whereClause.type = type;
      if (category) whereClause.categoryId = category;
      
      if (dateFrom || dateTo) {
        whereClause.date = {};
        if (dateFrom) whereClause.date[Op.gte] = new Date(dateFrom);
        if (dateTo) whereClause.date[Op.lte] = new Date(dateTo);
      }
      
      if (amountMin || amountMax) {
        whereClause.amount = {};
        if (amountMin) whereClause.amount[Op.gte] = parseFloat(amountMin);
        if (amountMax) whereClause.amount[Op.lte] = parseFloat(amountMax);
      }

      const transactions = await Transaction.findAll({
        where: whereClause,
        include: [Category]
      });

      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

      const balance = income - expenses;

      const categoryExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          const categoryName = t.Category?.name || 'Sem categoria';
          acc[categoryName] = (acc[categoryName] || 0) + Math.abs(parseFloat(t.amount));
          return acc;
        }, {});

      res.json({
        income,
        expenses,
        balance,
        categoryExpenses
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = transactionController;