import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { budgetAPI, debtAPI, investmentAPI, transactionAPI } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';

export function FinancialSummaryPanel() {
  const [data, setData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalDebts: 0,
    totalInvested: 0,
    availableToInvest: 0,
    expenseRatio: 0
  });

  const getExpenseColor = () => {
    const ratio = data.expenseRatio;
    if (data.totalBudget - data.totalSpent < 0) return 'bg-red-100 dark:bg-red-900/30';
    if (ratio < 5) return 'bg-red-50 dark:bg-red-900/20';
    if (ratio <= 20) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-green-50 dark:bg-green-900/20';
  };

  const getExpenseAlert = () => {
    const ratio = data.expenseRatio;
    const balance = data.totalBudget - data.totalSpent;
    if (balance < 0) return '🚨 Saldo negativo! Reduza gastos urgentemente';
    if (ratio < 5) return '⚠️ Gastos muito baixos - considere investir mais';
    if (ratio <= 20) return '⚡ Gastos moderados - situação controlada';
    return '✅ Boa gestão financeira - continue assim!';
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summary, debts, investments] = await Promise.all([
        transactionAPI.getSummary(),
        debtAPI.getAll(),
        investmentAPI.getAll()
      ]);

      const totalIncome = summary.data.income;
      const totalExpenses = Math.abs(summary.data.expenses);
      const balance = summary.data.balance;
      const totalDebts = debts.data.reduce((sum, debt) => sum + debt.remainingAmount, 0);
      const totalInvested = investments.data.reduce((sum, inv) => sum + inv.currentAmount, 0);
      
      // Calcular quanto pode investir (saldo - dívidas)
      const availableToInvest = Math.max(0, balance - totalDebts);

      setData({
        totalBudget: totalIncome,
        totalSpent: totalExpenses,
        totalDebts,
        totalInvested,
        availableToInvest,
        expenseRatio: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0
      });
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PiggyBank className="w-5 h-5 mr-2" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 p-2">
          {/* Orçamento */}
          <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${getExpenseColor()}`}>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Receitas</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Despesas: {formatCurrency(data.totalSpent)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">{formatCurrency(data.totalBudget)}</p>
              <p className="text-xs text-gray-500">
                Saldo: {formatCurrency(data.totalBudget - data.totalSpent)}
              </p>
            </div>
          </div>

          {/* Alerta de Situação */}
          <div className="p-3 rounded-lg text-center border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{getExpenseAlert()}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {data.expenseRatio.toFixed(1)}% das receitas gastas
            </p>
          </div>

          {/* Dívidas */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Dívidas</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total pendente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-600">{formatCurrency(data.totalDebts)}</p>
            </div>
          </div>

          {/* Investimentos */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Investido</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total aplicado</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">{formatCurrency(data.totalInvested)}</p>
            </div>
          </div>

          {/* Disponível para investir */}
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 shadow-sm">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                💡 Disponível para Investir
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Após saldo e dívidas
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-purple-600">{formatCurrency(data.availableToInvest)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}