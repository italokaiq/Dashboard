export const defaultCategories = [
  // Receitas
  { name: 'Salário', color: '#22C55E', icon: '💵', type: 'income' },
  { name: 'Freelance', color: '#8B5CF6', icon: '💻', type: 'income' },
  { name: 'Airbnb', color: '#EC4899', icon: '🏨', type: 'income' },
  
  // Despesas
  { name: 'Mercado', color: '#F59E0B', icon: '🛒', type: 'expense' },
  { name: 'Empréstimo', color: '#EF4444', icon: '🏦', type: 'expense' },
  { name: 'Combustível', color: '#6B7280', icon: '⛽', type: 'expense' },
  { name: 'Farmácia', color: '#10B981', icon: '💊', type: 'expense' },
  { name: 'Roupas', color: '#F97316', icon: '👕', type: 'expense' },
  { name: 'Alimentação', color: '#FF6B6B', icon: '🍽️', type: 'expense' },
  { name: 'Moradia', color: '#4ECDC4', icon: '🏠', type: 'expense' },
  { name: 'Transporte', color: '#45B7D1', icon: '🚗', type: 'expense' },
  { name: 'Lazer', color: '#96CEB4', icon: '🎮', type: 'expense' },
  { name: 'Saúde', color: '#FFEAA7', icon: '⚕️', type: 'expense' },
  { name: 'Educação', color: '#DDA0DD', icon: '📚', type: 'expense' },
  { name: 'Investimentos', color: '#98D8C8', icon: '💰', type: 'expense' },
  { name: 'Outros', color: '#F7DC6F', icon: '📦', type: 'both' }
];

export const getCategoriesByType = (type) => {
  if (type === 'income') {
    return defaultCategories.filter(cat => cat.type === 'income' || cat.type === 'both');
  }
  if (type === 'expense') {
    return defaultCategories.filter(cat => cat.type === 'expense' || cat.type === 'both');
  }
  return defaultCategories;
};