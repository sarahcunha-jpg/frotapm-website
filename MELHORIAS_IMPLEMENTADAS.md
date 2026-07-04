# 📋 Melhorias Implementadas - FrotaPM

## Visão Geral
Este documento detalha todas as melhorias identificadas e planejadas para o sistema FrotaPM de Gestão de Frota, com base na análise completa da estrutura do projeto.

---

## 🔴 Prioridade ALTA - Usabilidade Essencial

### 1. [Issue #6] Corrigir Edição de Ordem de Serviço (BUG)
**Status**: Em Análise  
**Objetivo**: Resolver funcionalidade quebrada de edição de OS

#### Problemas Identificados:
- Modal "Editar Ordem de Serviço" existe mas não funciona corretamente
- Campos não carregam dados da OS selecionada
- Alterações não são persistidas no banco de dados
- Falta feedback visual (loading, sucesso/erro)

#### Tarefas:
- [ ] Depurar endpoint de atualização de OS (`PUT /api/os/:id`)
- [ ] Validar bindings de dados no formulário
- [ ] Implementar tratamento de erros com try-catch
- [ ] Adicionar toast notifications (sucesso/erro)
- [ ] Adicionar confirmação antes de salvar

#### Funcionalidades Relacionadas Faltando:
- [ ] Excluir OS com confirmação
- [ ] Duplicar OS
- [ ] Pesquisa por viatura
- [ ] Filtro por status
- [ ] Filtro por tipo de manutenção
- [ ] Filtro por data

---

### 2. [Issue #7] Backend API - Sincronização de Dados
**Status**: Planejado  
**Objetivo**: Implementar sincronização de dados em tempo real entre usuários

#### API Endpoints Necessários:
```
POST   /api/auth/login              - Autenticar usuário
POST   /api/auth/logout             - Desautenticar
GET    /api/users/profile           - Perfil do usuário
POST   /api/os                      - Criar OS
PUT    /api/os/:id                  - Atualizar OS
DELETE /api/os/:id                  - Excluir OS
GET    /api/os                      - Listar com filtros
GET    /api/os/:id                  - Detalhes de uma OS
POST   /api/vehicles                - Criar viatura
PUT    /api/vehicles/:id            - Atualizar viatura
DELETE /api/vehicles/:id            - Excluir viatura
GET    /api/vehicles                - Listar com filtros
```

#### Autenticação:
- [ ] Implementar JWT (JSON Web Tokens)
- [ ] Roles: admin, supervisor, operador
- [ ] Middleware de validação em todas as rotas
- [ ] Registrar usuario_id em cada operação

#### Sincronização em Tempo Real:
- [ ] Option A: WebSocket com Socket.io
- [ ] Option B: Server-Sent Events (SSE)
- [ ] Option C: Polling a cada 30-60 segundos

#### Banco de Dados:
```sql
-- Usuários
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255),
  role ENUM('admin', 'supervisor', 'operador') DEFAULT 'operador',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de alterações
CREATE TABLE logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(100),
  registro_id INT,
  acao ENUM('CREATE', 'UPDATE', 'DELETE'),
  dados_antigos JSON,
  dados_novos JSON,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

---

### 3. [Issue #8] Responsividade Completa para Mobile
**Status**: Planejado  
**Objetivo**: Implementar design responsivo para smartphones e tablets

#### Problemas Atuais:
- Tabelas cortadas em telas pequenas
- Botões muito pequenos para tocar (< 44px)
- Modais ultrapassam a viewport
- Gráficos não se ajustam ao tamanho da tela
- Menu não é otimizado para mobile

#### Breakpoints CSS:
```css
/* Mobile: 320px - 479px */
@media (max-width: 480px) {
  /* Stack everything vertically */
  /* Convert tables to cards */
  /* Increase button/input sizes */
}

/* Tablet: 480px - 768px */
@media (max-width: 768px) {
  /* 2 columns layout */
  /* Optimized modals */
}

