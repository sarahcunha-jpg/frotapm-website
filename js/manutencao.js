// Executar ao carregar com onReady helper
function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

onReady(function() {
    // Inicializa apenas se as variáveis globais não existirem (dados.js ou firebase-config.js podem definir)
    if (typeof manutencaoPreventiva === 'undefined') {
        manutencaoPreventiva = [
            { id: 1, viatura: 'PM-001', item: 'Troca de óleo', frequencia: '5.000 km', ultimaExecucao: '2026-06-01', proximaExecucao: '2026-07-15', status: 'Pendente' },
            { id: 2, viatura: 'PM-002', item: 'Filtro de ar', frequencia: '10.000 km', ultimaExecucao: '2026-05-10', proximaExecucao: '2026-07-10', status: 'Concluído' },
            { id: 3, viatura: 'PM-003', item: 'Revisão geral', frequencia: '20.000 km', ultimaExecucao: '2026-04-20', proximaExecucao: '2026-08-20', status: 'Em Execução' }
        ];
    }

    if (typeof ordensServico === 'undefined') {
        ordensServico = [
            { id: 1, numero: 'OS-001', viatura: 'PM-001', tipo: 'Preventiva', data: '2026-07-01', custo: 250.00, status: 'finalizada', tempoParada: 2 },
            { id: 2, numero: 'OS-002', viatura: 'PM-003', tipo: 'Corretiva', data: '2026-07-02', custo: 1200.00, status: 'em_progresso', tempoParada: 8 },
            { id: 3, numero: 'OS-003', viatura: 'PM-002', tipo: 'Emergencial', data: '2026-07-03', custo: 450.00, status: 'aberta', tempoParada: 0 }
        ];
    }

    if (typeof historicoManutencao === 'undefined') {
        historicoManutencao = [
            { id: 1, viatura: 'PM-001', servico: 'Troca de óleo e filtro', data: '2026-06-01', custo: 280.00, pecas: 'Óleo 5L, Filtro', tempoParada: 1.5 },
            { id: 2, viatura: 'PM-002', servico: 'Revisão completa', data: '2026-05-20', custo: 800.00, pecas: 'Vários', tempoParada: 4 },
            { id: 3, viatura: 'PM-003', servico: 'Reparo de freios', data: '2026-07-01', custo: 1500.00, pecas: 'Pastilhas, Discos', tempoParada: 6 }
        ];
    }

    carregarManutencaoPreventiva();
    carregarOrdenServico();
    carregarHistoricoManutencao();
    inicializarEventosForms();
});

// ==================== Helpers ====================
function gerarNumeroOS() {
    // Gera número baseado em timestamp para evitar colisões
    return `OS-${Date.now()}`;
}

