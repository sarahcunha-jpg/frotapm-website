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
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

function salvarViatura() {
    const form = document.getElementById('formViatura');
    const formData = new FormData(form);
    
    const novaViatura = {
        id: viaturas.length + 1,
        placa: formData.get('placa'),
        modelo: formData.get('modelo'),
        ano: parseInt(formData.get('ano')),
        quilometragem: parseInt(formData.get('quilometragem')),
        unidade: formData.get('unidade'),
        status: formData.get('status'),
        ultimaRevisao: new Date().toISOString().split('T')[0],
        proximaRevisao: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]
    };
    
    viaturas.push(novaViatura);
    carregarTableViaturas();
    form.reset();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalViatura'));
    modal.hide();
    
    alert('Viatura cadastrada com sucesso!');
}

function editarViatura(id) {
    alert('Função de edição em desenvolvimento!');
}

function deletarViatura(id) {
    if (confirm('Tem certeza que deseja deletar esta viatura?')) {
        const index = viaturas.findIndex(v => v.id === id);
        if (index > -1) {
            viaturas.splice(index, 1);
            carregarTableViaturas();
            alert('Viatura deletada com sucesso!');
        }
    }
}

// Executar ao carregar
document.addEventListener('DOMContentLoaded', carregarTableViaturas);
