import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

export function EvolutionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `R$ ${value}`} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Line 
          type="monotone" 
          dataKey="totalInvested" 
          stroke="#2563eb" 
          strokeWidth={2}
          name="Total Investido"
        />
        <Line 
          type="monotone" 
          dataKey="totalValue" 
          stroke="#059669" 
          strokeWidth={2}
          name="Valor Atual"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}