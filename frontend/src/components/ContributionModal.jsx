import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { investmentAPI } from '../lib/api';

export function ContributionModal({ isOpen, onClose, onContributionAdded, investment }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await investmentAPI.addContribution({
        ...formData,
        amount: parseFloat(formData.amount),
        investmentId: investment.id
      });
      
      setFormData({ amount: '', date: new Date().toISOString().split('T')[0] });
      onContributionAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar aporte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Novo Aporte - {investment?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Valor do Aporte</label>
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
              {loading ? 'Salvando...' : 'Aportar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}