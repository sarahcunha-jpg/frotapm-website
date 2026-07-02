// ============================================
// FASE 3: KPIS DINÂMICOS
// ============================================

let sparklines = {};

// Calcular MTTR (Tempo Médio de Reparo)
function calcularMTTR() {
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  const osConcluidas = ordensServico.filter(os => os.status === 'Concluída');
  
  if (osConcluidas.length === 0) {
    return { valor: 0, historico: [] };
  }
  
  const tempoTotalParada = osConcluidas.reduce((sum, os) => 
    sum + parseFloat(os.tempoParada || 0), 0
  );
  
  const mttr = tempoTotalParada / osConcluidas.length;
  const historico = gerarHistoricoMTTR(osConcluidas);
  
  return { valor: mttr.toFixed(2), historico };
}

// Calcular MTBF (Tempo Médio Entre Falhas)
function calcularMTBF() {
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  if (ordensServico.length < 2) {
    return { valor: 0, historico: [] };
  }
  
  const osOrdenadas = [...ordensServico].sort((a, b) => 
    new Date(a.data) - new Date(b.data)
  );
  
  let intervalos = [];
  for (let i = 1; i < osOrdenadas.length; i++) {
    const dataAtual = new Date(osOrdenadas[i].data);
    const dataAnterior = new Date(osOrdenadas[i - 1].data);
    const dias = (dataAtual - dataAnterior) / (1000 * 60 * 60 * 24);
    intervalos.push(dias);
  }
  
  const mtbf = intervalos.length > 0 
    ? (intervalos.reduce((a, b) => a + b, 0) / intervalos.length).toFixed(2)
    : 0;
  
  return { valor: mtbf, historico: intervalos.slice(-6) };
}

// Calcular Disponibilidade
function calcularDisponibilidade() {
  const viaturas = JSON.parse(localStorage.getItem('viaturas')) || [];
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  if (viaturas.length === 0) {
    return { valor: 100, historico: [100] };
  }
  
  const viaturaEmManutencao = new Set();
  ordensServico
    .filter(os => ['Aberta', 'Em Progresso'].includes(os.status))
    .forEach(os => viaturaEmManutencao.add(os.viatura));
  
  const disponibilidade = ((viaturas.length - viaturaEmManutencao.size) / viaturas.length * 100).toFixed(2);
  
  return { valor: disponibilidade, historico: [disponibilidade] };
}

// Calcular Custo Médio por Viatura
function calcularCustoMedioViatura() {
  const viaturas = JSON.parse(localStorage.getItem('viaturas')) || [];
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  
  if (viaturas.length === 0) {
    return { valor: 0, historico: [] };
  }
  
  const custoTotal = ordensServico.reduce((sum, os) => 
    sum + parseFloat(os.custo || 0), 0
  );
  
  const custoPorViatura = (custoTotal / viaturas.length).toFixed(2);
  
  return { valor: custoPorViatura, historico: [custoPorViatura] };
}

// Gerar histórico MTTR
function gerarHistoricoMTTR(osConcluidas) {
  const historicoMes = {};
  const hoje = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const chave = `${data.getMonth() + 1}/${data.getFullYear()}`;
    historicoMes[chave] = { total: 0, count: 0 };
  }
  
  osConcluidas.forEach(os => {
    const dataOS = new Date(os.data);
    const chave = `${dataOS.getMonth() + 1}/${dataOS.getFullYear()}`;
    if (historicoMes[chave]) {
      historicoMes[chave].total += parseFloat(os.tempoParada || 0);
      historicoMes[chave].count += 1;
    }
  });
  
  return Object.values(historicoMes).map(mes => 
    mes.count > 0 ? (mes.total / mes.count).toFixed(2) : 0
  );
}

// Calcular variação percentual
function calcularVariacao(valorAtual, historicoAnterior) {
  if (!historicoAnterior || historicoAnterior.length === 0) {
    return 0;
  }
  
  const mediaAnterior = historicoAnterior.reduce((a, b) => a + parseFloat(b), 0) / historicoAnterior.length;
  const variacao = ((valorAtual - mediaAnterior) / mediaAnterior * 100).toFixed(1);
  
  return variacao;
}

