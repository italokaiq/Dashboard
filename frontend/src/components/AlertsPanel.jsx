import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { api, alertAPI } from '../lib/api';
import { AlertTriangle, CheckCircle, Clock, DollarSign, X } from 'lucide-react';

export function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);
  
  useEffect(() => {
    // Escutar evento de nova transação para atualizar alertas
    const handleTransactionAdded = () => {
      setTimeout(() => fetchAlerts(), 500);
    };
    
    window.addEventListener('transactionAdded', handleTransactionAdded);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      await alertAPI.generate();
      const response = await alertAPI.getAll();
      setAlerts(response.data.filter(alert => !alert.isRead));
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      setError('Erro ao carregar alertas');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await alertAPI.markAsRead(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
    }
  };

  const getAlertIcon = (type, severity) => {
    const iconClass = "w-5 h-5";
    
    if (severity === 'critical') {
      return <AlertTriangle className={`${iconClass} text-red-600`} />;
    }
    if (severity === 'high') {
      return <AlertTriangle className={`${iconClass} text-orange-500`} />;
    }
    if (severity === 'medium') {
      return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
    }
    if (severity === 'low') {
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    }
    
    switch (type) {
      case 'budget_limit':
        return <DollarSign className={`${iconClass} text-blue-500`} />;
      case 'goal_deadline':
        return <Clock className={`${iconClass} text-purple-500`} />;
      case 'debt_due':
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case 'emergency_fund':
        return <DollarSign className={`${iconClass} text-green-500`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-gray-500`} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Carregando alertas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAlerts}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-green-600 font-medium">✅ Tudo certo!</p>
            <p className="text-sm text-gray-500 mt-1">Nenhum alerta no momento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Alertas ({alerts.length})</span>
          <Button variant="outline" size="sm" onClick={fetchAlerts}>
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 border-l-4 rounded-r transition-all duration-200 hover:shadow-sm ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type, alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(alert.id)}
                  className="flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Marcar como lido"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}