import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { emergencyFundAPI } from '../lib/api';
import { Shield, Plus, Settings } from 'lucide-react';

export function EmergencyFundCard() {
  const [fund, setFund] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [formData, setFormData] = useState({
    monthlyExpenses: '',
    targetMonths: 6
  });

  useEffect(() => {
    fetchFund();
  }, []);

  const fetchFund = async () => {
    try {
      const response = await emergencyFundAPI.get();
      setFund(response.data);
      setFormData({
        monthlyExpenses: response.data.monthlyExpenses,
        targetMonths: response.data.targetMonths
      });
    } catch (error) {
      console.error('Erro ao buscar reserva de emergência:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await emergencyFundAPI.update(formData);
      setIsEditing(false);
      fetchFund();
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
    }
  };

  const handleContribution = async () => {
    if (!contributionAmount || contributionAmount <= 0) return;
    
    try {
      await emergencyFundAPI.addContribution(parseFloat(contributionAmount));
      setContributionAmount('');
      setIsContributing(false);
      fetchFund();
    } catch (error) {
      console.error('Erro ao adicionar contribuição:', error);
    }
  };

  if (!fund) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Carregando reserva de emergência...</p>
        </CardContent>
      </Card>
    );
  }

  const progress = fund.targetAmount > 0 ? (fund.currentAmount / fund.targetAmount) * 100 : 0;
  const isComplete = progress >= 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className={`w-5 h-5 mr-2 ${isComplete ? 'text-green-500' : 'text-blue-500'}`} />
            Reserva de Emergência
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsContributing(!isContributing)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Gastos Mensais (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyExpenses}
                onChange={(e) => setFormData({...formData, monthlyExpenses: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meses de Reserva
              </label>
              <select
                value={formData.targetMonths}
                onChange={(e) => setFormData({...formData, targetMonths: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={3}>3 meses</option>
                <option value={6}>6 meses</option>
                <option value={12}>12 meses</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} size="sm">Salvar</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        ) : isContributing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Valor da Contribuição (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0,00"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleContribution} size="sm" disabled={!contributionAmount}>
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setIsContributing(false)} size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Valor Atual:</span>
              <span className="font-semibold">R$ {parseFloat(fund.currentAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Meta ({fund.targetMonths} meses):</span>
              <span>R$ {parseFloat(fund.targetAmount).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className={isComplete ? 'text-green-600 font-semibold' : ''}>
                {progress.toFixed(1)}% completo
              </span>
              <span>
                {isComplete ? 'Meta atingida! 🎉' : `Faltam R$ ${(fund.targetAmount - fund.currentAmount).toFixed(2)}`}
              </span>
            </div>
            {fund.monthlyExpenses > 0 && (
              <div className="text-xs text-gray-600 mt-2">
                Baseado em gastos mensais de R$ {parseFloat(fund.monthlyExpenses).toFixed(2)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}