// ===========================
// DADOS SIMULADOS DE VIATURAS
// ===========================

const viaturas = [
    {
        id: 1,
        placa: 'PM-0001',
        modelo: 'Ford Transit Custom',
        ano: 2021,
        unidade: '1º Batalhão',
        status: 'operacao',
        latitude: -26.9168,
        longitude: -49.0683,
        velocidade: 45,
        quilometragem: 85432,
        ultimaAtualizacao: new Date(Date.now() - 2 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Rua XV de Novembro, Blumenau'
    },
    {
        id: 2,
        placa: 'PM-0002',
        modelo: 'Chevrolet Blazer',
        ano: 2020,
        unidade: '1º Batalhão',
        status: 'operacao',
        latitude: -26.9175,
        longitude: -49.0675,
        velocidade: 32,
        quilometragem: 92156,
        ultimaAtualizacao: new Date(Date.now() - 1 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Avenida Beira Rio, Blumenau'
    },
    {
        id: 3,
        placa: 'PM-0003',
        modelo: 'Ford Ranger',
        ano: 2019,
        unidade: '2º Batalhão',
        status: 'manutencao',
        latitude: -26.9200,
        longitude: -49.0700,
        velocidade: 0,
        quilometragem: 105789,
        ultimaAtualizacao: new Date(Date.now() - 30 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Base de Manutenção, Blumenau'
    },
    {
        id: 4,
        placa: 'PM-0004',
        modelo: 'Chevrolet S10',
        ano: 2022,
        unidade: '2º Batalhão',
        status: 'operacao',
        latitude: -26.9145,
        longitude: -49.0720,
        velocidade: 58,
        quilometragem: 72345,
        ultimaAtualizacao: new Date(Date.now() - 3 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Rua Itajai, Blumenau'
    },
    {
        id: 5,
        placa: 'PM-0005',
        modelo: 'Ford Transit',
        ano: 2021,
        unidade: '3º Batalhão',
        status: 'operacao',
        latitude: -26.9210,
        longitude: -49.0650,
        velocidade: 40,
        quilometragem: 68921,
        ultimaAtualizacao: new Date(Date.now() - 5 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Avenida Atlântica, Blumenau'
    },
    {
        id: 6,
        placa: 'PM-0006',
        modelo: 'Chevrolet Blazer',
        ano: 2020,
        unidade: '3º Batalhão',
        status: 'parada',
        latitude: -26.9155,
        longitude: -49.0740,
        velocidade: 0,
        quilometragem: 98765,
        ultimaAtualizacao: new Date(Date.now() - 45 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Pátio de Viaturas, Blumenau'
    },
    {
        id: 7,
        placa: 'PM-0007',
        modelo: 'Ford Ranger',
        ano: 2022,
        unidade: 'Comando',
        status: 'operacao',
        latitude: -26.9190,
        longitude: -49.0680,
        velocidade: 35,
        quilometragem: 45678,
        ultimaAtualizacao: new Date(Date.now() - 1 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Rua Hercílio Luz, Blumenau'
    },
    {
        id: 8,
        placa: 'PM-0008',
        modelo: 'Ford Transit Custom',
        ano: 2021,
        unidade: 'Comando',
        status: 'operacao',
        latitude: -26.9220,
        longitude: -49.0710,
        velocidade: 28,
        quilometragem: 76543,
        ultimaAtualizacao: new Date(Date.now() - 2 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Rua Paranaguá, Blumenau'
    },
    {
        id: 9,
        placa: 'PM-0009',
        modelo: 'Chevrolet S10',
        ano: 2020,
        unidade: '1º Batalhão',
        status: 'operacao',
        latitude: -26.9160,
        longitude: -49.0695,
        velocidade: 52,
        quilometragem: 84321,
        ultimaAtualizacao: new Date(Date.now() - 4 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Avenida Brusque, Blumenau'
    },
    {
        id: 10,
        placa: 'PM-0010',
        modelo: 'Ford Transit',
        ano: 2019,
        unidade: '2º Batalhão',
        status: 'manutencao',
        latitude: -26.9205,
        longitude: -49.0665,
        velocidade: 0,
        quilometragem: 112456,
        ultimaAtualizacao: new Date(Date.now() - 60 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Oficina Central, Blumenau'
    },
    {
        id: 11,
        placa: 'PM-0011',
        modelo: 'Chevrolet Blazer',
        ano: 2021,
        unidade: '3º Batalhão',
        status: 'operacao',
        latitude: -26.9125,
        longitude: -49.0660,
        velocidade: 46,
        quilometragem: 61234,
        ultimaAtualizacao: new Date(Date.now() - 3 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Rua Konder Bornhausen, Blumenau'
    },
    {
        id: 12,
        placa: 'PM-0012',
        modelo: 'Ford Ranger',
        ano: 2022,
        unidade: '1º Batalhão',
        status: 'operacao',
        latitude: -26.9240,
        longitude: -49.0705,
        velocidade: 55,
        quilometragem: 38976,
        ultimaAtualizacao: new Date(Date.now() - 1 * 60000).toLocaleString('pt-BR'),
        localizacao: 'Rua 15 de Novembro, Blumenau'
    }
];

// ===========================
// UNIDADES POLICIAIS
// ===========================

const unidades = [
    { id: 1, nome: '1º Batalhão', cor: '#00a8e8' },
    { id: 2, nome: '2º Batalhão', cor: '#28a745' },
    { id: 3, nome: '3º Batalhão', cor: '#ffc107' },
    { id: 4, nome: 'Comando', cor: '#17a2b8' }
];

// ===========================
// HISTÓRICO DE ROTAS (SIMULADO)
// ===========================

function gerarHistoricoRotas(viaturaId) {
    const viatura = viaturas.find(v => v.id === viaturaId);
    if (!viatura) return [];

    const rotas = [];
    let lat = viatura.latitude;
    let lon = viatura.longitude;

    // Gerar 24 pontos de rota (últimas 24 horas)
    for (let i = 24; i >= 0; i--) {
        lat += (Math.random() - 0.5) * 0.002;
        lon += (Math.random() - 0.5) * 0.002;

        rotas.push({
            latitude: lat,
            longitude: lon,
            horario: new Date(Date.now() - i * 60 * 60 * 1000).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            data: new Date(Date.now() - i * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
            velocidade: Math.floor(Math.random() * 80) + 20,
            km: Math.floor(Math.random() * 50) + viatura.quilometragem - 500
        });
    }

    return rotas;
}

// ===========================
// FUNÇÃO PARA ATUALIZAR POSIÇÕES (SIMULAR MOVIMENTO)
// ===========================

function atualizarPosicoes() {
    viaturas.forEach(viatura => {
        if (viatura.status === 'operacao') {
            // Simular movimento pequeno (variar entre -0.0005 a 0.0005 graus)
            viatura.latitude += (Math.random() - 0.5) * 0.0005;
            viatura.longitude += (Math.random() - 0.5) * 0.0005;

            // Simular velocidade entre 20 e 80 km/h quando em operação
            viatura.velocidade = Math.floor(Math.random() * 60) + 20;

            // Atualizar quilometragem (simular incremento pequeno)
            viatura.quilometragem += Math.floor(Math.random() * 2);

            // Atualizar hora de última atualização
            viatura.ultimaAtualizacao = new Date().toLocaleString('pt-BR');
        }
    });
}

// Atualizar posições a cada 10 segundos
setInterval(atualizarPosicoes, 10000);

// ===========================
// FUNCÕES DE BUSCA E FILTRO
// ===========================

function filtrarViaturas(unidade = '', status = '', placa = '') {
    return viaturas.filter(viatura => {
        const contemUnidade = !unidade || viatura.unidade === unidade;
        const contemStatus = !status || viatura.status === status;
        const contemPlaca = !placa || viatura.placa.toLowerCase().includes(placa.toLowerCase());

        return contemUnidade && contemStatus && contemPlaca;
    });
}

function obterViaturasPorStatus(status) {
    return viaturas.filter(v => v.status === status).length;
}

function obterViaturasPorUnidade(unidade) {
    return viaturas.filter(v => v.unidade === unidade);
}

function obterViatura(id) {
    return viaturas.find(v => v.id === id);
}

function obterViaturasPorPlaca(placa) {
    return viaturas.find(v => v.placa.toLowerCase() === placa.toLowerCase());
}

// ===========================
// ESTATÍSTICAS
// ===========================

function obterEstatisticas() {
    return {
        total: viaturas.length,
        operacao: obterViaturasPorStatus('operacao'),
        manutencao: obterViaturasPorStatus('manutencao'),
        parada: obterViaturasPorStatus('parada'),
        disponibilidade: ((obterViaturasPorStatus('operacao') / viaturas.length) * 100).toFixed(2) + '%'
    };
}