// Executar ao carregar com onReady helper
function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

onReady(function() {
    carregarTableViaturas();
});

// Carregar tabela de viaturas
function carregarTableViaturas() {
    const tableBody = document.getElementById('tableViaturas');
    if (!tableBody) return;

    tableBody.innerHTML = viaturas.map(viatura => `
        <tr>
            <td><strong>${viatura.placa}</strong></td>
            <td>${viatura.modelo}</td>
            <td>${viatura.ano}</td>
            <td>${viatura.quilometragem.toLocaleString('pt-BR')} km</td>
            <td>${viatura.unidade}</td>
            <td>
                <span class="badge ${obterCorStatus(viatura.status)}">
                    ${obterLabelStatus(viatura.status)}
                </span>
            </td>
            <td>${formatarData(viatura.ultimaRevisao)}</td>
            <td>${formatarData(viatura.proximaRevisao)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editarViatura(${viatura.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarViatura(${viatura.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Atualiza selects que dependem da lista de viaturas
    atualizarSelectViaturas();
}

function obterCorStatus(status) {
    const cores = {
        'operacao': 'bg-success',
        'manutencao': 'bg-warning text-dark',
        'indisponivel': 'bg-danger'
    };
    return cores[status] || 'bg-secondary';
}

function obterLabelStatus(status) {
    const labels = {
        'operacao': 'Em Operação',
        'manutencao': 'Em Manutenção',
        'indisponivel': 'Indisponível'
    };
    return labels[status] || 'Desconhecido';
}

function formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d)) return data;
    return d.toLocaleDateString('pt-BR');
}

function getNextViaturaId() {
    if (!viaturas || viaturas.length === 0) return 1;
    return Math.max(...viaturas.map(v => v.id)) + 1;
}

function salvarViatura() {
    const form = document.getElementById('formViatura');
    const formData = new FormData(form);
    const modalEl = document.getElementById('modalViatura');
    const editId = modalEl.dataset.editId ? Number(modalEl.dataset.editId) : null;

    if (editId) {
        // Editar viatura existente
        const vi = viaturas.find(v => v.id === editId);
        if (!vi) return alert('Viatura não encontrada para edição');

        vi.placa = formData.get('placa');
        vi.modelo = formData.get('modelo');
        vi.ano = parseInt(formData.get('ano')) || vi.ano;
        vi.quilometragem = parseInt(formData.get('quilometragem')) || vi.quilometragem;
        vi.unidade = formData.get('unidade');
        vi.status = formData.get('status');
        // não alteramos revisões aqui

        // limpa flag de edição
        delete modalEl.dataset.editId;
        alert('Viatura atualizada com sucesso!');
    } else {
        const novaViatura = {
            id: getNextViaturaId(),
            placa: formData.get('placa'),
            modelo: formData.get('modelo'),
            ano: parseInt(formData.get('ano')) || null,
            quilometragem: parseInt(formData.get('quilometragem')) || 0,
            unidade: formData.get('unidade'),
            status: formData.get('status'),
            ultimaRevisao: new Date().toISOString().split('T')[0],
            proximaRevisao: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]
        };
        viaturas.push(novaViatura);
        alert('Viatura cadastrada com sucesso!');
    }

    saveAllData();
    carregarTableViaturas();
    form.reset();

    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

function editarViatura(id) {
    const vi = viaturas.find(v => v.id === id);
    if (!vi) return alert('Viatura não encontrada');

    const form = document.getElementById('formViatura');
    form.querySelector('[name="placa"]').value = vi.placa || '';
    form.querySelector('[name="modelo"]').value = vi.modelo || '';
    form.querySelector('[name="ano"]').value = vi.ano || '';
    form.querySelector('[name="quilometragem"]').value = vi.quilometragem || '';
    form.querySelector('[name="unidade"]').value = vi.unidade || '';
    form.querySelector('[name="status"]').value = vi.status || 'operacao';

    const modalEl = document.getElementById('modalViatura');
    modalEl.dataset.editId = id;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function deletarViatura(id) {
    if (confirm('Tem certeza que deseja deletar esta viatura?')) {
        const index = viaturas.findIndex(v => v.id === id);
        if (index > -1) {
            viaturas.splice(index, 1);
            saveAllData();
            carregarTableViaturas();
            alert('Viatura deletada com sucesso!');
        }
    }
}

function atualizarSelectViaturas() {
    // Atualiza select dentro do modal OS
    const selectOS = document.querySelector('#formOS select[name="viatura"]');
    if (!selectOS) return;
    const current = selectOS.value;
    selectOS.innerHTML = '<option value="">Selecione...</option>' + viaturas.map(v => `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`).join('');
    // tenta restaurar seleção
    if (current) selectOS.value = current;
}
