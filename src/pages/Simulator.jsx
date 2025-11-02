import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { simulationAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Calculator, Plus } from 'lucide-react';
import { SimulationModal } from '@/components/SimulationModal';

export function Simulator() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      const response = await simulationAPI.getAll();
      setSimulations(response.data);
    } catch (error) {
      console.error('Erro ao carregar simulações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSimulation = async (id) => {
    try {
      await simulationAPI.delete(id);
      loadSimulations();
    } catch (error) {
      console.error('Erro ao deletar simulação:', error);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Simulador de Compras</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus />
          Nova Simulação
        </Button>
      </div>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator />
            Como Funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            O simulador analisa suas receitas e despesas dos últimos 3 meses para calcular 
            se você consegue comprar algo em um prazo específico. Exemplo: "Quero comprar 
            um videogame de R$ 5.500 em 6 meses".
          </p>
        </CardContent>
      </Card>

      {/* Lista de simulações */}
      <div className="space-y-4">
        {simulations.length > 0 ? (
          simulations.map((simulation) => (
            <Card key={simulation.id}>
              <CardContent style={{ padding: '20px' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{simulation.name}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        simulation.isViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {simulation.isViable ? '✅ Viável' : '❌ Inviável'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Valor Alvo</div>
                        <div className="font-bold">{formatCurrency(simulation.targetAmount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Prazo</div>
                        <div className="font-bold">{simulation.targetMonths} meses</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Renda Mensal (média)</div>
                        <div className="font-bold positive">{formatCurrency(simulation.monthlyIncome)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Gastos Mensais (média)</div>
                        <div className="font-bold negative">{formatCurrency(simulation.monthlyExpenses)}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Sobra Mensal:</span>
                        <span className={`font-bold ${simulation.monthlySavings >= 0 ? 'positive' : 'negative'}`}>
                          {formatCurrency(simulation.monthlySavings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total em {simulation.targetMonths} meses:</span>
                        <span className={`font-bold ${simulation.isViable ? 'positive' : 'negative'}`}>
                          {formatCurrency(simulation.monthlySavings * simulation.targetMonths)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteSimulation(simulation.id)}
                    className="btn-remove"
                    title="Remover simulação"
                  >
                    ×
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent style={{ padding: '40px', textAlign: 'center' }}>
              <Calculator size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                Nenhuma simulação criada ainda. Clique em "Nova Simulação" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <SimulationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSimulationAdded={loadSimulations}
      />
    </div>
  );
}