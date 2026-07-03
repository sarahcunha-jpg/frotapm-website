// Executar ao carregar com onReady helper
function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

onReady(function() {
    carregarTableViaturas();

    // ligar formulário de viatura
    const form = document.getElementById('formViatura');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // validação básica
            const placa = form.querySelector('[name="placa"]').value.trim();
            const modelo = form.querySelector('[name="modelo"]').value.trim();
            if (!placa) return alert('A placa é obrigatória.');
            if (!modelo) return alert('O modelo é obrigatório.');
            salvarViatura();
            atualizarDashboardAfterDataChange();
        });
    }

    // busca
    const search = document.getElementById('searchViaturas');
    if (search) {
        search.addEventListener('input', function() {
            const q = this.value.trim().toLowerCase();
            if (typeof buscarViaturasFirebase === 'function' && window.db) {
                const filtered = buscarViaturasFirebase(q);
                carregarTableViaturasComLista(filtered);
            } else {
                const filtered = viaturas.filter(v => 
                    (v.placa||'').toLowerCase().includes(q) ||
                    (v.modelo||'').toLowerCase().includes(q) ||
                    (String(v.placa)||'').toLowerCase().startsWith(q)
                );
                carregarTableViaturasComLista(filtered);
            }
        });
    }
});

// Compat with firebase-config.js which may call carregarViaturas()
function carregarViaturas() {
    carregarTableViaturas();
}

// Carregar tabela de viaturas
function carregarTableViaturas() {
    const tableBody = document.getElementById('tableViaturas');
    if (!tableBody) return;

    tableBody.innerHTML = viaturas.map(viatura => `
        <tr>
            <td><strong>${viatura.placa}</strong></td>
            <td>${viatura.modelo}</td>
            <td>${viatura.ano || ''}</td>
            <td>${(viatura.quilometragem||0).toLocaleString('pt-BR')} km</td>
            <td>${viatura.unidade || ''}</td>
            <td>
                <span class="badge ${obterCorStatus(viatura.status)}">
                    ${obterLabelStatus(viatura.status)}
                </span>
            </td>
            <td>${formatarData(viatura.ultimaRevisao)}</td>
            <td>${formatarData(viatura.proximaRevisao)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editarViatura('${viatura.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarViatura('${viatura.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Atualiza selects que dependem da lista de viaturas
    atualizarSelectViaturas();
}

function carregarTableViaturasComLista(lista) {
    const tableBody = document.getElementById('tableViaturas');
    if (!tableBody) return;
    tableBody.innerHTML = lista.map(viatura => `
        <tr>
            <td><strong>${viatura.placa}</strong></td>
            <td>${viatura.modelo}</td>
            <td>${viatura.ano || ''}</td>
            <td>${(viatura.quilometragem||0).toLocaleString('pt-BR')} km</td>
            <td>${viatura.unidade || ''}</td>
            <td>
                <span class="badge ${obterCorStatus(viatura.status)}">
                    ${obterLabelStatus(viatura.status)}
                </span>
            </td>
            <td>${formatarData(viatura.ultimaRevisao)}</td>
            <td>${formatarData(viatura.proximaRevisao)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editarViatura('${viatura.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarViatura('${viatura.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
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
    // if ids are strings (Firestore) cannot compute numeric next; fallback to length+1
    const numericIds = viaturas.map(v => typeof v.id === 'number' ? v.id : null).filter(Boolean);
    if (numericIds.length === 0) return viaturas.length + 1;
    return Math.max(...numericIds) + 1;
}

async function salvarViatura() {
    const form = document.getElementById('formViatura');
    const formData = new FormData(form);
    const modalEl = document.getElementById('modalViatura');
    const editId = modalEl.dataset.editId ? modalEl.dataset.editId : null;

    if (editId) {
        // Editar viatura existente
        const vi = viaturas.find(v => String(v.id) === String(editId));
        if (!vi) return alert('Viatura não encontrada para edição');

        const dados = {
            placa: formData.get('placa'),
            modelo: formData.get('modelo'),
            ano: parseInt(formData.get('ano')) || vi.ano,
            quilometragem: parseInt(formData.get('quilometragem')) || vi.quilometragem,
            unidade: formData.get('unidade'),
            status: formData.get('status')
        };

        if (window.db && typeof atualizarViaturaFirebase === 'function') {
            await atualizarViaturaFirebase(editId, dados);
        } else {
            Object.assign(vi, dados);
            saveAllData();
            carregarTableViaturas();
            alert('Viatura atualizada com sucesso!');
        }

        // limpa flag de edição
        delete modalEl.dataset.editId;
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

        if (window.db && typeof salvarViaturaFirebase === 'function') {
            await salvarViaturaFirebase(novaViatura);
            // onSnapshot irá recarregar viaturas automaticamente
            // fecha modal após salvar
        } else {
            viaturas.push(novaViatura);
            saveAllData();
            alert('Viatura cadastrada com sucesso!');
            carregarTableViaturas();
        }
    }

    // limpar e fechar modal
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalViatura'));
    if (modal) modal.hide();
}

function editarViatura(id) {
    const vi = viaturas.find(v => String(v.id) === String(id));
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

async function deletarViatura(id) {
    if (!confirm('Tem certeza que deseja deletar esta viatura?')) return;
    if (window.db && typeof deletarViaturaFirebase === 'function') {
        await deletarViaturaFirebase(id);
        // onSnapshot atualizará a lista
    } else {
        const index = viaturas.findIndex(v => String(v.id) === String(id));
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
    selectOS.innerHTML = '<option value="">Selecione...</option>' + viaturas.map(v => `<option value="${v.placa}" data-id="${v.id}">${v.placa} - ${v.modelo}</option>`).join('');
    // tenta restaurar seleção
    if (current) selectOS.value = current;
}