/* Desktop: 768px+ */
/* Current layout */
```

#### Tarefas:
- [ ] Adicionar meta viewport tag (já está em index.html)
- [ ] Implementar media queries para todos os componentes
- [ ] Converter tabelas em cards para mobile
- [ ] Criar menu hambúrguer (já existe, precisa otimizar)
- [ ] Aumentar tamanho de botões (mín 44x44px)
- [ ] Tornar inputs mais confortáveis (fonte 16px+)
- [ ] Responsividade de gráficos (Chart.js suporta)
- [ ] Testar em: iPhone 12, iPhone 14 Pro, Samsung Galaxy S21, iPad

#### Stack:
- CSS3 Flexbox e Grid
- Bootstrap breakpoints
- Mobile-first approach
- Chart.js com opções responsivas

---

### 4. [Issue #4] Melhorias na Tabela de Viaturas (ABERTA - Ver abaixo)
**Status**: Iniciado / Incompleto  
**Objetivo**: Adicionar funcionalidades essenciais de UX na tabela

#### Requisitos de Busca:
- [ ] Campo de busca por placa/identificação
- [ ] Pesquisa por marca e modelo
- [ ] Busca por número de série
- [ ] Busca em tempo real com debounce (300ms)
- [ ] Botão para limpar busca (X)

#### Requisitos de Filtros:
- [ ] Filtro por status (ativo, inativo, manutenção)
- [ ] Filtro por tipo (carro, van, caminhão, etc)
- [ ] Filtro por setor/unidade
- [ ] Filtro por data de aquisição
- [ ] Combo de filtros simultâneos
- [ ] Botão "Limpar todos os filtros"

#### Requisitos de Paginação:
- [ ] Seletor: 10, 25, 50, 100 itens/página
- [ ] Navegação: primeira, anterior, próxima, última
- [ ] Indicador de página atual
- [ ] Total de registros visível

#### Requisitos de Ordenação:
- [ ] Clicável em cabeçalhos de coluna
- [ ] Ícone de direção (↑ ↓)
- [ ] Suporte a: placa, marca, modelo, status, data

#### Confirmação de Exclusão:
- [ ] Modal de confirmação
- [ ] Mostrar dados da viatura
- [ ] Botões: Cancelar e Confirmar
- [ ] Loader durante exclusão

#### Stack Sugerido:
- DataTables.js
- Material-Table
- TanStack Table
- Bootstrap modal

---

## 🟡 Prioridade MÉDIA - Melhoria de Experiência

### 5. [Issue #5] Sistema de Auditoria e Histórico de Alterações
**Status**: Planejado  
**Objetivo**: Rastrear todas as mudanças de dados

#### Tabela de Histórico:
```sql
CREATE TABLE historico_alteracoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(100),
  registro_id INT,
  acao ENUM('CREATE', 'UPDATE', 'DELETE'),
  dados_antigos JSON,
  dados_novos JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX (tabela, registro_id, data_hora)
);
```

#### APIs de Consulta:
- [ ] GET `/api/audit/history/:table/:record_id` - Histórico de um registro
- [ ] GET `/api/audit/history` - Histórico geral com filtros
- [ ] GET `/api/audit/history/:id/diff` - Visualizar diferença específica

#### Frontend:
- [ ] Timeline de histórico com ícones
- [ ] Visualização de diferenças (antes/depois)
- [ ] Cores por tipo de ação (verde=criar, azul=editar, vermelho=deletar)
- [ ] Relatório de auditoria global com exportação

---

### 6. [Issue #11] Dashboard Avançado com KPIs e Gráficos
**Status**: Planejado  
**Objetivo**: Transformar dashboard em painel analítico

#### KPIs Principais:
- [ ] Total de viaturas (com cor baseada em disponibilidade)
- [ ] Viaturas indisponíveis (número e %)
- [ ] Custos do mês (com comparação período anterior)
- [ ] Ordens de Serviço abertas (destacar urgentes)
- [ ] Taxa de disponibilidade da frota (%)

#### Gráficos Necessários:
- [ ] Gasto por mês (últimos 12 meses) - linha/coluna
- [ ] Disponibilidade da frota (últimos 30 dias) - área
- [ ] Preventiva vs Corretiva - pizza/donut
- [ ] Top 10 viaturas com mais problemas - barra
- [ ] Tempo médio de reparo - por tipo de manutenção

#### Alertas em Destaque:
- [ ] Viaturas vencidas para manutenção preventiva
- [ ] OS em atraso (prazo vencido)
- [ ] Custos acumulados acima do orçamento
- [ ] Muitos reparos na mesma viatura

#### Layout Responsivo:
- [ ] Desktop: 4-6 KPIs, 2-3 gráficos por linha
- [ ] Mobile: 1 KPI por linha, gráficos em tabs
- [ ] Tablet: 2 KPIs por linha, 1-2 gráficos

#### Stack:
- Chart.js / Recharts / Apache ECharts
- moment.js para datas
- CSS Grid para layout

---

### 7. [Issue #10] Sistema de Relatórios com Exportação
**Status**: Planejado  
**Objetivo**: Gerar relatórios em múltiplos formatos

#### Tipos de Relatórios:
1. **Por Período**: Data inicial/final, resumo, listagem OS, gráficos
2. **Por Viatura**: Histórico, custos, tempo parado, rankings
3. **De Custos**: Por período, viatura, tipo, comparação orçado vs realizado
4. **De Disponibilidade**: Taxa média, dias indisponíveis, motivos, impacto
5. **De Manutenção**: Preventiva vs Corretiva, tempo médio, custos

#### Exportação:
- [ ] **Excel (.xlsx)**: Múltiplas abas, formatação, fórmulas
- [ ] **PDF**: Layout profissional, gráficos, paginação
- [ ] **CSV**: Dados brutos, compatível com Power BI

#### Stack:
- ExcelJS / SheetJS
- jsPDF / html2pdf
- Papaparse para CSV

---

## 🔵 Prioridade BAIXA - Essencial para Produção

### 8. [Issue #9] Rastreamento em Tempo Real
**Status**: Incompleto  
**Objetivo**: Implementar mapa interativo com localização das viaturas

#### Features:
- [ ] Mapa em tempo real (Google Maps ou Leaflet)
- [ ] Histórico de localização
- [ ] Última atualização do GPS
- [ ] Velocidade da viatura
- [ ] Status da viatura
- [ ] Filtros por unidade/setor

#### Tecnologias:
- [ ] Leaflet.js (já integrado no index.html)
- [ ] Google Maps API
- [ ] WebSocket para atualizações em tempo real

---

### 9. [Issue #5] Sistema de Notificações
**Status**: Planejado  
**Objetivo**: Alertas e notificações em tempo real

#### Tipos de Notificação:
- [ ] Manutenção programada vencida
- [ ] OS criada/atualizada
- [ ] Viatura indisponível
- [ ] Custos acima do orçamento

#### Tabela:
```sql
CREATE TABLE notificacoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  mensagem TEXT,
  lida BOOLEAN DEFAULT FALSE,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

