import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { goalAPI } from '../lib/api';

export function GoalModal({ isOpen, onClose, onGoalAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlyContribution: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await goalAPI.create({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        monthlyContribution: parseFloat(formData.monthlyContribution) || 0
      });
      
      setFormData({ name: '', targetAmount: '', targetDate: '', monthlyContribution: '' });
      onGoalAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Nova Meta Financeira</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nome da Meta</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Ex: Casa própria, Aposentadoria"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Valor Alvo</label>
            <input
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Data Alvo</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contribuição Mensal</label>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
              className="form-input"
              placeholder="0.00"
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