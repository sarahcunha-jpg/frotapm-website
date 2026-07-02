// ===========================
// VARIÁVEIS GLOBAIS
// ===========================

let mapa;
let marcadores = {};
let mapaPolilinhas = {};
let viaturaAtiva = null;
let clusterGroup;
const INTERVALO_ATUALIZACAO = 10000; // 10 segundos

// ===========================
// INICIALIZAÇÃO DO MAPA
// ===========================

function inicializarMapa() {
    // Coordenadas iniciais: Blumenau, SC
    const coordenadasIniciais = [-26.9168, -49.0683];

    // Criar mapa com Leaflet
    mapa = L.map('mapa').setView(coordenadasIniciais, 14);

    // Adicionar tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 12
    }).addTo(mapa);

    // Criar grupo de cluster
    clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 80,
        iconCreateFunction: criarIconeCluster
    });
    mapa.addLayer(clusterGroup);

    // Carregar viaturas no mapa
    carregarViaturas();

    // Adicionar listener para clique fora dos marcadores
    mapa.on('click', fecharInfoBox);

    console.log('✓ Mapa inicializado com sucesso');
}

// ===========================
// CRIAR ÍCONES DE MARCADORES
// ===========================

function criarIconeViatura(status) {
    const cores = {
        operacao: '#28a745',
        manutencao: '#ffc107',
        parada: '#dc3545'
    };

    const cor = cores[status] || '#999';

    return L.divIcon({
        html: `
            <div style="
                width: 40px;
                height: 40px;
                background-color: ${cor};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 18px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-car"></i>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        className: 'icone-viatura'
    });
}

function criarIconeCluster(cluster) {
    const count = cluster.getChildCount();
    let tamanho = 'small';
    let tamanhoPixel = 40;
    let zoom = 14;

    if (count > 100) {
        tamanho = 'large';
        tamanhoPixel = 50;
    } else if (count > 50) {
        tamanho = 'medium';
        tamanhoPixel = 45;
    }

    return L.divIcon({
        html: `
            <div style="
                width: ${tamanhoPixel}px;
                height: ${tamanhoPixel}px;
                background: linear-gradient(135deg, #003d82 0%, #00a8e8 100%);
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 14px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            ">
                ${count}
            </div>
        `,
        iconSize: [tamanhoPixel, tamanhoPixel],
        iconAnchor: [tamanhoPixel / 2, tamanhoPixel / 2],
        popupAnchor: [0, -tamanhoPixel / 2],
        className: 'icone-cluster'
    });
}

// ===========================
// CARREGAR VIATURAS NO MAPA
// ===========================

function carregarViaturas() {
    clusterGroup.clearLayers();
    marcadores = {};
    mapaPolilinhas = {};

    viaturas.forEach(viatura => {
        adicionarMarcadorViatura(viatura);
    });

    atualizarListaViaturas();
    atualizarEstatisticas();
}

function adicionarMarcadorViatura(viatura) {
    const marcador = L.marker(
        [viatura.latitude, viatura.longitude],
        { icon: criarIconeViatura(viatura.status) }
    );

    // Popup com informações básicas
    const popupConteudo = `
        <div style="text-align: center; min-width: 150px;">
            <strong>${viatura.placa}</strong><br>
            <small>${viatura.modelo}</small><br>
            <span style="
                display: inline-block;
                padding: 4px 8px;
                border-radius: 3px;
                background-color: ${obterCorStatus(viatura.status)};
                color: white;
                font-size: 12px;
                margin-top: 5px;
            ">
                ${obterLabelStatus(viatura.status)}
            </span>
        </div>
    `;

    marcador.bindPopup(popupConteudo);

    // Evento ao clicar no marcador
    marcador.on('click', function() {
        exibirInfoBox(viatura.id);
        mapa.setView([viatura.latitude, viatura.longitude], 16);
    });

    // Armazenar referência do marcador
    marcadores[viatura.id] = marcador;

    // Adicionar ao cluster
    clusterGroup.addLayer(marcador);
}

// ===========================
// CAIXA DE INFORMAÇÕES
// ===========================

function exibirInfoBox(viaturaId) {
    const viatura = obterViatura(viaturaId);
    if (!viatura) return;

    viaturaAtiva = viatura.id;

    // Preencher informações
    document.getElementById('info-placa').textContent = viatura.placa;
    document.getElementById('info-modelo').textContent = viatura.modelo;
    document.getElementById('info-unidade').textContent = viatura.unidade;
    document.getElementById('info-status').textContent = obterLabelStatus(viatura.status);
    document.getElementById('info-velocidade').textContent = viatura.velocidade + ' km/h';
    document.getElementById('info-km').textContent = viatura.quilometragem.toLocaleString('pt-BR') + ' km';
    document.getElementById('info-ultima-atualizacao').textContent = viatura.ultimaAtualizacao;
    document.getElementById('info-localizacao').textContent = viatura.localizacao;

    // Estilo do status
    const elementoStatus = document.getElementById('info-status');
    elementoStatus.style.backgroundColor = obterCorStatus(viatura.status);
    elementoStatus.style.color = 'white';
    elementoStatus.style.padding = '4px 8px';
    elementoStatus.style.borderRadius = '3px';
    elementoStatus.style.display = 'inline-block';

    // Exibir info box
    document.getElementById('info-box').classList.remove('hidden');

    // Destacar item na lista
    document.querySelectorAll('.viatura-item').forEach(item => {
        item.classList.remove('ativo');
    });
    const itemAtivo = document.querySelector(`[data-viatura-id="${viaturaId}"]`);
    if (itemAtivo) {
        itemAtivo.classList.add('ativo');
        itemAtivo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function fecharInfoBox() {
    document.getElementById('info-box').classList.add('hidden');
    document.querySelectorAll('.viatura-item').forEach(item => {
        item.classList.remove('ativo');
    });
    viaturaAtiva = null;
}

// ===========================
// LISTA DE VIATURAS
// ===========================

function atualizarListaViaturas() {
    const listaContainer = document.getElementById('lista-viaturas');
    listaContainer.innerHTML = '';

    const viaturasFiltradas = obterViaturasFiltradas();

    if (viaturasFiltradas.length === 0) {
        listaContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">Nenhuma viatura encontrada</p>';
        return;
    }

    viaturasFiltradas.forEach(viatura => {
        const item = document.createElement('div');
        item.className = 'viatura-item';
        item.setAttribute('data-viatura-id', viatura.id);

        const statusBadge = `<span class="status-badge ${viatura.status}">${obterLabelStatus(viatura.status)}</span>`;

        item.innerHTML = `
            <div class="placa">${viatura.placa}</div>
            <div class="modelo">${viatura.modelo} (${viatura.ano})</div>
            ${statusBadge}
        `;

        item.addEventListener('click', () => {
            exibirInfoBox(viatura.id);
            mapa.setView([viatura.latitude, viatura.longitude], 16);
        });

        listaContainer.appendChild(item);
    });
}

// ===========================
// FILTROS
// ===========================

function obterViaturasFiltradas() {
    const unidade = document.getElementById('filtro-unidade').value;
    const status = document.getElementById('filtro-status').value;
    const placa = document.getElementById('busca-placa').value;

    return filtrarViaturas(unidade, status, placa);
}

function aplicarFiltros() {
    // Limpar cluster e marcadores
    clusterGroup.clearLayers();
    marcadores = {};

    // Carregar apenas viaturas filtradas
    const viaturasFiltradas = obterViaturasFiltradas();
    viaturasFiltradas.forEach(viatura => {
        adicionarMarcadorViatura(viatura);
    });

    atualizarListaViaturas();
    atualizarEstatisticas();

    fecharInfoBox();
}

function limparFiltros() {
    document.getElementById('filtro-unidade').value = '';
    document.getElementById('filtro-status').value = '';
    document.getElementById('busca-placa').value = '';

    carregarViaturas();
    fecharInfoBox();
}

// ===========================
// HISTÓRICO DE ROTAS
// ===========================

function abrirModalHistorico() {
    if (!viaturaAtiva) return;

    const viatura = obterViatura(viaturaAtiva);
    if (!viatura) return;

    document.getElementById('modal-placa').textContent = viatura.placa;
    document.getElementById('modal-historico').classList.remove('hidden');

    const rotas = gerarHistoricoRotas(viaturaAtiva);
    desenharGraficoRotas(rotas);
    preencherTabelaRotas(rotas);
}

function fecharModalHistorico() {
    document.getElementById('modal-historico').classList.add('hidden');
}

function desenharGraficoRotas(rotas) {
    const canvas = document.getElementById('canvas-historico');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const largura = canvas.parentElement.offsetWidth;
    const altura = 200;

    canvas.width = largura;
    canvas.height = altura;

    // Desenhar fundo
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, largura, altura);

    // Desenhar grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const y = (altura / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(largura, y);
        ctx.stroke();
    }

    // Dados para o gráfico
    const velocidades = rotas.map(r => r.velocidade);
    const maxVelocidade = Math.max(...velocidades);
    const minVelocidade = Math.min(...velocidades);
    const escala = altura / (maxVelocidade - minVelocidade || 1);
    const larguraPonto = largura / rotas.length;

    // Desenhar linha de velocidade
    ctx.strokeStyle = '#00a8e8';
    ctx.lineWidth = 3;
    ctx.beginPath();

    rotas.forEach((rota, index) => {
        const x = index * larguraPonto;
        const y = altura - ((rota.velocidade - minVelocidade) * escala) - 10;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Desenhar pontos
    ctx.fillStyle = '#003d82';
    rotas.forEach((rota, index) => {
        const x = index * larguraPonto;
        const y = altura - ((rota.velocidade - minVelocidade) * escala) - 10;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenhar eixos
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, altura - 10);
    ctx.lineTo(largura, altura - 10);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Velocidade (km/h) - Últimas 24 Horas', largura / 2, altura - 5);
}

function preencherTabelaRotas(rotas) {
    const tabela = document.getElementById('tabela-historico');
    tabela.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Velocidade</th>
                    <th>Quilometragem</th>
                </tr>
            </thead>
            <tbody>
                ${rotas.map(rota => `
                    <tr>
                        <td>${rota.data}</td>
                        <td>${rota.horario}</td>
                        <td>${rota.velocidade} km/h</td>
                        <td>${rota.km.toLocaleString('pt-BR')} km</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ===========================
// ATUALIZAR POSIÇÕES EM TEMPO REAL
// ===========================

function atualizarMarcadores() {
    viaturas.forEach(viatura => {
        if (marcadores[viatura.id]) {
            // Atualizar posição do marcador
            marcadores[viatura.id].setLatLng([viatura.latitude, viatura.longitude]);

            // Se for a viatura ativa, atualizar info box
            if (viaturaAtiva === viatura.id) {
                exibirInfoBox(viatura.id);
            }
        }
    });

    atualizarListaViaturas();
    atualizarEstatisticas();
}

// Atualizar marcadores a cada 10 segundos
setInterval(atualizarMarcadores, INTERVALO_ATUALIZACAO);

// ===========================
// ATUALIZAR ESTATÍSTICAS
// ===========================

function atualizarEstatisticas() {
    const stats = obterEstatisticas();

    document.getElementById('total-viaturas').textContent = stats.total;
    document.getElementById('viaturas-operacao').textContent = stats.operacao;
    document.getElementById('viaturas-manutencao').textContent = stats.manutencao;
    document.getElementById('viaturas-parada').textContent = stats.parada;
}

// ===========================
// FUNÇÕES AUXILIARES
// ===========================

function obterCorStatus(status) {
    const cores = {
        operacao: '#28a745',
        manutencao: '#ffc107',
        parada: '#dc3545'
    };
    return cores[status] || '#999';
}

function obterLabelStatus(status) {
    const labels = {
        operacao: 'Em Operação',
        manutencao: 'Em Manutenção',
        parada: 'Parada'
    };
    return labels[status] || 'Desconhecido';
}

function centralizarMapa() {
    if (viaturaAtiva) {
        const viatura = obterViatura(viaturaAtiva);
        if (viatura) {
            mapa.setView([viatura.latitude, viatura.longitude], 16);
        }
    } else {
        // Centralizar em Blumenau
        mapa.setView([-26.9168, -49.0683], 14);
    }
}

function ativarTelaCheia() {
    const elem = document.getElementById('mapa-container') || document.body;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    inicializarMapa();

    // Filtros
    document.getElementById('filtro-unidade').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-status').addEventListener('change', aplicarFiltros);
    document.getElementById('busca-placa').addEventListener('input', aplicarFiltros);

    // Botões
    document.getElementById('btn-atualizar').addEventListener('click', () => {
        carregarViaturas();
    });

    document.getElementById('btn-limpar').addEventListener('click', limparFiltros);

    document.getElementById('btn-fechar-info').addEventListener('click', fecharInfoBox);

    document.getElementById('btn-historico').addEventListener('click', abrirModalHistorico);

    // Modal
    document.getElementById('modal-historico').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModalHistorico();
        }
    });

    // Controles do mapa
    document.getElementById('btn-centralizar').addEventListener('click', centralizarMapa);
    document.getElementById('btn-fullscreen').addEventListener('click', ativarTelaCheia);

    // Fechar info box ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharInfoBox();
            fecharModalHistorico();
        }
    });

    console.log('✓ Sistema de rastreamento inicializado com sucesso');
});

// ===========================
// FUNÇÃO GLOBAL PARA FECHAR MODAL (COMPATIBILIDADE HTML)
// ===========================

function fecharModalHistorico() {
    document.getElementById('modal-historico').classList.add('hidden');
}