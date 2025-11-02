import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '../lib/api';

export function DebtModal({ isOpen, onClose, onSuccess, debt = null }) {
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    remainingAmount: '',
    monthlyPayment: '',
    interestRate: '',
    dueDate: ''
  });

  useEffect(() => {
    if (isOpen && debt) {
      setFormData({
        ...debt,
        dueDate: debt.dueDate ? new Date(debt.dueDate).toISOString().split('T')[0] : ''
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        totalAmount: '',
        remainingAmount: '',
        monthlyPayment: '',
        interestRate: '',
        dueDate: ''
      });
    }
  }, [isOpen, debt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        remainingAmount: formData.remainingAmount || formData.totalAmount
      };
      
      if (debt) {
        await api.put(`/debts/${debt.id}`, data);
      } else {
        await api.post('/debts', data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dívida:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{debt ? 'Editar' : 'Nova'} Dívida</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nome da Dívida</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Valor Total</label>
              <input
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Valor Restante</label>
              <input
                type="number"
                step="0.01"
                value={formData.remainingAmount}
                onChange={(e) => setFormData({...formData, remainingAmount: e.target.value})}
                className="form-input"
                placeholder="Deixe vazio para usar valor total"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Pagamento Mensal</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyPayment}
                onChange={(e) => setFormData({...formData, monthlyPayment: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Taxa de Juros (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Data de Vencimento</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="form-input"
              required
            />
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