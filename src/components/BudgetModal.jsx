import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '../lib/api';
import { getBudgetSuggestion } from '../data/budgetCategories';

export function BudgetModal({ isOpen, onClose, onSuccess, budget = null }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (budget) {
        setFormData(budget);
      }
    }
  }, [isOpen, budget]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/transactions/categories');
      const expenseCategories = response.data.filter(cat => 
        ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Roupas', 'Outros'].includes(cat.name)
      );
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (budget) {
        await api.put(`/budgets/${budget.id}`, formData);
      } else {
        await api.post('/budgets', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{budget ? 'Editar' : 'Novo'} Orçamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              value={formData.categoryId}
              onChange={(e) => {
                const selectedCategory = categories.find(cat => cat.id == e.target.value);
                const suggestedAmount = selectedCategory ? getBudgetSuggestion(selectedCategory.name) : '';
                setFormData({
                  ...formData, 
                  categoryId: e.target.value,
                  amount: formData.amount || suggestedAmount
                });
              }}
              className="form-select"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name} (Sugestão: R$ {getBudgetSuggestion(cat.name)})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Valor Limite</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="form-input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Mês</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                className="form-select"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>
                    {new Date(0, i).toLocaleString('pt-BR', {month: 'long'})}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ano</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="form-input"
                min="2020"
                max="2030"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}