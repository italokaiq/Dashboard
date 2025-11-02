import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BudgetModal } from '../components/BudgetModal';
import { api } from '../lib/api';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

export function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get(`/budgets?month=${currentMonth}&year=${currentYear}`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/transactions/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 90) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Planeje seus Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Defina limites de gastos por categoria para manter suas finanças sob controle. 
            O sistema monitora automaticamente seus gastos e alerta quando você está 
            próximo do limite estabelecido.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          return (
            <Card key={budget.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{getCategoryName(budget.categoryId)}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(percentage)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingBudget(budget);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Gasto:</span>
                    <span>R$ {parseFloat(budget.spent).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Limite:</span>
                    <span>R$ {parseFloat(budget.amount).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{percentage.toFixed(1)}% usado</span>
                    <span className={percentage >= 100 ? 'text-red-500 font-semibold' : ''}>
                      R$ {(budget.amount - budget.spent).toFixed(2)} restante
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum orçamento configurado para este mês</p>
          <Button onClick={() => setIsModalOpen(true)}>
            Criar Primeiro Orçamento
          </Button>
        </div>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSuccess={fetchBudgets}
        budget={editingBudget}
      />
    </div>
  );
}