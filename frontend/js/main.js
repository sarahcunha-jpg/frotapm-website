// Global State
let viaturasPagination = { page: 1, limit: 10, total: 0 };
let osPagination = { page: 1, limit: 10, total: 0 };
let allViaturas = [];
let editingViaturaId = null;
let editingOSId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadViaturas();
  loadOS();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  // Viatura Form
  document.getElementById('save-viatura').addEventListener('click', saveViatura);
  document.getElementById('viaturasModal').addEventListener('hidden.bs.modal', resetViaturasForm);
  document.getElementById('search-viaturas').addEventListener('input', debounce(loadViaturas, 300));
  document.getElementById('filter-status').addEventListener('change', loadViaturas);

  // OS Form
  document.getElementById('save-os').addEventListener('click', saveOS);
  document.getElementById('osModal').addEventListener('hidden.bs.modal', resetOSForm);
}

// Load Viaturas
async function loadViaturas(page = 1) {
  try {
    const search = document.getElementById('search-viaturas').value;
    const status = document.getElementById('filter-status').value;
    const filters = {};
    if (search) filters.search = search;
    if (status) filters.status = status;

    const response = await api.getViaturas(page, viaturasPagination.limit, filters);
    allViaturas = response.data;
    viaturasPagination = response.pagination;

    renderViaturas();
    updateDashboard();
  } catch (error) {
    showAlert('Erro ao carregar viaturas', 'danger');
  }
}

