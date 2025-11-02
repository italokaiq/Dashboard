import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { transactionAPI } from '../lib/api';
import { getCategoriesByType } from '../data/categories';

export function TransactionModal({ isOpen, onClose, onTransactionAdded, transaction }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Se é edição, preencher formulário
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: transaction.amount.toString(),
          type: transaction.type,
          categoryId: transaction.categoryId.toString(),
          date: new Date(transaction.date).toISOString().split('T')[0]
        });
      } else {
        setFormData({
          description: '',
          amount: '',
          type: 'expense',
          categoryId: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [isOpen, transaction]);

  const loadCategories = async () => {
    try {
      const response = await transactionAPI.getCategories();
      const apiCategories = response.data;
      
      // Se não há categorias na API, usar as padrão
      if (apiCategories.length === 0) {
        setCategories(getCategoriesByType(formData.type));
      } else {
        setCategories(apiCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      // Fallback para categorias padrão
      setCategories(getCategoriesByType(formData.type));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Encontrar categoria por nome se necessário
      let categoryId = formData.categoryId;
      if (isNaN(categoryId)) {
        const category = categories.find(cat => cat.name === categoryId);
        categoryId = category?.id || null;
      }
      
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        categoryId: parseInt(categoryId) || null,
        date: formData.date
      };
      
      console.log('Enviando transação:', transactionData);
      
      const response = transaction 
        ? await transactionAPI.update(transaction.id, transactionData)
        : await transactionAPI.create(transactionData);
      
      console.log('Transação criada:', response.data);
      
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      onClose();
    } catch (error) {
      console.error('Erro completo:', error.response?.data || error.message);
      alert('Erro ao salvar transação: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              placeholder="Digite a descrição da transação"
              autoComplete="off"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Valor</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="form-select"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="form-select"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category, index) => (
                <option key={category.id || index} value={category.id || category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-input"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}