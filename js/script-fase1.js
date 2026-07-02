// ============================================
// FASE 1: EDITAR E EXCLUIR OS
// ============================================

// Renderizar tabela de OS
function renderizarTabelaOS() {
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  const tbody = document.getElementById('corpoTabelaOS');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  ordensServico.forEach((os, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${os.id || index + 1}</td>
      <td>${os.viatura}</td>
      <td>${os.tipo}</td>
      <td>${new Date(os.data).toLocaleDateString('pt-BR')}</td>
      <td>R$ ${parseFloat(os.custo).toFixed(2)}</td>
      <td><span class="badge bg-${os.status.toLowerCase().replace(' ', '-')}">${os.status}</span></td>
      <td>${os.tempoParada} dias</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="abrirModalEditarOS(${index})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="excluirOS(${index})" title="Excluir">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Abrir modal para editar OS
function abrirModalEditarOS(index) {
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  const os = ordensServico[index];
  
  if (!os) {
    alert('OS não encontrada!');
    return;
  }
  
  // Preencher campos do modal
  document.getElementById('edit-os-id').value = index;
  document.getElementById('edit-viatura').value = os.viatura;
  document.getElementById('edit-tipo').value = os.tipo;
  document.getElementById('edit-data').value = os.data;
  document.getElementById('edit-descricao').value = os.descricao || '';
  document.getElementById('edit-custo').value = os.custo;
  document.getElementById('edit-status').value = os.status;
  document.getElementById('edit-tempo-parada').value = os.tempoParada;
  
  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById('modalEditarOS'));
  modal.show();
}

// Fechar modal editar OS
function fecharModalEditarOS() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarOS'));
  if (modal) modal.hide();
}

// Salvar alterações da OS
document.getElementById('formEditarOS')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  const index = parseInt(document.getElementById('edit-os-id').value);
  
  if (index < 0 || index >= ordensServico.length) {
    alert('Índice inválido!');
    return;
  }
  
  ordensServico[index] = {
    ...ordensServico[index],
    viatura: document.getElementById('edit-viatura').value,
    tipo: document.getElementById('edit-tipo').value,
    data: document.getElementById('edit-data').value,
    descricao: document.getElementById('edit-descricao').value,
    custo: parseFloat(document.getElementById('edit-custo').value),
    status: document.getElementById('edit-status').value,
    tempoParada: parseFloat(document.getElementById('edit-tempo-parada').value)
  };
  
  localStorage.setItem('ordensServico', JSON.stringify(ordensServico));
  
  alert('OS atualizada com sucesso!');
  fecharModalEditarOS();
  renderizarTabelaOS();
  atualizarDashboard();
});

// Excluir OS
function excluirOS(index) {
  if (confirm('Tem certeza que deseja excluir esta OS?')) {
    const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
    ordensServico.splice(index, 1);
    localStorage.setItem('ordensServico', JSON.stringify(ordensServico));
    
    alert('OS excluída com sucesso!');
    renderizarTabelaOS();
    atualizarDashboard();
  }
}

// ============================================
// EDITAR E EXCLUIR MANUTENÇÃO PREVENTIVA
// ============================================

