import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyLineChart } from '@/components/Charts/LineChart';
import { insightsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export function Insights() {
  const [insights, setInsights] = useState({
    monthlyData: [],
    averageExpenses: 0,
    topCategory: null,
    insights: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const response = await insightsAPI.getInsights();
      setInsights(response.data);
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insights e Análises</h1>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Análises Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Receba análises automáticas dos seus hábitos financeiros e sugestões 
            personalizadas para melhorar sua saúde financeira. Identifique padrões 
            e oportunidades de economia.
          </p>
        </CardContent>
      </Card>

      {/* Cards de insights */}
      <div className="grid grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Média de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stat-value" style={{ color: '#2563eb' }}>
              {formatCurrency(insights.averageExpenses)}
            </div>
            <p className="text-gray-600 mt-2">
              Baseado nos últimos 6 meses
            </p>
          </CardContent>
        </Card>

        {insights.topCategory && (
          <Card>
            <CardHeader>
              <CardTitle>Maior Categoria de Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#dc2626' }}>
                {insights.topCategory.name}
              </div>
              <div className="stat-value negative">
                {formatCurrency(insights.topCategory.amount)}
              </div>
              <p className="text-gray-600 mt-2">
                Este mês
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gráfico de evolução mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyLineChart data={insights.monthlyData} />
        </CardContent>
      </Card>

      {/* Insights automáticos */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights Automáticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <p className="insight-text">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}