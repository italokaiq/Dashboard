const Category = require('../models/Category');

const defaultCategories = [
  // Receitas
  { name: 'Salário', color: '#22C55E', icon: '💵' },
  { name: 'Freelance', color: '#8B5CF6', icon: '💻' },
  { name: 'Airbnb', color: '#EC4899', icon: '🏨' },
  
  // Despesas
  { name: 'Mercado', color: '#F59E0B', icon: '🛒' },
  { name: 'Empréstimo', color: '#EF4444', icon: '🏦' },
  { name: 'Combustível', color: '#6B7280', icon: '⛽' },
  { name: 'Farmácia', color: '#10B981', icon: '💊' },
  { name: 'Roupas', color: '#F97316', icon: '👕' },
  { name: 'Alimentação', color: '#FF6B6B', icon: '🍽️' },
  { name: 'Moradia', color: '#4ECDC4', icon: '🏠' },
  { name: 'Transporte', color: '#45B7D1', icon: '🚗' },
  { name: 'Lazer', color: '#96CEB4', icon: '🎮' },
  { name: 'Saúde', color: '#FFEAA7', icon: '⚕️' },
  { name: 'Educação', color: '#DDA0DD', icon: '📚' },
  { name: 'Investimentos', color: '#98D8C8', icon: '💰' },
  { name: 'Outros', color: '#F7DC6F', icon: '📦' }
];

const seedCategories = async () => {
  try {
    const count = await Category.count();
    if (count === 0) {
      await Category.bulkCreate(defaultCategories);
      console.log(`${defaultCategories.length} categorias padrão criadas!`);
      return defaultCategories.length;
    }
    console.log('Categorias já existem no banco');
    return 0;
  } catch (error) {
    console.error('Erro ao criar categorias:', error);
    throw error;
  }
};

module.exports = { seedCategories, defaultCategories };