// ============================================
// FASE 2: DASHBOARD DINÂMICO
// ============================================

let chartDisponibilidade = null;
let chartCustos = null;
let chartFalhas = null;

// Atualizar Dashboard - Função Principal
function atualizarDashboard() {
  atualizarIndicadoresRapidos();
  atualizarChartDisponibilidade();
  atualizarChartCustos();
  atualizarChartFalhas();
  atualizarKPIs();
}

// 1. Atualizar Indicadores Rápidos
function atualizarIndicadoresRapidos() {
  const viaturas = JSON.parse(localStorage.getItem('viaturas')) || [];
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  const totalViaturas = viaturas.length;
  const totalOS = ordensServico.length;
  const custoTotal = ordensServico.reduce((sum, os) => sum + parseFloat(os.custo || 0), 0);
  
  const totalViaturasEl = document.getElementById('totalViaturas');
  const totalOSEl = document.getElementById('totalOS');
  const custoTotalEl = document.getElementById('custoTotal');
  
  if (totalViaturasEl) totalViaturasEl.textContent = totalViaturas;
  if (totalOSEl) totalOSEl.textContent = totalOS;
  if (custoTotalEl) custoTotalEl.textContent = `R$ ${custoTotal.toFixed(2)}`;
}

// 2. Gráfico de Rosca - Disponibilidade da Frota
function atualizarChartDisponibilidade() {
  const viaturas = JSON.parse(localStorage.getItem('viaturas')) || [];
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  const viaturaEmManutencao = new Set();
  ordensServico
    .filter(os => ['Aberta', 'Em Progresso'].includes(os.status))
    .forEach(os => viaturaEmManutencao.add(os.viatura));
  
  const emOperacao = viaturas.length - viaturaEmManutencao.size;
  const emManutencao = viaturaEmManutencao.size;
  
  const ctx = document.getElementById('chartDisponibilidade')?.getContext('2d');
  if (!ctx) return;
  
  if (chartDisponibilidade) {
    chartDisponibilidade.destroy();
  }
  
  chartDisponibilidade = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Em Operação', 'Em Manutenção'],
      datasets: [{
        data: [emOperacao, emManutencao],
        backgroundColor: ['#28a745', '#ffc107'],
        borderColor: ['#20c997', '#fd7e14'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// 3. Gráfico de Linhas - Custos Últimos 6 Meses
function atualizarChartCustos() {
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  const custoPorMes = {};
  const hoje = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
    custoPorMes[mesAno] = 0;
  }
  
  ordensServico.forEach(os => {
    const dataOS = new Date(os.data);
    const mesAno = `${String(dataOS.getMonth() + 1).padStart(2, '0')}/${dataOS.getFullYear()}`;
    if (custoPorMes.hasOwnProperty(mesAno)) {
      custoPorMes[mesAno] += parseFloat(os.custo || 0);
    }
  });
  
  const labels = Object.keys(custoPorMes);
  const dados = Object.values(custoPorMes);
  
  const ctx = document.getElementById('chartCustos')?.getContext('2d');
  if (!ctx) return;
  
  if (chartCustos) {
    chartCustos.destroy();
  }
  
  chartCustos = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Custos (R$)',
        data: dados,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#007bff',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 4. Gráfico de Barras - Falhas Recorrentes
function atualizarChartFalhas() {
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  const falhasPorTipo = {};
  ordensServico.forEach(os => {
    const tipo = os.tipo || 'Outro';
    falhasPorTipo[tipo] = (falhasPorTipo[tipo] || 0) + 1;
  });
  
  const tiposOrdenados = Object.entries(falhasPorTipo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const labels = tiposOrdenados.map(item => item[0]);
  const dados = tiposOrdenados.map(item => item[1]);
  
  const ctx = document.getElementById('chartFalhas')?.getContext('2d');
  if (!ctx) return;
  
  if (chartFalhas) {
    chartFalhas.destroy();
  }
  
  chartFalhas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade',
        data: dados,
        backgroundColor: '#dc3545',
        borderColor: '#c82333',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
}

// Inicializar Dashboard
document.addEventListener('DOMContentLoaded', function() {
  atualizarDashboard();
  setInterval(atualizarDashboard, 30000); // Atualizar a cada 30 segundos
});