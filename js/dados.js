// Dados das Viaturas (inicializados, mas podem ser sobrescritos por localStorage)
let viaturas = [
    {
        id: 1,
        placa: 'PM-0001',
        modelo: 'Ford Transit Custom',
        ano: 2021,
        quilometragem: 85432,
        unidade: '1º Batalhão',
        status: 'operacao',
        ultimaRevisao: '2024-01-15',
        proximaRevisao: '2024-03-15',
        latitude: -26.9168,
        longitude: -49.0683
    },
    {
        id: 2,
        placa: 'PM-0002',
        modelo: 'Chevrolet Blazer',
        ano: 2020,
        quilometragem: 92156,
        unidade: '1º Batalhão',
        status: 'operacao',
        ultimaRevisao: '2024-02-10',
        proximaRevisao: '2024-04-10',
        latitude: -26.9175,
        longitude: -49.0675
    },
    {
        id: 3,
        placa: 'PM-0003',
        modelo: 'Ford Ranger',
        ano: 2019,
        quilometragem: 105789,
        unidade: '2º Batalhão',
        status: 'manutencao',
        ultimaRevisao: '2023-12-20',
        proximaRevisao: '2024-01-20',
        latitude: -26.9200,
        longitude: -49.0700
    },
    {
        id: 4,
        placa: 'PM-0004',
        modelo: 'Chevrolet S10',
        ano: 2022,
        quilometragem: 72345,
        unidade: '2º Batalhão',
        status: 'operacao',
        ultimaRevisao: '2024-02-20',
        proximaRevisao: '2024-04-20',
        latitude: -26.9145,
        longitude: -49.0720
    },
    {
        id: 5,
        placa: 'PM-0005',
        modelo: 'Ford Transit',
        ano: 2021,
        quilometragem: 68921,
        unidade: '3º Batalhão',
        status: 'operacao',
        ultimaRevisao: '2024-01-30',
        proximaRevisao: '2024-03-30',
        latitude: -26.9210,
        longitude: -49.0650
    }
];

// Dados de Manutenção Preventiva
let manutencaoPreventiva = [
    { id: 1, item: 'Troca de óleo', frequencia: '10.000 km', ultimaExecucao: '2024-01-10', proximaExecucao: '2024-03-10' },
    { id: 2, item: 'Revisão dos freios', frequencia: '20.000 km', ultimaExecucao: '2024-01-15', proximaExecucao: '2024-03-15' },
    { id: 3, item: 'Alinhamento e balanceamento', frequencia: '15.000 km', ultimaExecucao: '2024-01-20', proximaExecucao: '2024-03-20' },
    { id: 4, item: 'Troca de pneus', frequencia: 'Conforme desgaste', ultimaExecucao: '2024-02-05', proximaExecucao: '2024-04-05' },
    { id: 5, item: 'Revisão elétrica', frequencia: '6 meses', ultimaExecucao: '2023-12-01', proximaExecucao: '2024-06-01' },
    { id: 6, item: 'Revisão geral', frequencia: 'Anual', ultimaExecucao: '2023-06-15', proximaExecucao: '2024-06-15' }
];

// Dados de Ordens de Serviço
let ordensServico = [
    {
        id: 1,
        numero: 'OS-001',
        viatura: 'PM-0001',
        data: '2024-02-10',
        problema: 'Vazamento de óleo',
        servico: 'Troca de óleo e filtro',
        responsavel: 'Mecânico João',
        pecas: 'Óleo sintético 5L, Filtro de óleo',
        custo: 150.00,
        tempoParada: '2h',
        status: 'finalizada'
    },
    {
        id: 2,
        numero: 'OS-002',
        viatura: 'PM-0003',
        data: '2024-02-15',
        problema: 'Freio desgastado',
        servico: 'Substituição de pastilhas de freio',
        responsavel: 'Mecânico Maria',
        pecas: 'Pastilha de freio (4 unidades)',
        custo: 320.00,
        tempoParada: '4h',
        status: 'em_progresso'
    },
    {
        id: 3,
        numero: 'OS-003',
        viatura: 'PM-0002',
        data: '2024-02-20',
        problema: 'Pneu furado',
        servico: 'Reparo de pneu',
        responsavel: 'Mecânico Pedro',
        pecas: 'Vedante para pneu',
        custo: 80.00,
        tempoParada: '1h',
        status: 'aberta'
    }
];

// Histórico de Manutenção
let historicoManutencao = [
    {
        viatura: 'PM-0001',
        servico: 'Troca de óleo',
        data: '2024-01-10',
        custo: 150.00,
        pecas: 'Óleo 5L, Filtro',
        tempoParada: '2h'
    },
    {
        viatura: 'PM-0002',
        servico: 'Revisão geral',
        data: '2024-01-15',
        custo: 500.00,
        pecas: 'Várias',
        tempoParada: '8h'
    },
    {
        viatura: 'PM-0003',
        servico: 'Substituição de pastilhas',
        data: '2024-01-20',
        custo: 320.00,
        pecas: 'Pastilhas de freio',
        tempoParada: '4h'
    }
];

// KPIs
let kpis = {
    disponibilidade: 75,
    mttr: 4.5,
    mtbf: 450,
    custoPorViatura: 2350.00,
    totalManutencoesAno: 24,
    totalCustosAno: 28200.00
};

// Dados para gráficos
let dadosGraficos = {
    disponibilidade: [75, 78, 72, 80, 75, 82],
    manutencoesMes: [5, 4, 6, 3, 7, 5],
    custosMes: [1200, 1100, 1500, 900, 1800, 1300],
    falhasRecorrentes: ['Freios', 'Óleo', 'Pneus', 'Elétrica', 'Suspensão']
};

// LocalStorage helpers
const STORAGE_KEY = 'frotapm_data_v1';

function saveAllData() {
    const payload = {
        viaturas,
        manutencaoPreventiva,
        ordensServico,
        historicoManutencao,
        kpis,
        dadosGraficos
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn('Não foi possível salvar em localStorage:', e);
    }
}

function loadAllData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        if (parsed.viaturas) viaturas = parsed.viaturas;
        if (parsed.manutencaoPreventiva) manutencaoPreventiva = parsed.manutencaoPreventiva;
        if (parsed.ordensServico) ordensServico = parsed.ordensServico;
        if (parsed.historicoManutencao) historicoManutencao = parsed.historicoManutencao;
        if (parsed.kpis) kpis = parsed.kpis;
        if (parsed.dadosGraficos) dadosGraficos = parsed.dadosGraficos;
        return true;
    } catch (e) {
        console.warn('Erro ao ler localStorage:', e);
        return false;
    }
}

// Inicializa dados: tenta carregar do localStorage, se não existir mantém os dados embutidos
(function(){
    const loaded = loadAllData();
    if (!loaded) saveAllData();
})();
