# Guia de Implementação - Sistema de Gestão de Frota

## 📋 Visão Geral

Este documento descreve como implementar as 4 fases do sistema de gestão de frota com suporte a:
- Edição e exclusão de Ordens de Serviço (OS)
- Dashboard dinâmico com Chart.js
- KPIs com cálculos automáticos
- Exportação em PDF e Excel

---

## 🚀 Fase 1: Editar e Excluir OS (Manipulação de Dados)

### Arquivos necessários:
- `js/script-fase1.js`
- Modais HTML no `index.html`

### O que implementa:
✅ Renderização dinâmica de tabelas com botões de ação  
✅ Modal para editar Ordens de Serviço  
✅ Modal para editar Manutenção Preventiva  
✅ Exclusão com confirmação  
✅ Geração automática de histórico ao concluir manutenção  

### Como usar:
```html
<!-- Incluir no index.html -->
<script src="js/script-fase1.js"></script>
```

### Funções principais:
- `renderizarTabelaOS()` - Atualiza tabela de OS
- `abrirModalEditarOS(index)` - Abre modal de edição
- `excluirOS(index)` - Deleta uma OS
- `renderizarTabelaManutenção()` - Atualiza tabela de preventiva
- `abrirModalEditarPreventiva(index)` - Abre modal de preventiva
- `excluirPreventiva(index)` - Deleta preventiva

---

## 📊 Fase 2: Dashboard Dinâmico

### Arquivos necessários:
- `js/script-fase2.js`
- Chart.js CDN (já incluído no index.html)

### O que implementa:
✅ Gráfico de Rosca (Disponibilidade)  
✅ Gráfico de Linhas (Custos últimos 6 meses)  
✅ Gráfico de Barras (Falhas recorrentes)  
✅ Atualização automática de indicadores  
✅ Refresh a cada 30 segundos  

### Funções principais:
- `atualizarDashboard()` - Função principal que atualiza tudo
- `atualizarIndicadoresRapidos()` - Números rápidos (Total, Custo, etc)
- `atualizarChartDisponibilidade()` - Gráfico de rosca
- `atualizarChartCustos()` - Gráfico de linhas
- `atualizarChartFalhas()` - Gráfico de barras

---

## 📈 Fase 3: KPIs Dinâmicos

### Arquivos necessários:
- `js/script-fase3.js`

### O que implementa:
✅ MTTR (Tempo Médio de Reparo)  
✅ MTBF (Tempo Médio Entre Falhas)  
✅ Disponibilidade da Frota (%)  
✅ Custo Médio por Viatura  
✅ Sparklines (mini-gráficos de tendência)  
✅ Variação percentual (positiva/negativa)  

### Fórmulas implementadas:
```
MTTR = Soma(tempoParada de OS concluídas) / Total de OS concluídas
MTBF = Média dos intervalos entre OS
Disponibilidade = (Viaturas - Em Manutenção) / Total Viaturas × 100
Custo/Viatura = Custo Total / Total de Viaturas
```

### Funções principais:
- `calcularMTTR()` - Calcula tempo médio de reparo
- `calcularMTBF()` - Calcula tempo entre falhas
- `calcularDisponibilidade()` - Porcentagem de disponibilidade
- `calcularCustoMedioViatura()` - Custo médio
- `atualizarKPIs()` - Atualiza todos os KPIs
- `renderizarSparkline(id, dados)` - Mini-gráfico

---

## 📄 Fase 4: Exportação PDF e Excel

### Arquivos necessários:
- `js/script-fase4.js`
- Bibliotecas CDN (html2pdf e XLSX carregadas automaticamente)

### O que implementa:
✅ Geração de PDF com formatação profissional  
✅ Geração de Excel com múltiplas abas  
✅ Filtro por período de datas  
✅ 4 tipos de relatórios disponíveis  
✅ Indicadores automáticos  

### Tipos de Relatório:
1. **Ordens de Serviço** - Lista completa de OS
2. **Manutenção Preventiva** - Plano preventivo
3. **Custos** - Análise por viatura e tipo
4. **Completo** - Relatório executivo com tudo

### Funções principais:
- `obterDadosRelatorio()` - Monta dados filtrados
- `gerarPDF()` - Gera e baixa PDF
- `gerarExcel()` - Gera e baixa Excel

---

## 📦 Estrutura de Dados no localStorage

```javascript
// Ordens de Serviço
{
  ordensServico: [
    {
      id: 1,
      viatura: "Van-001",
      tipo: "Preventiva",
      data: "2025-01-15",
      descricao: "Troca de óleo",
      custo: 250.00,
      status: "Concluída",
      tempoParada: 1.5
    }
  ]
}

// Manutenção Preventiva
{
  manutencaoPreventiva: [
    {
      id: 1,
      viatura: "Van-001",
      tipo: "Troca de óleo",
      frequencia: 5000,
      proximaExecucao: "2025-03-01",
      status: "Pendente"
    }
  ]
}

// Viaturas
{
  viaturas: [
    {
      id: 1,
      placa: "ABC-1234",
      modelo: "Sprinter",
      status: "Ativo"
    }
  ]
}
```

---

## 🔧 Instalação Passo a Passo

### 1. Incluir Scripts no HTML
```html
<!-- Antes de </head> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>

<!-- Antes de </body> -->
<script src="js/script-fase1.js"></script>
<script src="js/script-fase2.js"></script>
<script src="js/script-fase3.js"></script>
<script src="js/script-fase4.js"></script>
```

### 2. Incluir CSS
```html
<link rel="stylesheet" href="css/sistema-frota.css">
```

### 3. Adicionar Modais ao HTML
Copiar os modais das seções Phase 1 do repositório para o index.html

### 4. Inicializar Dados de Teste (Opcional)
```javascript
function inicializarDadosTeste() {
  const dadosTeste = {
    ordensServico: [
      {
        id: 1,
        viatura: "PM-001",
        tipo: "Preventiva",
        data: "2025-01-15",
        descricao: "Revisão geral",
        custo: 350.00,
        status: "Concluída",
        tempoParada: 2
      }
    ],
    manutencaoPreventiva: [
      {
        id: 1,
        viatura: "PM-001",
        tipo: "Revisão de freios",
        frequencia: 15000,
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
}
```

---

## ✅ Checklist Final

- [ ] Scripts fase 1, 2, 3, 4 incluídos
- [ ] CSS sistema-frota.css incluído
- [ ] Modais adicionados ao HTML
- [ ] Dados de teste carregados no localStorage
- [ ] Dashboard atualiza ao editar/excluir
- [ ] Gráficos aparecem corretamente
- [ ] KPIs calculam corretamente
- [ ] PDF gerado com sucesso
- [ ] Excel gerado com sucesso

---

## 🐛 Troubleshooting

### Dashboard não atualiza
- Verificar se `atualizarDashboard()` está sendo chamado
- Confirmar que Chart.js está carregado
- Verificar console para erros de JavaScript

### PDF/Excel não baixam
- Aguarde carregamento das bibliotecas CDN
- Verificar se há bloqueador de pop-ups
- Testar em navegador diferente

### Dados não persistem
- Verificar se localStorage está ativado no navegador
- Limpar cache do navegador
- Testar em aba anônima

---

## 📞 Suporte
Para dúvidas sobre implementação, consulte os arquivos de código comentados no repositório.