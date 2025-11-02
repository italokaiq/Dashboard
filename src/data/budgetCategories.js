export const defaultBudgets = [
  { categoryName: 'Alimentação', amount: 800, period: 'monthly', icon: '🍽️' },
  { categoryName: 'Moradia', amount: 1200, period: 'monthly', icon: '🏠' },
  { categoryName: 'Transporte', amount: 400, period: 'monthly', icon: '🚗' },
  { categoryName: 'Saúde', amount: 300, period: 'monthly', icon: '⚕️' },
  { categoryName: 'Lazer', amount: 200, period: 'monthly', icon: '🎮' },
  { categoryName: 'Educação', amount: 150, period: 'monthly', icon: '📚' },
  { categoryName: 'Roupas', amount: 100, period: 'monthly', icon: '👕' },
  { categoryName: 'Outros', amount: 250, period: 'monthly', icon: '📦' }
];

export const getBudgetSuggestion = (categoryName) => {
  const budget = defaultBudgets.find(b => b.categoryName === categoryName);
  return budget ? budget.amount : 500;
};