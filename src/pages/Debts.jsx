import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DebtModal } from '../components/DebtModal';
import { api } from '../lib/api';
import { Plus, Edit, Trash2, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export function Debts() {
  const [debts, setDebts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payingDebt, setPayingDebt] = useState(null);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await api.get('/debts');
      setDebts(response.data);
    } catch (error) {
      console.error('Erro ao buscar dívidas:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta dívida?')) {
      try {
        await api.delete(`/debts/${id}`);
        fetchDebts();
      } catch (error) {
        console.error('Erro ao excluir dívida:', error);
      }
    }
  };

  const handlePayment = async (debtId) => {
    if (!paymentAmount || paymentAmount <= 0) return;
    
    try {
      await api.put(`/debts/${debtId}/payment`, { amount: parseFloat(paymentAmount) });
      setPaymentAmount('');
      setPayingDebt(null);
      fetchDebts();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status, daysUntilDue) => {
    if (status === 'paid') return 'text-green-600';
    if (status === 'overdue' || daysUntilDue < 0) return 'text-red-600';
    if (daysUntilDue <= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusText = (status, daysUntilDue) => {
    if (status === 'paid') return 'Paga';
    if (status === 'overdue' || daysUntilDue < 0) return 'Vencida';
    if (daysUntilDue <= 7) return `Vence em ${daysUntilDue} dias`;
    return `Vence em ${daysUntilDue} dias`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Controle de Dívidas</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Dívida
        </Button>
      </div>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💳 Gerencie suas Dívidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Mantenha controle total sobre suas dívidas e empréstimos. Acompanhe 
            vencimentos, valores restantes e registre pagamentos para quitar 
            suas obrigações de forma organizada.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {debts.map((debt) => {
          const daysUntilDue = getDaysUntilDue(debt.dueDate);
          const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
          
          return (
            <Card key={debt.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{debt.name}</span>
                  <div className="flex items-center gap-2">
                    {(debt.status === 'overdue' || daysUntilDue < 0) && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm ${getStatusColor(debt.status, daysUntilDue)}`}>
                      {getStatusText(debt.status, daysUntilDue)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingDebt(debt);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(debt.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Valor Total:</span>
                      <span className="font-semibold">R$ {parseFloat(debt.totalAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restante:</span>
                      <span className="font-semibold text-red-600">
                        R$ {parseFloat(debt.remainingAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagamento Mensal:</span>
                      <span>R$ {parseFloat(debt.monthlyPayment).toFixed(2)}</span>
                    </div>
                    {debt.interestRate > 0 && (
                      <div className="flex justify-between">
                        <span>Taxa de Juros:</span>
                        <span>{parseFloat(debt.interestRate).toFixed(2)}%</span>
                      </div>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {progress.toFixed(1)}% pago
                    </div>
                  </div>
                  
                  {debt.status === 'active' && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Registrar Pagamento
                      </h4>
                      {payingDebt === debt.id ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Valor do pagamento"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="form-input"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handlePayment(debt.id)}
                              disabled={!paymentAmount}
                            >
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPayingDebt(null);
                                setPaymentAmount('');
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setPayingDebt(debt.id)}
                          className="w-full"
                        >
                          Fazer Pagamento
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {debts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma dívida cadastrada</p>
          <Button onClick={() => setIsModalOpen(true)}>
            Cadastrar Primeira Dívida
          </Button>
        </div>
      )}

      <DebtModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDebt(null);
        }}
        onSuccess={fetchDebts}
        debt={editingDebt}
      />
    </div>
  );
}