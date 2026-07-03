// Executar ao carregar com onReady helper
function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

onReady(function() {
    carregarManutencaoPreventiva();
    carregarOrdenServico();
    carregarHistoricoManutencao();
    inicializarEventosForms();
});

// ==================== DADOS DE EXEMPLO ====================
let manutencaoPreventiva = [
    { id: 1, viatura: 'PM-001', item: 'Troca de óleo', frequencia: '5.000 km', ultimaExecucao: '2026-06-01', proximaExecucao: '2026-07-15', status: 'Pendente' },
    { id: 2, viatura: 'PM-002', item: 'Filtro de ar', frequencia: '10.000 km', ultimaExecucao: '2026-05-10', proximaExecucao: '2026-07-10', status: 'Concluído' },
    { id: 3, viatura: 'PM-003', item: 'Revisão geral', frequencia: '20.000 km', ultimaExecucao: '2026-04-20', proximaExecucao: '2026-08-20', status: 'Em Execução' }
];

let ordensServico = [
    { id: 1, numero: 'OS-001', viatura: 'PM-001', tipo: 'Preventiva', data: '2026-07-01', custo: 250.00, status: 'finalizada', tempoParada: 2 },
    { id: 2, numero: 'OS-002', viatura: 'PM-003', tipo: 'Corretiva', data: '2026-07-02', custo: 1200.00, status: 'em_progresso', tempoParada: 8 },
    { id: 3, numero: 'OS-003', viatura: 'PM-002', tipo: 'Emergencial', data: '2026-07-03', custo: 450.00, status: 'aberta', tempoParada: 0 }
];

let historicoManutencao = [
    { id: 1, viatura: 'PM-001', servico: 'Troca de óleo e filtro', data: '2026-06-01', custo: 280.00, pecas: 'Óleo 5L, Filtro', tempoParada: 1.5 },
    { id: 2, viatura: 'PM-002', servico: 'Revisão completa', data: '2026-05-20', custo: 800.00, pecas: 'Vários', tempoParada: 4 },
    { id: 3, viatura: 'PM-003', servico: 'Reparo de freios', data: '2026-07-01', custo: 1500.00, pecas: 'Pastilhas, Discos', tempoParada: 6 }
];

