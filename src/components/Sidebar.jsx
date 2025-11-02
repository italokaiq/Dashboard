import { Home, CreditCard, BarChart3, Settings, TrendingUp, Calculator, Target, CreditCard as DebtIcon } from 'lucide-react';

const navigation = [
  { name: 'Resumo', href: '/', icon: Home },
  { name: 'Transações', href: '/transactions', icon: CreditCard },
  { name: 'Orçamentos', href: '/budgets', icon: Target },
  { name: 'Dívidas', href: '/debts', icon: DebtIcon },
  { name: 'Investimentos', href: '/investments', icon: TrendingUp },
  { name: 'Simulador', href: '/simulator', icon: Calculator },
  { name: 'Gráficos', href: '/insights', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar({ currentPath = '/' }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>💰 FinanceDash</h1>
      </div>
      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              {item.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}