/* ============================================
   FUNCIONALIDADES DE MELHORIAS - FROTAPM
   Busca, Filtros, Paginação e Notificações
   ============================================ */

// ============ NOTIFICAÇÕES TOAST ============

class Toast {
  constructor() {
    this.container = document.querySelector('.toast-container') || this.createContainer();
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      ${message}
      <button class="close-toast">&times;</button>
    `;

    this.container.appendChild(toast);

    const closeBtn = toast.querySelector('.close-toast');
    closeBtn.addEventListener('click', () => toast.remove());

    if (duration > 0) {
      setTimeout(() => toast.remove(), duration);
    }
  }

  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  warning(message) {
    this.show(message, 'warning');
  }

  info(message) {
    this.show(message, 'info');
  }
}

const toast = new Toast();

// ============ LOADING OVERLAY ============

class Loading {
  static show(message = 'Carregando...') {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.id = 'loading-overlay';
      overlay.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p style="margin-top: 1rem; color: #666;">${message}</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  }

  static hide() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
}

// ============ BUSCA E FILTROS ============

class SearchFilter {
  constructor(tableId, options = {}) {
    this.table = document.getElementById(tableId);
    this.tbody = this.table.querySelector('tbody');
    this.rows = Array.from(this.tbody.querySelectorAll('tr'));
    this.filteredRows = [...this.rows];
    this.currentPage = 1;
    this.itemsPerPage = options.itemsPerPage || 10;
    this.searchDelay = null;
    this.filters = {};
    this.sortColumn = null;
    this.sortOrder = 'asc';
    this.onFilterChange = options.onFilterChange || null;
  }

  // Busca com debounce
  initSearch(searchInputId, debounceTime = 300) {
    const searchInput = document.getElementById(searchInputId);
    if (!searchInput) return;

    const clearBtn = searchInput.parentElement.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.search('');
      });
    }

    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchDelay);
      this.searchDelay = setTimeout(() => {
        this.search(e.target.value.toLowerCase());
      }, debounceTime);
    });
  }

  search(query) {
    if (!query) {
      this.filteredRows = [...this.rows];
    } else {
      this.filteredRows = this.rows.filter(row => {
        const text = row.textContent.toLowerCase();
        return text.includes(query);
      });
    }
    this.currentPage = 1;
    this.render();
  }

  // Filtros customizados
  initFilter(filterClass = 'filter-group') {
    const filterGroups = document.querySelectorAll(`.${filterClass}`);
    filterGroups.forEach(group => {
      const select = group.querySelector('select, input');
      if (select) {
        select.addEventListener('change', (e) => {
          const filterName = select.name || select.id;
          const value = e.target.value;

          if (value) {
            this.filters[filterName] = value;
          } else {
            delete this.filters[filterName];
          }

          this.applyFilters();
        });
      }
    });

    // Botão de limpar filtros
    const clearBtn = document.querySelector('.filter-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        document.querySelectorAll(`.${filterClass} select, .${filterClass} input`).forEach(el => {
          el.value = '';
        });
        this.filters = {};
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    this.filteredRows = this.rows.filter(row => {
      for (const [key, value] of Object.entries(this.filters)) {
        const cell = row.querySelector(`[data-filter="${key}"]`);
        if (!cell || !cell.textContent.toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    this.currentPage = 1;
    this.render();

    if (this.onFilterChange) {
      this.onFilterChange(this.filteredRows.length);
    }
  }

  // Ordenação
  initSort() {
    const headers = this.table.querySelectorAll('thead th.sortable-header');
    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        if (this.sortColumn === index) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = index;
          this.sortOrder = 'asc';
        }

        // Atualizar visual
        headers.forEach(h => h.classList.remove('asc', 'desc'));
        header.classList.add(this.sortOrder);

        this.sort(index);
      });
    });
  }

  sort(columnIndex) {
    this.filteredRows.sort((a, b) => {
      const aCell = a.cells[columnIndex].textContent.trim();
      const bCell = b.cells[columnIndex].textContent.trim();

      // Tentar converter para número
      const aNum = parseFloat(aCell);
      const bNum = parseFloat(bCell);

      let comparison;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        comparison = aCell.localeCompare(bCell);
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.currentPage = 1;
    this.render();
  }

  // Paginação
  initPagination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener('change', (e) => {
      if (e.target.classList.contains('items-per-page-select')) {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.render();
      }
    });
  }

  render() {
    // Mostrar/ocultar linhas
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.rows.forEach(row => {
      row.style.display = 'none';
    });

    this.filteredRows.slice(start, end).forEach(row => {
      row.style.display = '';
    });

    // Atualizar informações de paginação
    this.updatePaginationInfo();
  }

  updatePaginationInfo() {
    const total = this.filteredRows.length;
    const totalPages = Math.ceil(total / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, total);

    const info = document.querySelector('.pagination-info');
    if (info) {
      info.textContent = `Mostrando ${start} a ${end} de ${total} registros`;
    }

    // Desabilitar/habilitar botões
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');

    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
      prevBtn.onclick = () => this.previousPage();
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages;
      nextBtn.onclick = () => this.nextPage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredRows.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// ============ MODAL DE CONFIRMAÇÃO ============

class ConfirmModal {
  static show(title, message, data = {}, onConfirm = null) {
    let modal = document.getElementById('confirmModal');

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'confirmModal';
      modal.className = 'modal fade modal-confirm';
      modal.tabIndex = -1;
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmTitle"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="confirmMessage"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="confirmBtn">Confirmar</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').innerHTML = message;

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = () => {
      if (onConfirm) {
        onConfirm(data);
      }
      bootstrap.Modal.getInstance(modal).hide();
    };

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}

// ============ HISTÓRICO COM TIMELINE ============

class HistoryTimeline {
  static create(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const timeline = document.createElement('ul');
    timeline.className = 'history-timeline';

    data.forEach(item => {
      const li = document.createElement('li');
      li.className = item.action;

      const date = new Date(item.date);
      const dateStr = date.toLocaleString('pt-BR');

      li.innerHTML = `
        <div class="date">${dateStr}</div>
        <div class="content ${item.action}">
          <strong>${item.user}</strong> ${this.getActionText(item.action)} <br>
          <small>${item.description}</small>
        </div>
      `;

      timeline.appendChild(li);
    });

    container.innerHTML = '';
    container.appendChild(timeline);
  }

  static getActionText(action) {
    const texts = {
      'create': 'criou',
      'update': 'atualizou',
      'delete': 'deletou'
    };
    return texts[action] || action;
  }
}

// ============ FUNÇÕES AUXILIARES ============

// Converter tabela para cards em mobile
function convertTableToCards() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => 
      th.textContent.trim()
    );

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (headers[index]) {
          cell.setAttribute('data-label', headers[index]);
        }
      });
    });
  });
}

// Deletar com confirmação
function deleteWithConfirmation(id, name, callback) {
  ConfirmModal.show(
    'Confirmar Exclusão',
    `Tem certeza que deseja excluir <strong>${name}</strong>? Esta ação não pode ser desfeita.`,
    { id, name },
    (data) => {
      Loading.show('Deletando...');
      setTimeout(() => {
        Loading.hide();
        toast.success('Registro deletado com sucesso!');
        if (callback) callback(data);
      }, 500);
    }
  );
}

// Exportar tabela para Excel
function exportToExcel(tableId, filename = 'export.xlsx') {
  const table = document.getElementById(tableId);
  if (!table) return;

  let html = '<table>';
  
  // Headers
  html += '<tr>';
  table.querySelectorAll('thead th').forEach(th => {
    html += `<td>${th.textContent.trim()}</td>`;
  });
  html += '</tr>';

  // Rows
  table.querySelectorAll('tbody tr').forEach(tr => {
    html += '<tr>';
    tr.querySelectorAll('td').forEach(td => {
      html += `<td>${td.textContent.trim()}</td>`;
    });
    html += '</tr>';
  });

  html += '</table>';

  // Criar arquivo
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);

  toast.success('Arquivo exportado com sucesso!');
}

// Exportar para PDF (usando html2pdf)
function exportToPDF(tableId, filename = 'export.pdf') {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Verificar se html2pdf está disponível
  if (typeof html2pdf === 'undefined') {
    toast.error('Biblioteca html2pdf não carregada. Incluir: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    return;
  }

  const element = table.cloneNode(true);
  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save();
  toast.success('PDF gerado com sucesso!');
}

// Imprimir tabela
function printTable(tableId) {
  const printWindow = window.open('', '', 'height=500,width=800');
  const table = document.getElementById(tableId);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Impressão</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; font-weight: bold; }
      </style>
    </head>
    <body onload="window.print()">
      ${table.outerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();
}

// Status badge com cor
function getStatusBadge(status) {
  const badges = {
    'ativo': '<span class="status-badge active">Ativo</span>',
    'manutencao': '<span class="status-badge maintenance">Manutenção</span>',
    'indisponivel': '<span class="status-badge unavailable">Indisponível</span>',
    'aberta': '<span class="status-badge pending">Aberta</span>',
    'em_progresso': '<span class="status-badge pending">Em Progresso</span>',
    'finalizada': '<span class="status-badge completed">Finalizada</span>'
  };
  return badges[status] || status;
}

// Inicializar ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  // Converter tabelas para cards em mobile
  convertTableToCards();

  // Inicializar tooltip do Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Log de inicialização
  console.log('✅ Funcionalidades de melhorias carregadas com sucesso!');
});

// ============ EXPORTAR PARA USO EXTERNO ============

window.SearchFilter = SearchFilter;
window.Toast = Toast;
window.Loading = Loading;
window.ConfirmModal = ConfirmModal;
window.HistoryTimeline = HistoryTimeline;
window.toast = toast;
window.deleteWithConfirmation = deleteWithConfirmation;
window.exportToExcel = exportToExcel;
window.exportToPDF = exportToPDF;
window.printTable = printTable;
window.getStatusBadge = getStatusBadge;