// ==================== CARREGAR MANUTENÇÃO PREVENTIVA ====================
function carregarManutencaoPreventiva() {
    const tableBody = document.getElementById('corpoTabelaManutenção');
    if (!tableBody) return;

    tableBody.innerHTML = manutencaoPreventiva.map(manutencao => `
        <tr>
            <td><strong>${manutencao.id}</strong></td>
            <td>${manutencao.item}</td>
            <td>${manutencao.frequencia}</td>
            <td>${new Date(manutencao.ultimaExecucao).toLocaleDateString('pt-BR')}</td>
            <td>${new Date(manutencao.proximaExecucao).toLocaleDateString('pt-BR')}</td>
            <td>${obterStatusManutencao(manutencao.proximaExecucao, manutencao.status)}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarManutencao(${manutencao.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="marcarConcluida(${manutencao.id})" title="Marcar como concluída">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarManutencao(${manutencao.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function obterStatusManutencao(data, statusAtual) {
    const hoje = new Date();
    const dataProxima = new Date(data);
    const diasRestantes = Math.floor((dataProxima - hoje) / (1000 * 60 * 60 * 24));

    if (statusAtual === 'Concluído') {
        return '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Concluído</span>';
    } else if (statusAtual === 'Em Execução') {
        return '<span class="badge bg-info"><i class="fas fa-hourglass"></i> Em Execução</span>';
    } else if (diasRestantes < 0) {
        return '<span class="badge bg-danger"><i class="fas fa-exclamation-triangle"></i> Vencida</span>';
    } else if (diasRestantes < 7) {
        return `<span class="badge bg-warning text-dark"><i class="fas fa-exclamation-circle"></i> Próxima (${diasRestantes}d)</span>`;
    } else {
        return '<span class="badge bg-success"><i class="fas fa-calendar-check"></i> No prazo</span>';
    }
}

// ==================== CARREGAR ORDENS DE SERVIÇO ====================
function carregarOrdenServico() {
    const tableBody = document.getElementById('corpoTabelaOS');
    if (!tableBody) return;

    tableBody.innerHTML = ordensServico.map(os => `
        <tr>
            <td><strong>${os.numero}</strong></td>
            <td>${os.viatura}</td>
            <td>${os.tipo}</td>
            <td>${new Date(os.data).toLocaleDateString('pt-BR')}</td>
            <td>R$ ${Number(os.custo).toFixed(2)}</td>
            <td>${obterBadgeStatus(os.status)}</td>
            <td>${os.tempoParada}h</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarOS(${os.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="finalizarOS(${os.id})" title="Finalizar">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarOS(${os.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function obterBadgeStatus(status) {
    const badges = {
        'aberta': '<span class="badge bg-info"><i class="fas fa-lock-open"></i> Aberta</span>',
        'em_progresso': '<span class="badge bg-warning text-dark"><i class="fas fa-spinner"></i> Em Progresso</span>',
        'finalizada': '<span class="badge bg-success"><i class="fas fa-check-double"></i> Finalizada</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Desconhecida</span>';
}

// ==================== CARREGAR HISTÓRICO ====================
function carregarHistoricoManutencao() {
    const tableBody = document.getElementById('tableHistorico');
    if (!tableBody) return;

    tableBody.innerHTML = historicoManutencao.map(hist => `
        <tr>
            <td>${hist.viatura}</td>
            <td>${hist.servico}</td>
            <td>${new Date(hist.data).toLocaleDateString('pt-BR')}</td>
            <td>R$ ${Number(hist.custo).toFixed(2)}</td>
            <td>${hist.pecas}</td>
            <td>${hist.tempoParada}h</td>
        </tr>
    `).join('');
}

// ==================== FUNÇÕES DE EDIÇÃO/EXCLUSÃO ====================
function editarManutencao(id) {
    const manutencao = manutencaoPreventiva.find(m => m.id === id);
    if (!manutencao) return alert('Manutenção não encontrada');

    const novaFreq = prompt('Frequência (ex: 5.000 km):', manutencao.frequencia);
    if (!novaFreq) return;

    manutencao.frequencia = novaFreq;
    carregarManutencaoPreventiva();
    alert('Manutenção atualizada com sucesso!');
}

function deletarManutencao(id) {
    if (!confirm('Tem certeza que deseja deletar esta manutenção preventiva?')) return;
    
    const index = manutencaoPreventiva.findIndex(m => m.id === id);
    if (index > -1) {
        manutencaoPreventiva.splice(index, 1);
        carregarManutencaoPreventiva();
        alert('Manutenção deletada com sucesso!');
    }
}

function marcarConcluida(id) {
    const manutencao = manutencaoPreventiva.find(m => m.id === id);
    if (manutencao) {
        manutencao.status = 'Concluído';
        
        // Adicionar ao histórico
        historicoManutencao.push({
            id: historicoManutencao.length + 1,
            viatura: manutencao.viatura,
            servico: manutencao.item,
            data: new Date().toISOString().split('T')[0],
            custo: 0,
            pecas: '-',
            tempoParada: 0
        });
        
        // Calcular próxima execução
        const proximaData = new Date();
        proximaData.setDate(proximaData.getDate() + 60);
        manutencao.proximaExecucao = proximaData.toISOString().split('T')[0];
        manutencao.ultimaExecucao = new Date().toISOString().split('T')[0];
        
        carregarManutencaoPreventiva();
        carregarHistoricoManutencao();
        alert('Manutenção marcada como concluída!');
    }
}

// ==================== FUNÇÕES DE ORDENS DE SERVIÇO ====================
function editarOS(id) {
    const os = ordensServico.find(o => o.id === id);
    if (!os) return alert('OS não encontrada');

    const novoStatus = prompt('Novo status (aberta/em_progresso/finalizada):', os.status);
    if (!novoStatus) return;

    os.status = novoStatus;
    carregarOrdenServico();
    alert('OS atualizada com sucesso!');
}

function finalizarOS(id) {
    const os = ordensServico.find(o => o.id === id);
    if (os) {
        os.status = 'finalizada';
        carregarOrdenServico();
        alert(`OS ${os.numero} finalizada com sucesso!`);
    }
}

function deletarOS(id) {
    if (!confirm('Tem certeza que deseja deletar esta Ordem de Serviço?')) return;
    
    const index = ordensServico.findIndex(o => o.id === id);
    if (index > -1) {
        const numeroOS = ordensServico[index].numero;
        ordensServico.splice(index, 1);
        carregarOrdenServico();
        alert(`OS ${numeroOS} deletada com sucesso!`);
    }
}

// ==================== FORMULÁRIOS ====================
function inicializarEventosForms() {
    const formOS = document.getElementById('formOS');
    if (formOS) {
        formOS.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(formOS);
            
            const novaOS = {
                id: ordensServico.length + 1,
                numero: `OS-${String(ordensServico.length + 1).padStart(3, '0')}`,
                viatura: formData.get('viatura') || 'PM-XXX',
                tipo: formData.get('tipo') || 'Preventiva',
                data: new Date().toISOString().split('T')[0],
                custo: parseFloat(formData.get('custo')) || 0,
                status: 'aberta',
                tempoParada: 0
            };

            ordensServico.push(novaOS);
            carregarOrdenServico();
            alert('Ordem de Serviço criada com sucesso!');
            formOS.reset();
            
            const modal = document.querySelector('[data-bs-target="#modalOS"]');
            if (modal) bootstrap.Modal.getInstance(modal)?.hide();
        });
    }
}

// Funções auxiliares
function saveAllData() {
    localStorage.setItem('manutencaoPreventiva', JSON.stringify(manutencaoPreventiva));
    localStorage.setItem('ordensServico', JSON.stringify(ordensServico));
    localStorage.setItem('historicoManutencao', JSON.stringify(historicoManutencao));
}

function atualizarDashboardAfterDataChange() {
    if (typeof carregarDadosDashboard === 'function') {
        carregarDadosDashboard();
    }
}
