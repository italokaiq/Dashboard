const Budget = require('../models/Budget');
const Category = require('../models/Category');

const defaultBudgets = [
  { categoryName: 'Alimentação', amount: 800, period: 'monthly' },
  { categoryName: 'Moradia', amount: 1200, period: 'monthly' },
  { categoryName: 'Transporte', amount: 400, period: 'monthly' },
  { categoryName: 'Saúde', amount: 300, period: 'monthly' },
  { categoryName: 'Lazer', amount: 200, period: 'monthly' },
  { categoryName: 'Educação', amount: 150, period: 'monthly' },
  { categoryName: 'Roupas', amount: 100, period: 'monthly' },
  { categoryName: 'Outros', amount: 250, period: 'monthly' }
];

const seedBudgetCategories = async () => {
  try {
    const budgetCount = await Budget.count();
    if (budgetCount === 0) {
      const createdBudgets = [];
      
      for (const budgetData of defaultBudgets) {
        const category = await Category.findOne({ 
          where: { name: budgetData.categoryName } 
        });
        
        if (category) {
          const budget = await Budget.create({
            categoryId: category.id,
            amount: budgetData.amount,
            spent: 0,
            period: budgetData.period,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
          });
          createdBudgets.push(budget);
        }
      }
      
      console.log(`${createdBudgets.length} orçamentos padrão criados!`);
      return createdBudgets.length;
    }
    console.log('Orçamentos já existem no banco');
    return 0;
  } catch (error) {
    console.error('Erro ao criar orçamentos padrão:', error);
    throw error;
  }
};

module.exports = { seedBudgetCategories, defaultBudgets };