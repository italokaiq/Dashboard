import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CategoryPieChart } from '../components/Charts/PieChart';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { FinancialSummaryPanel } from '../components/FinancialSummaryPanel';
import { transactionAPI } from '../lib/api';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    categoryExpenses: {}
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    loadData();
    
    // Escutar evento de nova transação
    const handleTransactionAdded = () => {
      loadData();
    };
    
    window.addEventListener('transactionAdded', handleTransactionAdded);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const loadData = async () => {
    try {
      const [summaryResponse, transactionsResponse] = await Promise.all([
        transactionAPI.getSummary(),
        transactionAPI.getAll()
      ]);
      
      setSummary(summaryResponse.data);
      setRecentTransactions(transactionsResponse.data);
      

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      loadData();
      window.dispatchEvent(new Event('transactionAdded'));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value positive">
              💰 {formatCurrency(summary.income)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value negative">
              💸 {formatCurrency(summary.expenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`stat-value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
              📊 {formatCurrency(summary.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumo Financeiro */}
        <div className="lg:col-span-1">
          <FinancialSummaryPanel />
        </div>
        
        {/* Gráfico de pizza */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryPieChart data={summary.categoryExpenses} />
            </CardContent>
          </Card>
        </div>

        {/* Lista de Transações */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentTransactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="p-3 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{transaction.description}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            {transaction.Category?.icon} {transaction.Category?.name} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`font-bold text-sm ${transaction.type === 'income' ? 'amount-positive' : 'amount-negative'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                          </div>
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="btn-edit p-1"
                            title="Editar transação"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="btn-remove p-1"
                            title="Remover transação"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Nenhuma transação encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TransactionModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onTransactionAdded={loadData}
        transaction={editingTransaction}
      />
    </div>
  );
}