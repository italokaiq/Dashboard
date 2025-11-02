import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export function SearchFilter({ onSearch, onFilter, categories = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      type: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-content">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  handleSearch(value);
                }}
                className="flex-1 px-3 py-2 border-0 outline-0 h-10 rounded-l-md"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <button 
                onClick={() => handleSearch(searchTerm)}
                className="px-4 h-10 flex items-center justify-center btn-primary"
                style={{ borderRadius: '6px 0px 0px 6px', border: 'none' }}
                title="Buscar"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn flex items-center gap-2 h-10 px-3 mb-0 ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '0px 6px 6px 0px' }}
              title="Filtros avançados"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="card">
          <div className="card-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filtros Avançados</h3>
              <button onClick={clearFilters} className="btn btn-ghost btn-sm flex items-center gap-1">
                <X className="w-4 h-4" />
                Limpar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="form-select"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                >
                  <option value="">Todos os tipos</option>
                  <option value="income">💰 Receita</option>
                  <option value="expense">💸 Despesa</option>
                </select>
              </div>
              <div>
                <label className="form-label">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="form-select"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Data Inicial</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="form-input"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="form-label">Data Final</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="form-input"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="form-label">Valor Mínimo</label>
                <input
                  type="number"
                  step="0.01"
                  value={filters.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                  className="form-input"
                  placeholder="0,00"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="form-label">Valor Máximo</label>
                <input
                  type="number"
                  step="0.01"
                  value={filters.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  className="form-input"
                  placeholder="0,00"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}