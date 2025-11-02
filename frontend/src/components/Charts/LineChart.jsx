import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

export function MonthlyLineChart({ data }) {
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
          dataKey="income" 
          stroke="#4ECDC4" 
          strokeWidth={2}
          name="Receitas"
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#FF6B6B" 
          strokeWidth={2}
          name="Despesas"
        />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="#45B7D1" 
          strokeWidth={2}
          name="Saldo"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}