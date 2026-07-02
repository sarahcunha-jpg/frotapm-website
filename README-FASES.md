# 🚀 Sistema de Gestão de Frota - Implementação em Fases

## 📚 Documentação Completa

Este repositório contém a implementação completa de um **Sistema de Gestão de Manutenção de Frota** desenvolvido em 4 fases progressivas.

---

## 📋 Fases Implementadas

### ✅ **FASE 1: Manipulação de Dados**
**Arquivo:** `js/script-fase1.js`

Implementa todas as funções de **edição e exclusão** de dados:
- ✏️ Editar Ordens de Serviço (OS)
- 🗑️ Excluir OS com confirmação
- ⚙️ Editar Manutenção Preventiva
- 🗑️ Excluir Manutenção Preventiva
- 📝 Geração automática de histórico ao concluir preventiva

**Modais HTML:**
- `#modalEditarOS` - Modal para editar OS
- `#modalEditarPreventiva` - Modal para editar preventiva

---

### 📊 **FASE 2: Dashboard Dinâmico**
**Arquivo:** `js/script-fase2.js`

Implementa visualizações em tempo real:
- 📈 Gráfico de Rosca (Disponibilidade)
- 📉 Gráfico de Linhas (Custos últimos 6 meses)
- 📊 Gráfico de Barras Horizontais (Falhas recorrentes)
- 🔄 Atualização automática a cada 30 segundos
- 💯 Indicadores rápidos (Total, Custo, etc)

**Dependência:** Chart.js CDN

---

### 📈 **FASE 3: KPIs Dinâmicos**
**Arquivo:** `js/script-fase3.js`

Implementa cálculos e indicadores profissionais:
- ⏱️ **MTTR** - Tempo Médio de Reparo
- ⏳ **MTBF** - Tempo Médio Entre Falhas
- 🟢 **Disponibilidade** - % da frota operacional
- 💰 **Custo/Viatura** - Custo médio por unidade
- 📊 **Sparklines** - Mini-gráficos de tendência
- 📉 **Variação** - Comparação com período anterior

---

### 📄 **FASE 4: Exportação de Dados**
**Arquivo:** `js/script-fase4.js`

Implementa exportação em formatos profissionais:
- 📕 **PDF** - Relatórios formatados com html2pdf
- 📗 **Excel** - Planilhas com múltiplas abas via XLSX

**Tipos de Relatório:**
1. Ordens de Serviço completas
2. Plano de Manutenção Preventiva
3. Análise de Custos (por viatura e tipo)
4. Relatório Executivo Completo

---

## 🛠️ Como Usar

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- localStorage ativado
- JavaScript habilitado

### Instalação Rápida

1. **Copiar arquivos JavaScript:**
   ```
   js/script-fase1.js
   js/script-fase2.js
   js/script-fase3.js
   js/script-fase4.js
   ```

2. **Incluir CSS:**
   ```
   css/sistema-frota.css
   ```

3. **Adicionar ao HTML:**
   ```html
   <!-- HEAD -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
   <link rel="stylesheet" href="css/sistema-frota.css">
   
   <!-- BODY (antes de </body>) -->
   <script src="js/script-fase1.js"></script>
   <script src="js/script-fase2.js"></script>
   <script src="js/script-fase3.js"></script>
   <script src="js/script-fase4.js"></script>
   ```

4. **Adicionar Modais HTML:**
   Copiar conteúdo de `html/modal-editar-os.html` e `html/modal-editar-preventiva.html` para o `index.html`

### Inicializar com Dados de Teste

```javascript
const dadosTeste = {
  ordensServico: [
    {
      id: 1,
      viatura: "PM-001",
      tipo: "Preventiva",
      data: "2025-01-15",
      descricao: "Troca de óleo",
      custo: 250.00,
      status: "Concluída",
      tempoParada: 1.5
    }
  ],
  manutencaoPreventiva: [
    {
      id: 1,
      viatura: "PM-001",
      tipo: "Troca de óleo",
      frequencia: 5000,
      proximaExecucao: "2025-03-01",
      status: "Pendente"
    }
  ],
  viaturas: [
    {
      id: 1,
      placa: "ABC-1234",
      modelo: "Sprinter",
      status: "Operacional"
    }
  ]
};

Object.entries(dadosTeste).forEach(([chave, valor]) => {
  localStorage.setItem(chave, JSON.stringify(valor));
});
```

---

## 📊 Estrutura de Dados

### Ordens de Serviço
```javascript
{
  id: number,
  viatura: string,
  tipo: "Preventiva" | "Corretiva" | "Emergencial",
  data: "YYYY-MM-DD",
  descricao: string,
  custo: number,
  status: "Aberta" | "Em Progresso" | "Concluída",
  tempoParada: number // em dias
}
```

### Manutenção Preventiva
```javascript
{
  id: number,
  viatura: string,
  tipo: string,
  frequencia: number, // em km
  proximaExecucao: "YYYY-MM-DD",
  status: "Pendente" | "Em Execução" | "Concluído"
}
```

### Viaturas
```javascript
{
  id: number,
  placa: string,
  modelo: string,
  status: string
}
```

---

## 🎯 Funcionalidades Principais

### Edição e Exclusão (Fase 1)
- [x] Modal com pré-preenchimento de dados
- [x] Validação de formulários
- [x] Confirmação antes de excluir
- [x] Integração com localStorage
- [x] Atualização automática de tabelas

### Dashboard (Fase 2)
- [x] Gráficos interativos com Chart.js
- [x] Cálculo dinâmico de disponibilidade
- [x] Análise de custos por período
- [x] Identificação de falhas recorrentes
- [x] Refresh automático a cada 30s

### KPIs (Fase 3)
- [x] Fórmulas profissionais (MTTR, MTBF)
- [x] Cálculo de tendências
- [x] Sparklines dinâmicos
- [x] Variação percentual (positiva/negativa)
- [x] Comparação com benchmarks

### Exportação (Fase 4)
- [x] Geração de PDF formatado
- [x] Planilhas Excel com múltiplas abas
- [x] Filtro por período de datas
- [x] 4 tipos de relatório disponíveis
- [x] Download automático

---

## 🔄 Fluxo de Funcionamento

```
┌─────────────────────────────────────┐
│  Usuário Edita/Exclui Dados        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Atualiza localStorage (Fase 1)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Chama atualizarDashboard() (F2/F3) │
└────────────┬────────────────────────┘
             │
             ├─────────────────────┬──────────────────┐
             ▼                     ▼                  ▼
      Redesenha Gráficos      Recalcula KPIs   Atualiza Indicadores
      (Chart.js)             (MTTR, MTBF)     (Total, Custo)
             │                     │                  │
             └─────────────────────┴──────────────────┘
                             │
                             ▼
                   Usuário vê tudo atualizado
                   em tempo real!
```

---

## 📞 Suporte e Contribuição

Para dúvidas ou melhorias, consulte a documentação técnica em `docs/GUIA-IMPLEMENTACAO.md`

---

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Versão:** 1.0.0  
**Último update:** 02/07/2025  
**Status:** ✅ Pronto para produção
