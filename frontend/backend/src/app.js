const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const transactionRoutes = require('./routes/transactions');
const insightsRoutes = require('./routes/insights');
const { seedCategories } = require('./seeders/categories');
const { seedBudgetCategories } = require('./seeders/budgetCategories');
require('./models/Investment');
require('./models/Contribution');
require('./models/Goal');
require('./models/Simulation');
require('./models/Budget');
require('./models/Debt');
require('./models/Alert');
require('./models/EmergencyFund');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/investments', require('./routes/investments'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/simulations', require('./routes/simulations'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/debts', require('./routes/debts'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/emergency-fund', require('./routes/emergencyFund'));

// Rota para forçar criação de categorias
app.post('/api/init-categories', async (req, res) => {
  try {
    const Category = require('./models/Category');
    const Budget = require('./models/Budget');
    await Budget.destroy({ where: {} });
    await Category.destroy({ where: {} });
    const categoryCount = await seedCategories();
    const budgetCount = await seedBudgetCategories();
    res.json({ 
      message: `${categoryCount} categorias e ${budgetCount} orçamentos criados com sucesso!` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicializar banco e categorias padrão
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Conexão com banco estabelecida');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await seedCategories();
    await seedBudgetCategories();
    
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    console.error('Detalhes do erro:', error.message);
  }
};

setTimeout(initializeDatabase, 500);

module.exports = app;