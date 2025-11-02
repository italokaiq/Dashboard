import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

export function TransactionTable({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500" style={{ padding: '32px 0' }}>
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>
                <span className="flex items-center">
                  {transaction.Category?.icon} {transaction.Category?.name}
                </span>
              </td>
              <td>
                <span className={transaction.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </span>
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(transaction)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(transaction.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}