// Render Viaturas
function renderViaturas() {
  const tbody = document.getElementById('viaturas-tbody');
  if (allViaturas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma viatura encontrada</td></tr>';
    return;
  }

  tbody.innerHTML = allViaturas.map(v => `
    <tr>
      <td><strong>${v.placa}</strong></td>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td>${v.tipo}</td>
      <td><span class="badge badge-${v.status}">${v.status}</span></td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editViatura(${v.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteViatura(${v.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  renderPagination('viaturas');
}

// Edit Viatura
function editViatura(id) {
  const viatura = allViaturas.find(v => v.id === id);
  if (!viatura) return;

  editingViaturaId = id;
  document.getElementById('viatura-placa').value = viatura.placa;
  document.getElementById('viatura-marca').value = viatura.marca;
  document.getElementById('viatura-modelo').value = viatura.modelo;
  document.getElementById('viatura-tipo').value = viatura.tipo;
  document.getElementById('viatura-status').value = viatura.status;

  document.getElementById('viaturasModalLabel').textContent = 'Editar Viatura';
  const modal = new bootstrap.Modal(document.getElementById('viaturasModal'));
  modal.show();
}

// Save Viatura
async function saveViatura() {
  try {
    const data = {
      placa: document.getElementById('viatura-placa').value,
      marca: document.getElementById('viatura-marca').value,
      modelo: document.getElementById('viatura-modelo').value,
      tipo: document.getElementById('viatura-tipo').value,
      status: document.getElementById('viatura-status').value
    };

    if (!data.placa || !data.marca || !data.modelo) {
      showAlert('Preencha os campos obrigatórios', 'warning');
      return;
    }

    if (editingViaturaId) {
      await api.updateViatura(editingViaturaId, data);
      showAlert('Viatura atualizada com sucesso!', 'success');
    } else {
      await api.createViatura(data);
      showAlert('Viatura criada com sucesso!', 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('viaturasModal')).hide();
    loadViaturas();
  } catch (error) {
    showAlert('Erro ao salvar viatura: ' + error.message, 'danger');
  }
}

// Delete Viatura
async function deleteViatura(id) {
  if (!confirm('Deseja deletar esta viatura?')) return;

  try {
    await api.deleteViatura(id);
    showAlert('Viatura deletada com sucesso!', 'success');
    loadViaturas();
  } catch (error) {
    showAlert('Erro ao deletar viatura', 'danger');
  }
}

// Load OS
async function loadOS(page = 1) {
  try {
    const response = await api.getOS(page, osPagination.limit);
    osPagination = response.pagination;
    renderOS(response.data);
  } catch (error) {
    showAlert('Erro ao carregar ordens de serviço', 'danger');
  }
}

// Render OS
function renderOS(osData) {
  const tbody = document.getElementById('os-tbody');
  if (osData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma OS encontrada</td></tr>';
    return;
  }

  tbody.innerHTML = osData.map(os => `
    <tr>
      <td>#${os.id}</td>
      <td>${allViaturas.find(v => v.id === os.viatura_id)?.placa || 'N/A'}</td>
      <td>${os.tipo_manutencao}</td>
      <td><span class="badge badge-${os.status}">${os.status}</span></td>
      <td>${new Date(os.data_abertura).toLocaleDateString('pt-BR')}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editOS(${os.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteOS(${os.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  renderPagination('os');
}

// Edit OS
async function editOS(id) {
  try {
    const os = await api.getOSById(id);
    editingOSId = id;
    document.getElementById('os-viatura').value = os.viatura_id;
    document.getElementById('os-tipo').value = os.tipo_manutencao;
    document.getElementById('os-descricao').value = os.descricao || '';
    document.getElementById('os-status').value = os.status;
    document.getElementById('osModalLabel').textContent = 'Editar OS';
    const modal = new bootstrap.Modal(document.getElementById('osModal'));
    modal.show();
  } catch (error) {
    showAlert('Erro ao carregar OS', 'danger');
  }
}

// Save OS
async function saveOS() {
  try {
    const data = {
      viatura_id: parseInt(document.getElementById('os-viatura').value),
      tipo_manutencao: document.getElementById('os-tipo').value,
      descricao: document.getElementById('os-descricao').value,
      status: document.getElementById('os-status').value
    };

    if (!data.viatura_id || !data.tipo_manutencao) {
      showAlert('Preencha os campos obrigatórios', 'warning');
      return;
    }

    if (editingOSId) {
      await api.updateOS(editingOSId, data);
      showAlert('OS atualizada com sucesso!', 'success');
    } else {
      await api.createOS(data);
      showAlert('OS criada com sucesso!', 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('osModal')).hide();
    loadOS();
  } catch (error) {
    showAlert('Erro ao salvar OS: ' + error.message, 'danger');
  }
}

// Delete OS
async function deleteOS(id) {
  if (!confirm('Deseja deletar esta OS?')) return;

  try {
    await api.deleteOS(id);
    showAlert('OS deletada com sucesso!', 'success');
    loadOS();
  } catch (error) {
    showAlert('Erro ao deletar OS', 'danger');
  }
}

// Update Dashboard
async function updateDashboard() {
  try {
    const response = await api.getOS(1, 100);
    const osData = response.data;

    const totalViaturas = allViaturas.length;
    const emOperacao = allViaturas.filter(v => v.status === 'ativo').length;
    const emManutencao = allViaturas.filter(v => v.status === 'manutencao').length;
    const ordensAbertas = osData.filter(os => os.status === 'aberta').length;

    document.getElementById('total-viaturas').textContent = totalViaturas;
    document.getElementById('em-operacao').textContent = emOperacao;
    document.getElementById('em-manutencao').textContent = emManutencao;
    document.getElementById('ordens-abertas').textContent = ordensAbertas;

    // Load viaturas for OS form
    populateViaturasSelect();
  } catch (error) {
    console.error('Dashboard update error:', error);
  }
}

// Populate Viaturas Select
function populateViaturasSelect() {
  const select = document.getElementById('os-viatura');
  select.innerHTML = '<option value="">Selecione uma viatura</option>' +
    allViaturas.map(v => `<option value="${v.id}">${v.placa} - ${v.marca}</option>`).join('');
}

// Pagination
function renderPagination(type) {
  const pagination = type === 'viaturas' ? viaturasPagination : osPagination;
  const container = document.getElementById(`${type}-pagination`);
  
  if (pagination.pages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  const maxPages = 5;
  let startPage = Math.max(1, pagination.page - Math.floor(maxPages / 2));
  let endPage = Math.min(pagination.pages, startPage + maxPages - 1);
  startPage = Math.max(1, endPage - maxPages + 1);

  if (pagination.page > 1) {
    html += `<li class="page-item"><a class="page-link" href="#" onclick="loadPage('${type}', 1)">Primeira</a></li>`;
    html += `<li class="page-item"><a class="page-link" href="#" onclick="loadPage('${type}', ${pagination.page - 1})">Anterior</a></li>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<li class="page-item ${i === pagination.page ? 'active' : ''}"><a class="page-link" href="#" onclick="loadPage('${type}', ${i})">${i}</a></li>`;
  }

  if (pagination.page < pagination.pages) {
    html += `<li class="page-item"><a class="page-link" href="#" onclick="loadPage('${type}', ${pagination.page + 1})">Próxima</a></li>`;
    html += `<li class="page-item"><a class="page-link" href="#" onclick="loadPage('${type}', ${pagination.pages})">Última</a></li>`;
  }

  container.innerHTML = html;
}

function loadPage(type, page) {
  event.preventDefault();
  if (type === 'viaturas') {
    viaturasPagination.page = page;
    loadViaturas(page);
  } else {
    osPagination.page = page;
    loadOS(page);
  }
}

// Reset Forms
function resetViaturasForm() {
  document.getElementById('viatura-form').reset();
  editingViaturaId = null;
  document.getElementById('viaturasModalLabel').textContent = 'Nova Viatura';
}

function resetOSForm() {
  document.getElementById('os-form').reset();
  editingOSId = null;
  document.getElementById('osModalLabel').textContent = 'Nova Ordem de Serviço';
}

// Alert
function showAlert(message, type = 'info') {
  const alertHtml = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', alertHtml);
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
  }, 5000);
}

// Debounce
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}