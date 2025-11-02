import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { investmentAPI } from '../lib/api';

export function InvestmentModal({ isOpen, onClose, onInvestmentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'acao',
    currentValue: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await investmentAPI.create({
        ...formData,
        currentValue: parseFloat(formData.currentValue) || 0
      });
      
      setFormData({ name: '', type: 'acao', currentValue: '' });
      onInvestmentAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao criar investimento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Novo Investimento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nome do Ativo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Ex: PETR4, Tesouro Selic, Bitcoin"
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
              <option value="acao">Ação</option>
              <option value="fundo">Fundo</option>
              <option value="renda_fixa">Renda Fixa</option>
              <option value="cripto">Criptomoeda</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Valor Atual (opcional)</label>
            <input
              type="number"
              step="0.01"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
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