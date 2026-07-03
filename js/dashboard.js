// Inicializar Dashboard com segurança, mesmo que DOMContentLoaded já tenha disparado
function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
}

onReady(function() {
    carregarDadosDashboard();
    inicializarGraficos();
    configurarNavegacao();
});

// Carregar dados no dashboard (com proteções contra elementos ausentes)
function carregarDadosDashboard() {
    const totalViaturas = Array.isArray(viaturas) ? viaturas.length : 0;
    const emOperacao = Array.isArray(viaturas) ? viaturas.filter(v => v.status === 'operacao').length : 0;
    const emManutencao = Array.isArray(viaturas) ? viaturas.filter(v => v.status === 'manutencao').length : 0;
    const indisponiveis = totalViaturas - emOperacao - emManutencao;

    const elTotalViaturas = document.getElementById('totalViaturas') || document.getElementById('total-viaturas');
    if (elTotalViaturas) elTotalViaturas.textContent = totalViaturas;

    const elTotalOS = document.getElementById('totalOS') || document.getElementById('total-os') || document.getElementById('totalOs');
    if (elTotalOS) elTotalOS.textContent = (typeof ordensServico !== 'undefined') ? ordensServico.length : 0;

    const elCustoTotal = document.getElementById('custoTotal') || document.getElementById('custo-total');
    if (elCustoTotal && typeof ordensServico !== 'undefined') {
        const soma = ordensServico.reduce((acc, os) => acc + (Number(os.custo) || 0), 0);
        elCustoTotal.textContent = 'R$ ' + soma.toFixed(2);
    }

    const elIndisponiveis = document.getElementById('indisponiveis');
    if (elIndisponiveis) elIndisponiveis.textContent = indisponiveis;

    const elEmOperacao = document.getElementById('em-operacao') || document.getElementById('emOperacao');
    if (elEmOperacao) elEmOperacao.textContent = emOperacao;

    const elEmManutencao = document.getElementById('em-manutencao') || document.getElementById('emManutencao');
    if (elEmManutencao) elEmManutencao.textContent = emManutencao;
}

// Inicializar gráficos com Chart.js (uso seguro de optional chaining)
function inicializarGraficos() {
    // Gráfico de Disponibilidade
    const ctxDisp = document.getElementById('chartDisponibilidade')?.getContext('2d');
    if (ctxDisp && typeof Chart !== 'undefined') {
        new Chart(ctxDisp, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Disponibilidade %',
                    data: (typeof dadosGraficos !== 'undefined') ? dadosGraficos.disponibilidade : [],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }

    // Gráfico de Custos (corrigido: usa chartCustos que existe no HTML)
    const ctxCust = document.getElementById('chartCustos')?.getContext('2d');
    if (ctxCust && typeof Chart !== 'undefined') {
        new Chart(ctxCust, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Custos (R$)',
                    data: (typeof dadosGraficos !== 'undefined') ? dadosGraficos.custosMes : [],
                    backgroundColor: '#dc3545'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Gráfico de Falhas
    const ctxFalh = document.getElementById('chartFalhas')?.getContext('2d');
    if (ctxFalh && typeof Chart !== 'undefined') {
        new Chart(ctxFalh, {
            type: 'doughnut',
            data: {
                labels: (typeof dadosGraficos !== 'undefined') ? dadosGraficos.falhasRecorrentes : [],
                datasets: [{
                    data: [25, 20, 15, 20, 20],
                    backgroundColor: ['#0d6efd', '#28a745', '#ffc107', '#dc3545', '#17a2b8']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

// Navegação entre abas (segura)
function configurarNavegacao() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    // Seleciona apenas as abas principais (filhas diretas de .container-fluid)
    const tabContents = document.querySelectorAll('.container-fluid > .tab-content');

    if (!navLinks || !tabContents) return;

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(tab => tab.style.display = 'none');

            // Adicionar active ao clicado
            this.classList.add('active');
            const tabId = this.getAttribute('href')?.substring(1);
            if (tabId) {
                const target = document.getElementById(tabId);
                if (target) target.style.display = 'block';
            }
        });
    });
}
