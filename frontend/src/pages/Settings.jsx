import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { EmergencyFundCard } from '../components/EmergencyFundCard';
import { transactionAPI } from '../lib/api';
import { defaultCategories } from '../data/categories';
import { Plus } from 'lucide-react';

export function Settings() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
    color: '#FF6B6B',
    icon: '📦'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await transactionAPI.getCategories();
      if (response.data.length === 0) {
        // Se não há categorias, criar as padrão
        await createDefaultCategories();
      } else {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    try {
      for (const category of defaultCategories) {
        await transactionAPI.createCategory(category);
      }
      const response = await transactionAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao criar categorias padrão:', error);
      setCategories(defaultCategories);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await transactionAPI.createCategory(newCategory);
      setNewCategory({ name: '', type: 'expense', color: '#FF6B6B', icon: '📦' });
      loadCategories();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await transactionAPI.deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      {/* Explicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚙️ Personalize sua Experiência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Gerencie suas categorias de transações, configure preferências do sistema 
            e personalize o dashboard conforme suas necessidades. Mantenha tudo 
            organizado do seu jeito.
          </p>
        </CardContent>
      </Card>

      {/* Reserva de Emergência */}
      <EmergencyFundCard />

      {/* Adicionar nova categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Nova Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory}>
            <div className="grid grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="form-input"
                  minLength="3"
                  maxLength="15"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select
                  value={newCategory.type || 'expense'}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  className="form-select"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cor</label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="form-input"
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ícone</label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="form-select"
                >
                  <option value="📦">📦 Outros</option>
                  <option value="🍽️">🍽️ Alimentação</option>
                  <option value="🏠">🏠 Moradia</option>
                  <option value="🚗">🚗 Transporte</option>
                  <option value="💊">💊 Saúde</option>
                  <option value="👕">👕 Roupas</option>
                  <option value="🛒">🛒 Mercado</option>
                  <option value="⛽">⛽ Combustível</option>
                  <option value="🎮">🎮 Lazer</option>
                  <option value="📚">📚 Educação</option>
                  <option value="💰">💰 Dinheiro</option>
                  <option value="💼">💼 Trabalho</option>
                </select>
              </div>
            </div>
            <Button type="submit">
              <Plus />
              Adicionar Categoria
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="category-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-item"
                style={{ borderColor: category.color }}
              >
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <div
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="btn-remove"
                  title="Remover categoria"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}