import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';

import { transactionAPI } from '../lib/api';
import { Plus } from 'lucide-react';

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setError(null);
      const params = { ...filters };
      const response = await transactionAPI.getAll(params);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setError('Erro ao carregar transações');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await transactionAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories([]);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta transação?')) {
      return;
    }
    try {
      await transactionAPI.delete(id);
      loadTransactions();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      alert('Erro ao deletar transação');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button onClick={loadTransactions} className="btn btn-primary mt-4">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus />
          Nova Transação
        </Button>
      </div>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Controle suas Finanças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Registre todas suas receitas e despesas para ter controle total do seu dinheiro. 
            Categorize cada transação para entender melhor seus hábitos financeiros e 
            identificar oportunidades de economia.
          </p>
        </CardContent>
      </Card>



      {/* Filtros Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="form-group">
              <label className="form-label">Mês</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                className="form-select"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ano</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                className="form-select"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de transações */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onTransactionAdded={loadTransactions}
        transaction={editingTransaction}
      />
    </div>
  );
}