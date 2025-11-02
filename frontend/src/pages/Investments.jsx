import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { investmentAPI, goalAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Target } from 'lucide-react';
import { InvestmentModal } from '@/components/InvestmentModal';
import { ContributionModal } from '@/components/ContributionModal';
import { GoalModal } from '@/components/GoalModal';
import { EvolutionChart } from '@/components/Charts/EvolutionChart';

export function Investments() {
  const [investments, setInvestments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  useEffect(() => {
    loadInvestments();
    loadGoals();
  }, []);

  const loadInvestments = async () => {
    try {
      const response = await investmentAPI.getAll();
      setInvestments(response.data);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoals = async () => {
    try {
      const response = await goalAPI.getProjections();
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  const handleDeleteInvestment = async (id) => {
    try {
      await investmentAPI.delete(id);
      loadInvestments();
    } catch (error) {
      console.error('Erro ao deletar investimento:', error);
    }
  };

  const handleAddContribution = (investment) => {
    setSelectedInvestment(investment);
    setIsContributionModalOpen(true);
  };

  const getTypeLabel = (type) => {
    const types = {
      acao: 'Ação',
      fundo: 'Fundo',
      renda_fixa: 'Renda Fixa',
      cripto: 'Cripto',
      outros: 'Outros'
    };
    return types[type] || type;
  };

  const getPerformance = (invested, current) => {
    if (invested === 0) return 0;
    return ((current - invested) / invested) * 100;
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.totalInvested), 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + parseFloat(inv.currentValue), 0);
  const totalPerformance = getPerformance(totalInvested, totalCurrent);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investimentos</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsGoalModalOpen(true)}>
            <Target />
            Nova Meta
          </Button>
          <Button onClick={() => setIsInvestmentModalOpen(true)}>
            <Plus />
            Novo Investimento
          </Button>
        </div>
      </div>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Faça seu Dinheiro Render
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Acompanhe seus investimentos e veja como seu patrimônio cresce ao longo do tempo. 
            Registre aportes, monitore rendimentos e mantenha controle sobre sua carteira 
            de investimentos.
          </p>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Investido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value">{formatCurrency(totalCurrent)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`stat-value ${totalPerformance >= 0 ? 'positive' : 'negative'}`}>
              {totalPerformance >= 0 ? '+' : ''}{totalPerformance.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de investimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Carteira de Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {investments.map((investment) => {
                const performance = getPerformance(investment.totalInvested, investment.currentValue);
                return (
                  <div key={investment.id} className="card" style={{ padding: '16px' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">{investment.name}</div>
                        <div className="text-gray-600" style={{ fontSize: '14px' }}>
                          {getTypeLabel(investment.type)} • Investido: {formatCurrency(investment.totalInvested)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <div className="font-bold">{formatCurrency(investment.currentValue)}</div>
                          <div className={`text-sm ${performance >= 0 ? 'positive' : 'negative'}`}>
                            {performance >= 0 ? '+' : ''}{performance.toFixed(2)}%
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddContribution(investment)}
                        >
                          Aportar
                        </Button>
                        <button
                          onClick={() => handleDeleteInvestment(investment.id)}
                          className="btn-remove"
                          title="Remover investimento"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500" style={{ padding: '32px 0' }}>
              Nenhum investimento encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Evolução */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Patrimônio</CardTitle>
        </CardHeader>
        <CardContent>
          <EvolutionChart data={[]} />
        </CardContent>
      </Card>

      {/* Metas Financeiras */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metas Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const monthsLeft = Math.max(0, goal.monthsRemaining);
                
                return (
                  <div key={goal.id} className="card" style={{ padding: '16px' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold">{goal.name}</div>
                      <div className={`text-sm ${goal.onTrack ? 'positive' : 'negative'}`}>
                        {goal.onTrack ? '✓ No prazo' : '⚠ Atrasado'}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {monthsLeft > 0 ? (
                        <span>Faltam {monthsLeft} meses • Necessário: {formatCurrency(goal.neededMonthly)}/mês</span>
                      ) : (
                        <span>Meta vencida</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        onInvestmentAdded={loadInvestments}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        onContributionAdded={loadInvestments}
        investment={selectedInvestment}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onGoalAdded={loadGoals}
      />
    </div>
  );
}