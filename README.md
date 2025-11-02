# 💰 Dashboard de Finanças Pessoais

Um dashboard completo para gerenciamento de finanças pessoais com React, Node.js e PostgreSQL.

## 🚀 Funcionalidades

- ✅ **Gestão de Transações**: Registrar receitas e despesas com categorização
- 📊 **Gráficos Interativos**: Visualização por categoria (pizza) e evolução temporal (linha)
- 🏷️ **Categorias Personalizáveis**: Criar e gerenciar categorias com cores e ícones
- 📅 **Filtros por Período**: Visualizar dados por mês/ano específico
- 💡 **Insights Automáticos**: Análises e sugestões baseadas nos dados
- 📱 **Interface Responsiva**: Design moderno com shadcn/ui

## 🛠️ Tecnologias

### Backend
- **Node.js** com Express
- **PostgreSQL** com Sequelize ORM
- **CORS** para comunicação frontend/backend

### Frontend
- **React 18** com Vite
- **shadcn/ui** para componentes
- **Tailwind CSS** para estilização
- **Recharts** para gráficos
- **Lucide React** para ícones
- **React Router** para navegação

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### 1. Clone o repositório
\`\`\`bash
git clone <url-do-repositorio>
cd Dashboard\ de\ finanças
\`\`\`

### 2. Configure o Backend
\`\`\`bash
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações do PostgreSQL

# Inicie o servidor
npm run dev
\`\`\`

### 3. Configure o Frontend
\`\`\`bash
cd ../frontend
npm install

# Inicie o desenvolvimento
npm run dev
\`\`\`

### 4. Configure o Banco de Dados
Certifique-se de que o PostgreSQL está rodando e crie o banco:
\`\`\`sql
CREATE DATABASE finance_dashboard;
\`\`\`

O backend criará as tabelas automaticamente na primeira execução.

## 🎯 Como Usar

1. **Acesse** http://localhost:5173
2. **Adicione categorias** em Configurações
3. **Registre transações** usando o botão "Adicionar Transação"
4. **Visualize relatórios** na página de Insights
5. **Gerencie dados** na página de Transações

## 📁 Estrutura do Projeto

\`\`\`
finance-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Configuração do banco
│   │   ├── models/               # Modelos Sequelize
│   │   ├── controllers/          # Lógica de negócio
│   │   ├── routes/               # Rotas da API
│   │   └── app.js               # Configuração Express
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── lib/                 # Utilitários e API
│   │   └── App.jsx             # Componente principal
│   └── package.json
│
└── README.md
\`\`\`

## 🔧 Scripts Disponíveis

### Backend
- \`npm start\` - Produção
- \`npm run dev\` - Desenvolvimento com nodemon

### Frontend
- \`npm run dev\` - Servidor de desenvolvimento
- \`npm run build\` - Build para produção
- \`npm run preview\` - Preview do build

## 🎨 Categorias Padrão

O sistema vem com categorias pré-configuradas:

**Receitas:**
- 💵 Salário - Para salários e rendimentos fixos
- 💻 Freelance - Para trabalhos freelance e extras
- 🏨 Airbnb - Para rendimentos de aluguel/hospedagem

**Despesas:**
- 🛒 Mercado - Para compras de supermercado
- 🏦 Empréstimo - Para pagamentos de empréstimos
- ⛽ Combustível - Para gastos com combustível
- 💊 Farmácia - Para medicamentos e farmácia
- 👕 Roupas - Para compras de vestuário
- 🍽️ Alimentação
- 🏠 Moradia
- 🚗 Transporte
- 🎮 Lazer
- ⚕️ Saúde
- 📚 Educação
- 💰 Investimentos
- 📦 Outros

## 📊 API Endpoints

### Transações
- \`GET /api/transactions\` - Listar transações
- \`POST /api/transactions\` - Criar transação
- \`PUT /api/transactions/:id\` - Atualizar transação
- \`DELETE /api/transactions/:id\` - Deletar transação
- \`GET /api/transactions/summary\` - Resumo financeiro

### Categorias
- \`GET /api/transactions/categories\` - Listar categorias
- \`POST /api/transactions/categories\` - Criar categoria

### Insights
- \`GET /api/insights\` - Análises e insights

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (\`git checkout -b feature/nova-funcionalidade\`)
3. Commit suas mudanças (\`git commit -am 'Adiciona nova funcionalidade'\`)
4. Push para a branch (\`git push origin feature/nova-funcionalidade\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Metas financeiras
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações e lembretes
- [ ] Integração com bancos (Open Banking)
- [ ] App mobile (React Native)
- [ ] Previsões com IA/ML