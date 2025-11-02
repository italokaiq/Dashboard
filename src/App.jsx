import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Investments } from './pages/Investments';
import { Simulator } from './pages/Simulator';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { Budgets } from './pages/Budgets';
import { Debts } from './pages/Debts';
import { transactionAPI } from './lib/api';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppContent() {
  const location = useLocation();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await transactionAPI.getSummary();
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    }
  };

  const handleTransactionAdded = () => {
    loadBalance();
    // Forçar atualização dos componentes filhos
    window.dispatchEvent(new Event('transactionAdded'));
  };

  useKeyboardShortcuts([
    { keys: 'ctrl+n', action: () => window.dispatchEvent(new Event('openTransactionModal')) },
    { keys: 'ctrl+/', action: () => window.dispatchEvent(new Event('openSearch')) },
    { keys: 'alt+t', action: () => window.dispatchEvent(new Event('toggleTheme')) }
  ]);

  return (
    <div className="app-container">
      <Sidebar currentPath={location.pathname} />
      <div className="main-content">
        <Header balance={balance} onTransactionAdded={handleTransactionAdded} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions onSearch={() => {}} onFilter={() => {}} />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;