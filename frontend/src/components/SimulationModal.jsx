import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { simulationAPI } from '../lib/api';
import { formatCurrency } from '../lib/utils';

export function SimulationModal({ isOpen, onClose, onSimulationAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetMonths: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await simulationAPI.create({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        targetMonths: parseInt(formData.targetMonths)
      });
      
      setResult(response.data);
    } catch (error) {
      console.error('Erro ao criar simulação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setFormData({ name: '', targetAmount: '', targetMonths: '' });
    setResult(null);
    onSimulationAdded();
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', targetAmount: '', targetMonths: '' });
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Nova Simulação de Compra</DialogTitle>
        </DialogHeader>
        
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">O que você quer comprar?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="Ex: Videogame, Carro, Viagem"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Valor do produto</label>
              <input
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="form-input"
                placeholder="5500.00"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Em quantos meses?</label>
              <input
                type="number"
                value={formData.targetMonths}
                onChange={(e) => setFormData({ ...formData, targetMonths: e.target.value })}
                className="form-input"
                placeholder="6"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Calculando...' : 'Simular'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${result.isViable ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className={`font-bold text-lg mb-2 ${result.isViable ? 'text-green-800' : 'text-red-800'}`}>
                {result.isViable ? '✅ Objetivo Viável!' : '❌ Objetivo Inviável'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Renda mensal:</span>
                  <div className="font-bold positive">{formatCurrency(result.monthlyIncome)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Gastos mensais:</span>
                  <div className="font-bold negative">{formatCurrency(result.monthlyExpenses)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Sobra mensal:</span>
                  <div className={`font-bold ${result.monthlySavings >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(result.monthlySavings)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Total em {result.targetMonths} meses:</span>
                  <div className={`font-bold ${result.totalSavings >= result.targetAmount ? 'positive' : 'negative'}`}>
                    {formatCurrency(result.totalSavings)}
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations && (
              <div className="space-y-2">
                <h4 className="font-medium">Recomendações:</h4>
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    {rec}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Descartar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Salvar Simulação
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}