---

### 10. [Issue #5] Sistema Completo de Logs e Auditoria
**Status**: Planejado  
**Objetivo**: Registro de todas as ações do sistema

#### Tabelas de Log:
```sql
CREATE TABLE logs_sistema (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NULL,
  tipo VARCHAR(50),
  acao VARCHAR(255),
  descricao TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status ENUM('sucesso', 'erro', 'aviso'),
  erro_mensagem TEXT,
  stack_trace TEXT,
  duracao_ms INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (tipo, timestamp),
  INDEX (usuario_id, timestamp)
);

CREATE TABLE logs_login (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NULL,
  email VARCHAR(255),
  status ENUM('sucesso', 'falha'),
  motivo_falha VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (email, timestamp)
);
```

#### Dashboard de Logs (admin only):
- [ ] Tabela com filtros avançados
- [ ] Visualizações de gráficos
- [ ] Exportação como CSV/Excel
- [ ] Pesquisa por termo

#### Logger Framework:
- Winston.js / Bunyan / Pino
- Morgan para HTTP logging
- Elasticsearch (opcional)
- Sentry (opcional)

---

## 📊 Mapa de Dependências

```
┌─────────────────────────────────────────┐
│ #7 Backend API - Sincronização (ALTA)   │
│ Bloqueador de: #4, #5, #9, #10, #11     │
└─────────┬───────────────────────────────┘
          │
    ┌─────┴─────┬──────────┬──────────┬──────────┐
    ▼           ▼          ▼          ▼          ▼
 #4 Viaturas #5 Audit  #9 Rastream #10 Reports #11 Dashboard
 (tabelas)  (hist)    (maps)       (export)    (KPIs)
```

---

## 📈 Roadmap de Implementação

### Semana 1: Alicerce
- [ ] #7: Backend API com autenticação
- [ ] #6: Corrigir edição de OS

### Semana 2: Frontend Essencial
- [ ] #8: Responsividade mobile
- [ ] #4: Melhorias em tabelas de viaturas

### Semana 3: Análise e Rastreamento
- [ ] #11: Dashboard avançado
- [ ] #9: Rastreamento em tempo real

### Semana 4: Relatórios e Auditoria
- [ ] #10: Relatórios com exportação
- [ ] #5: Sistema de auditoria

### Semana 5: Infraestrutura
- [ ] Logs e monitoramento
- [ ] Notificações e alertas
- [ ] Testes completos

---

## 🛠️ Stack Técnico Recomendado

### Backend
- **Node.js** com Express.js
- **JWT** para autenticação
- **Socket.io** ou **SSE** para tempo real
- **Winston.js** ou **Pino** para logs
- **MySQL** ou **PostgreSQL** com migrations

### Frontend
- **Bootstrap 5.3** (já em uso)
- **Chart.js** para gráficos
- **DataTables.js** para tabelas avançadas
- **Leaflet.js** para mapas (já integrado)
- **moment.js** para manipulação de datas
- **Toastr** ou **SweetAlert2** para notificações

### DevOps
- **Docker** para containerização
- **GitHub Actions** para CI/CD
- **Nginx** como reverse proxy
- **SSL/TLS** para HTTPS

---

## 📝 Próximos Passos

1. ✅ Análise completa realizada (Issue #4-11 criadas)
2. ⏳ Implementar Backend API (#7) como alicerce
3. ⏳ Corrigir bugs críticos (#6)
4. ⏳ Implementar responsividade mobile (#8)
5. ⏳ Adicionar melhorias em tabelas (#4)

---

## 📞 Contato e Suporte

Para dúvidas sobre o roadmap ou priorização, abra uma issue no repositório ou envie um PR com sugestões.

**Status**: 📋 Planejamento Completo  
**Última atualização**: 2026-07-04  
**Versão**: 1.0