// ==================== CARREGAR MANUTENÇÃO PREVENTIVA ====================
function carregarManutencaoPreventiva() {
    const tableBody = document.getElementById('corpoTabelaManutenção');
    if (!tableBody) return;

    tableBody.innerHTML = manutencaoPreventiva.map(manutencao => `
        <tr>
            <td><strong>${manutencao.id}</strong></td>
            <td>${manutencao.item}</td>
            <td>${manutencao.frequencia}</td>
            <td>${formatarData(manutencao.ultimaExecucao)}</td>
            <td>${formatarData(manutencao.proximaExecucao)}</td>
            <td>${obterStatusManutencao(manutencao.proximaExecucao, manutencao.status)}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarManutencao('${manutencao.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="marcarConcluida('${manutencao.id}')" title="Marcar como concluída">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarManutencao('${manutencao.id}')" title="Deletar">
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

    if (String(statusAtual).toLowerCase().includes('concl')) {
        return '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Concluído</span>';
    } else if (String(statusAtual).toLowerCase().includes('exec')) {
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
            <td>${formatarData(os.data)}</td>
            <td>R$ ${Number(os.custo).toFixed(2)}</td>
            <td>${obterBadgeStatus(os.status)}</td>
            <td>${os.tempoParada}h</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarOS('${os.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="finalizarOS('${os.id}')" title="Finalizar">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarOS('${os.id}')" title="Deletar">
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
    return badges[String(status)] || ('<span class="badge bg-secondary">' + (status || 'Desconhecida') + '</span>');
}

// ==================== CARREGAR HISTÓRICO ====================
function carregarHistoricoManutencao() {
    const tableBody = document.getElementById('tableHistorico');
    if (!tableBody) return;

    tableBody.innerHTML = historicoManutencao.map(hist => `
        <tr>
            <td>${hist.viatura}</td>
            <td>${hist.servico}</td>
            <td>${formatarData(hist.data)}</td>
            <td>R$ ${Number(hist.custo).toFixed(2)}</td>
            <td>${hist.pecas}</td>
            <td>${hist.tempoParada}h</td>
        </tr>
    `).join('');
}

// ==================== FUNÇÕES DE EDIÇÃO/EXCLUSÃO ====================
function editarManutencao(id) {
    const manut = manutencaoPreventiva.find(m => String(m.id) === String(id));
    if (!manut) return alert('Manutenção não encontrada');

    const novaFreq = prompt('Frequência (ex: 5.000 km):', manut.frequencia);
    if (!novaFreq) return;

    manut.frequencia = novaFreq;
    if (window.db && typeof atualizarManutencaoFirebase === 'function') {
        atualizarManutencaoFirebase(manut.id, { frequencia: manut.frequencia });
    } else {
        if (typeof saveAllData === 'function') saveAllData();
        carregarManutencaoPreventiva();
        alert('Manutenção atualizada com sucesso!');
    }
}

function deletarManutencao(id) {
    if (!confirm('Tem certeza que deseja deletar esta manutenção preventiva?')) return;

    if (window.db && typeof deletarManutencaoFirebase === 'function') {
        deletarManutencaoFirebase(id);
    } else {
        const index = manutencaoPreventiva.findIndex(m => String(m.id) === String(id));
        if (index > -1) {
            manutencaoPreventiva.splice(index, 1);
            if (typeof saveAllData === 'function') saveAllData();
            carregarManutencaoPreventiva();
            alert('Manutenção deletada com sucesso!');
        }
    }
}

async function marcarConcluida(id) {
    const manutencao = manutencaoPreventiva.find(m => String(m.id) === String(id));
    if (!manutencao) return alert('Manutenção não encontrada');

    manutencao.status = 'Concluído';

    // Adicionar ao histórico
    const novoHistorico = {
        id: (historicoManutencao.length || 0) + 1,
        viatura: manutencao.viatura,
        servico: manutencao.item,
        data: new Date().toISOString().split('T')[0],
        custo: 0,
        pecas: '-',
        tempoParada: 0
    };

    if (window.db && typeof adicionarHistoricoFirebase === 'function') {
        await adicionarHistoricoFirebase(novoHistorico);
        // opcional: atualizar manutenção no firestore
        if (typeof atualizarManutencaoFirebase === 'function') {
            await atualizarManutencaoFirebase(manutencao.id, { status: manutencao.status, proximaExecucao: manutencao.proximaExecucao, ultimaExecucao: manutencao.ultimaExecucao });
        }
    } else {
        historicoManutencao.push(novoHistorico);

        // Calcular próxima execução
        const proximaData = new Date();
        proximaData.setDate(proximaData.getDate() + 60);
        manutencao.proximaExecucao = proximaData.toISOString().split('T')[0];
        manutencao.ultimaExecucao = new Date().toISOString().split('T')[0];

        if (typeof saveAllData === 'function') saveAllData();
        carregarManutencaoPreventiva();
        carregarHistoricoManutencao();
        alert('Manutenção marcada como concluída!');
    }
}

// ==================== FUNÇÕES DE ORDENS DE SERVIÇO ====================
function editarOS(id) {
    const os = ordensServico.find(o => String(o.id) === String(id));
    if (!os) return alert('OS não encontrada');

    // preencher modal
    document.getElementById('edit-os-id').value = os.id;
    document.getElementById('edit-viatura').value = os.viatura || '';
    document.getElementById('edit-tipo').value = os.tipo || '';
    // adaptar data para input date
    try { document.getElementById('edit-data').value = os.data ? new Date(os.data).toISOString().split('T')[0] : ''; } catch(e){}
    document.getElementById('edit-custo').value = os.custo || '';
    document.getElementById('edit-status').value = os.status || 'aberta';
    document.getElementById('edit-tempo-parada').value = os.tempoParada || 0;

    const modalEl = document.getElementById('modalEditarOS');
    new bootstrap.Modal(modalEl).show();
}

async function finalizarOS(id) {
    const os = ordensServico.find(o => String(o.id) === String(id));
    if (!os) return;

    os.status = 'finalizada';
    if (window.db && typeof atualizarOSFirebase === 'function') {
        await atualizarOSFirebase(os.id, { status: 'finalizada' });
    } else {
        if (typeof saveAllData === 'function') saveAllData();
        carregarOrdenServico();
        alert(`OS ${os.numero} finalizada com sucesso!`);
    }
}

async function deletarOS(id) {
    if (!confirm('Tem certeza que deseja deletar esta Ordem de Serviço?')) return;

    if (window.db && typeof deletarOSFirebase === 'function') {
        await deletarOSFirebase(id);
    } else {
        const index = ordensServico.findIndex(o => String(o.id) === String(id));
        if (index > -1) {
            const numeroOS = ordensServico[index].numero;
            ordensServico.splice(index, 1);
            if (typeof saveAllData === 'function') saveAllData();
            carregarOrdenServico();
            alert(`OS ${numeroOS} deletada com sucesso!`);
        }
    }
}

// ==================== FORMULÁRIOS ====================
function inicializarEventosForms() {
    const formOS = document.getElementById('formOS');
    if (formOS) {
        formOS.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(formOS);
            const novaOS = {
                id: gerarNumeroOS(),
                numero: gerarNumeroOS(),
                viatura: formData.get('viatura') || 'PM-XXX',
                tipo: formData.get('tipo') || 'Preventiva',
                data: new Date().toISOString().split('T')[0],
                custo: parseFloat(formData.get('custo')) || 0,
                status: 'aberta',
                tempoParada: 0,
                descricao: formData.get('descricao') || ''
            };

            if (window.db && typeof salvarOSFirebase === 'function') {
                await salvarOSFirebase(novaOS);
                // onSnapshot recarregará ordens
            } else {
                ordensServico.push(novaOS);
                if (typeof saveAllData === 'function') saveAllData();
                carregarOrdenServico();
                alert('Ordem de Serviço criada com sucesso!');
            }

            formOS.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalOS'));
            if (modal) modal.hide();
        });
    }

    const formEditarOS = document.getElementById('formEditarOS');
    if (formEditarOS) {
        formEditarOS.addEventListener('submit', async function(e) {
            e.preventDefault();
            const id = document.getElementById('edit-os-id').value;
            const os = ordensServico.find(o => String(o.id) === String(id));
            if (!os) return alert('OS não encontrada');

            const dados = {
                viatura: document.getElementById('edit-viatura').value,
                tipo: document.getElementById('edit-tipo').value,
                data: document.getElementById('edit-data').value,
                custo: parseFloat(document.getElementById('edit-custo').value) || 0,
                status: document.getElementById('edit-status').value,
                tempoParada: parseFloat(document.getElementById('edit-tempo-parada').value) || 0
            };

            if (window.db && typeof atualizarOSFirebase === 'function') {
                await atualizarOSFirebase(id, dados);
            } else {
                Object.assign(os, dados);
                if (typeof saveAllData === 'function') saveAllData();
                carregarOrdenServico();
                alert('OS atualizada com sucesso!');
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarOS'));
            if (modal) modal.hide();
        });
    }
}

// Funções auxiliares
function formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d)) return data;
    return d.toLocaleDateString('pt-BR');
}