// Renderizar tabela de Manutenção Preventiva
function renderizarTabelaManutenção() {
  const manutencoes = JSON.parse(localStorage.getItem('manutencaoPreventiva')) || [];
  const tbody = document.getElementById('corpoTabelaManutenção');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  manutencoes.forEach((manutencao, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${manutencao.id || index + 1}</td>
      <td>${manutencao.viatura}</td>
      <td>${manutencao.tipo}</td>
      <td>${manutencao.frequencia} km</td>
      <td>${new Date(manutencao.proximaExecucao).toLocaleDateString('pt-BR')}</td>
      <td><span class="badge bg-${manutencao.status.toLowerCase()}">${manutencao.status}</span></td>
      <td>
        <button class="btn btn-sm btn-info" onclick="abrirModalEditarPreventiva(${index})" title="Editar">
          <i class="fas fa-cog"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="excluirPreventiva(${index})" title="Excluir">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Abrir modal para editar manutenção preventiva
function abrirModalEditarPreventiva(index) {
  const manutencoes = JSON.parse(localStorage.getItem('manutencaoPreventiva')) || [];
  const manutencao = manutencoes[index];
  
  if (!manutencao) {
    alert('Manutenção não encontrada!');
    return;
  }
  
  document.getElementById('edit-preventiva-id').value = index;
  document.getElementById('edit-prev-viatura').value = manutencao.viatura;
  document.getElementById('edit-prev-tipo').value = manutencao.tipo;
  document.getElementById('edit-prev-frequencia').value = manutencao.frequencia;
  document.getElementById('edit-prev-proxima').value = manutencao.proximaExecucao;
  document.getElementById('edit-prev-status').value = manutencao.status;
  
  const modal = new bootstrap.Modal(document.getElementById('modalEditarPreventiva'));
  modal.show();
}

// Fechar modal editar preventiva
function fecharModalEditarPreventiva() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarPreventiva'));
  if (modal) modal.hide();
}

// Salvar alterações da manutenção preventiva
document.getElementById('formEditarPreventiva')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const manutencoes = JSON.parse(localStorage.getItem('manutencaoPreventiva')) || [];
  const index = parseInt(document.getElementById('edit-preventiva-id').value);
  
  if (index < 0 || index >= manutencoes.length) {
    alert('Índice inválido!');
    return;
  }
  
  const novaFrequencia = parseFloat(document.getElementById('edit-prev-frequencia').value);
  const novoStatus = document.getElementById('edit-prev-status').value;
  const proximaExecucao = document.getElementById('edit-prev-proxima').value;
  
  manutencoes[index] = {
    ...manutencoes[index],
    frequencia: novaFrequencia,
    proximaExecucao: proximaExecucao,
    status: novoStatus
  };
  
  // Se mudar status para "Concluído", gerar automaticamente entrada no histórico
  if (novoStatus === 'Concluído') {
    const historicoManutenção = JSON.parse(localStorage.getItem('historicoManutenção')) || [];
    
    historicoManutenção.push({
      viatura: manutencoes[index].viatura,
      tipo: manutencoes[index].tipo,
      dataExecucao: new Date().toISOString().split('T')[0],
      proximaExecucao: calcularProximaExecucao(proximaExecucao, novaFrequencia),
      custo: 0,
      observacoes: 'Gerado automaticamente ao concluir manutenção preventiva'
    });
    
    localStorage.setItem('historicoManutenção', JSON.stringify(historicoManutenção));
    manutencoes[index].status = 'Pendente';
  }
  
  localStorage.setItem('manutencaoPreventiva', JSON.stringify(manutencoes));
  
  alert('Manutenção Preventiva atualizada com sucesso!');
  fecharModalEditarPreventiva();
  renderizarTabelaManutenção();
  atualizarDashboard();
});

// Excluir manutenção preventiva
function excluirPreventiva(index) {
  if (confirm('Tem certeza que deseja excluir esta manutenção preventiva?')) {
    const manutencoes = JSON.parse(localStorage.getItem('manutencaoPreventiva')) || [];
    manutencoes.splice(index, 1);
    localStorage.setItem('manutencaoPreventiva', JSON.stringify(manutencoes));
    
    alert('Manutenção Preventiva excluída com sucesso!');
    renderizarTabelaManutenção();
    atualizarDashboard();
  }
}

// Função auxiliar: calcular próxima execução
function calcularProximaExecucao(dataAtual, frequenciaKm) {
  const data = new Date(dataAtual);
  data.setDate(data.getDate() + 30);
  return data.toISOString().split('T')[0];
}

// Função placeholder
function atualizarDashboard() {
  console.log('Dashboard será atualizado...');
}

// Inicializar ao carregar página
document.addEventListener('DOMContentLoaded', function() {
  renderizarTabelaOS();
  renderizarTabelaManutenção();
});