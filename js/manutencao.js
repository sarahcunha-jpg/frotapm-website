// Executar ao carregar com onReady helper
function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

onReady(function() {
    carregarManutencaoPreventiva();
    carregarOrdenServico();
    carregarHistoricoManutencao();
});

// Carregar dados de manutenção
function carregarManutencaoPreventiva() {
    const tableBody = document.getElementById('corpoTabelaManutenção') || document.getElementById('tableManutencaoPreventiva');
    if (!tableBody) return;

    tableBody.innerHTML = manutencaoPreventiva.map(manutencao => `
        <tr>
            <td>${manutencao.id}</td>
            <td>${manutencao.item}</td>
            <td>${manutencao.frequencia}</td>
            <td>${new Date(manutencao.ultimaExecucao).toLocaleDateString('pt-BR')}</td>
            <td>${new Date(manutencao.proximaExecucao).toLocaleDateString('pt-BR')}</td>
            <td>${obterStatusManutencao(manutencao.proximaExecucao)}</td>
        </tr>
    `).join('');
}

function obterStatusManutencao(data) {
    const hoje = new Date();
    const dataProxima = new Date(data);
    const diasRestantes = Math.floor((dataProxima - hoje) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
        return '<span class="badge bg-danger">Vencida</span>';
    } else if (diasRestantes < 30) {
        return '<span class="badge bg-warning text-dark">Próxima</span>';
    } else {
        return '<span class="badge bg-success">No prazo</span>';
    }
}

function carregarOrdenServico() {
    const tableBody = document.getElementById('corpoTabelaOS') || document.getElementById('tableOS');
    if (!tableBody) return;

    tableBody.innerHTML = ordensServico.map(os => `
        <tr>
            <td><strong>${os.numero}</strong></td>
            <td>${os.viatura}</td>
            <td>${new Date(os.data).toLocaleDateString('pt-BR')}</td>
            <td>${os.problema}</td>
            <td>R$ ${Number(os.custo).toFixed(2)}</td>
            <td>${obterBadgeStatus(os.status)}</td>
            <td>${os.tempoParada}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="abrirOS('${os.numero}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="finalizarOS('${os.numero}')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function obterBadgeStatus(status) {
    const badges = {
        'aberta': '<span class="badge bg-info">Aberta</span>',
        'em_progresso': '<span class="badge bg-warning text-dark">Em Progresso</span>',
        'finalizada': '<span class="badge bg-success">Finalizada</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Desconhecida</span>';
}

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
            <td>${hist.tempoParada}</td>
        </tr>
    `).join('');
}

function getNextOSId() {
    if (!ordensServico || ordensServico.length === 0) return 1;
    return Math.max(...ordensServico.map(o => o.id)) + 1;
}

function salvarOS() {
    const form = document.getElementById('formOS');
    const formData = new FormData(form);
    const novaOS = {
        id: getNextOSId(),
        numero: `OS-${String(getNextOSId()).padStart(3, '0')}`,
        viatura: formData.get('viatura'),
        data: new Date().toISOString().split('T')[0],
        problema: formData.get('problema'),
        servico: 'Pendente de execução',
        responsavel: formData.get('responsavel'),
        pecas: formData.get('pecas'),
        custo: parseFloat(formData.get('custo')) || 0,
        tempoParada: 'Pendente',
        status: 'aberta'
    };

    ordensServico.push(novaOS);
    saveAllData();
    carregarOrdenServico();
    atualizarDashboardAfterDataChange();
    form.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalOS'));
    if (modal) modal.hide();

    alert('Ordem de Serviço criada com sucesso!');
}

function abrirOS(numero) {
    alert(`Abrindo OS: ${numero}`);
}

function finalizarOS(numero) {
    const os = ordensServico.find(o => o.numero === numero);
    if (os) {
        os.status = 'finalizada';
        saveAllData();
        carregarOrdenServico();
        atualizarDashboardAfterDataChange();
        alert(`OS ${numero} finalizada com sucesso!`);
    }
}

function atualizarDashboardAfterDataChange() {
    // tenta chamar a função do dashboard (se existir) para recalcular valores
    if (typeof carregarDadosDashboard === 'function') carregarDadosDashboard();
}