// Renderizar Sparkline
function renderizarSparkline(canvasId, dados) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (sparklines[canvasId]) {
    sparklines[canvasId].destroy();
  }
  
  const datosNumero = dados.map(d => parseFloat(d));
  const min = Math.min(...datosNumero);
  const max = Math.max(...datosNumero);
  
  sparklines[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map((_, i) => i),
      datasets: [{
        data: datosNumero,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.max(0, min - 10),
          max: max + 10,
          grid: { display: false },
          ticks: { display: false }
        },
        x: {
          display: false
        }
      }
    }
  });
}

// Atualizar seção de KPIs
function atualizarKPIs() {
  // MTTR
  const mttr = calcularMTTR();
  const variacao_mttr = calcularVariacao(mttr.valor, mttr.historico);
  const mttrEl = document.getElementById('mttr-valor');
  const mttrVarEl = document.getElementById('mttr-variacao');
  if (mttrEl) mttrEl.textContent = `${mttr.valor} dias`;
  if (mttrVarEl) {
    mttrVarEl.textContent = `${variacao_mttr > 0 ? '+' : ''}${variacao_mttr}%`;
    mttrVarEl.className = `kpi-variacao ${variacao_mttr > 0 ? 'negativo' : 'positivo'}`;
  }
  renderizarSparkline('sparklineMTTR', mttr.historico);
  
  // MTBF
  const mtbf = calcularMTBF();
  const variacao_mtbf = calcularVariacao(mtbf.valor, mtbf.historico);
  const mtbfEl = document.getElementById('mtbf-valor');
  const mtbfVarEl = document.getElementById('mtbf-variacao');
  if (mtbfEl) mtbfEl.textContent = `${mtbf.valor} dias`;
  if (mtbfVarEl) {
    mtbfVarEl.textContent = `${variacao_mtbf > 0 ? '+' : ''}${variacao_mtbf}%`;
    mtbfVarEl.className = `kpi-variacao ${variacao_mtbf > 0 ? 'positivo' : 'negativo'}`;
  }
  renderizarSparkline('sparklineMTBF', mtbf.historico);
  
  // Disponibilidade
  const disponibilidade = calcularDisponibilidade();
  const variacao_disponibilidade = calcularVariacao(disponibilidade.valor, [95]);
  const dispEl = document.getElementById('disponibilidade-valor');
  const dispVarEl = document.getElementById('disponibilidade-variacao');
  if (dispEl) dispEl.textContent = `${disponibilidade.valor}%`;
  if (dispVarEl) {
    dispVarEl.textContent = `${variacao_disponibilidade > 0 ? '+' : ''}${variacao_disponibilidade}%`;
    dispVarEl.className = `kpi-variacao ${variacao_disponibilidade > 0 ? 'positivo' : 'negativo'}`;
  }
  renderizarSparkline('sparklineDisponibilidade', disponibilidade.historico);
  
  // Custo Médio por Viatura
  const custoPorViatura = calcularCustoMedioViatura();
  const variacao_custo = calcularVariacao(custoPorViatura.valor, [custoPorViatura.valor * 1.1]);
  const custoEl = document.getElementById('custo-viatura-valor');
  const custoVarEl = document.getElementById('custo-viatura-variacao');
  if (custoEl) custoEl.textContent = `R$ ${parseFloat(custoPorViatura.valor).toFixed(2)}`;
  if (custoVarEl) {
    custoVarEl.textContent = `${variacao_custo > 0 ? '+' : ''}${variacao_custo}%`;
    custoVarEl.className = `kpi-variacao ${variacao_custo > 0 ? 'negativo' : 'positivo'}`;
  }
  renderizarSparkline('sparklineCustoViatura', custoPorViatura.historico);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  atualizarKPIs();
  setInterval(atualizarKPIs, 30000);
});