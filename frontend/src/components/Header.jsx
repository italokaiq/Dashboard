import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TransactionModal } from './TransactionModal';
import { ThemeToggle } from './ThemeToggle';
import { formatCurrency } from '../lib/utils';

export function Header({ balance = 0, onTransactionAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-info">
          <h2>Dashboard</h2>
          <p>
            Saldo atual: <span className={balance >= 0 ? 'balance-positive' : 'balance-negative'}>
              {formatCurrency(balance)}
            </span>
          </p>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus />
            Adicionar Transação
          </Button>
        </div>
      </header>
      
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={onTransactionAdded}
      />
    </>
  );
}