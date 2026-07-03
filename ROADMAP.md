# Roadmap Técnico - Frota PM

## 1. FRONT-END

### 1.1 Módulo de Manutenção
- [ ] Adicionar botão Editar Ordem de Serviço
- [ ] Criar formulário de edição com auto-preenchimento
- [ ] Permitir alteração de: tipo, descrição, data, quilometragem, valor, status, oficina
- [ ] Adicionar confirmação antes de excluir
- [ ] Atualizar tabela automaticamente após salvar

### 1.2 Cadastro de Viaturas
- [ ] Implementar CRUD (Criar, Ler, Atualizar, Deletar)
- [ ] Busca por placa, prefixo e modelo
- [ ] Validação de campos obrigatórios
- [ ] Paginação da tabela
- [ ] Campo de busca dinâmica
- [ ] Ordenação por colunas

### 1.3 Dashboard
- [ ] Cards com indicadores (total, operacionais, em manutenção, etc.)
- [ ] Gráficos de manutenções por mês
- [ ] Gráfico de custos por mês
- [ ] Gráfico de disponibilidade da frota
- [ ] Gráfico de distribuição por tipo de manutenção

### 1.4 Responsividade Mobile
- [ ] Menu hambúrguer
- [ ] Tabelas com rolagem horizontal
- [ ] Botões maiores para toque
- [ ] Cards reorganizados em coluna
- [ ] Fontes adaptáveis
- [ ] Dashboard responsivo

### 1.5 Atualização em Tempo Real
- [ ] Implementar WebSocket / Firebase / Supabase Realtime
- [ ] Auto-atualização do dashboard
- [ ] Auto-atualização de cadastro de viaturas
- [ ] Auto-atualização de ordens de serviço
- [ ] Auto-atualização de rastreamento

## 2. BACK-END

### 2.1 API de Viaturas
- [ ] GET /viaturas
- [ ] GET /viaturas/:id
- [ ] POST /viaturas
- [ ] PUT /viaturas/:id
- [ ] DELETE /viaturas/:id

### 2.2 API de Manutenções
- [ ] GET /manutencoes
- [ ] GET /manutencoes/:id
- [ ] POST /manutencoes
- [ ] PUT /manutencoes/:id
- [ ] DELETE /manutencoes/:id

### 2.3 Dashboard
- [ ] GET /dashboard/indicadores
- [ ] GET /dashboard/graficos

### 2.4 Sistema de Atualização em Tempo Real
- [ ] Implementar WebSocket
- [ ] Eventos de viatura (create, update, delete)
- [ ] Eventos de manutenção (create, update, delete)

### 2.5 Segurança
- [ ] Autenticação de usuários
- [ ] Controle de permissões
- [ ] Registro de logs
- [ ] Criptografia de senhas
- [ ] Validação de dados recebidos

## 3. BANCO DE DADOS
- [ ] Criar tabelas (usuários, viaturas, manutenções, rastreamento)
- [ ] Criar índices para performance
- [ ] Relacionamentos entre tabelas

## Priorização

**Phase 1 (MVP):**
- Backend API básica (viaturas e manutenções)
- Frontend com formulários CRUD
- Banco de dados funcional

**Phase 2:**
- Dashboard com indicadores
- Responsividade mobile
- Gráficos

**Phase 3:**
- Real-time updates
- Segurança completa
- Rastreamento
