// Inicializar Dashboard
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosDashboard();
    inicializarGraficos();
    configurarNavegacao();
});

// Carregar dados no dashboard
function carregarDadosDashboard() {
    const totalViaturas = viaturas.length;
    const emOperacao = viaturas.filter(v => v.status === 'operacao').length;
    const emManutencao = viaturas.filter(v => v.status === 'manutencao').length;
    const indisponiveis = totalViaturas - emOperacao - emManutencao;

    document.getElementById('total-viaturas').textContent = totalViaturas;
    document.getElementById('em-operacao').textContent = emOperacao;
    document.getElementById('em-manutencao').textContent = emManutencao;
    document.getElementById('indisponiveis').textContent = indisponiveis;
}

// Inicializar gráficos com Chart.js
function inicializarGraficos() {
    // Gráfico de Disponibilidade
    const ctxDisp = document.getElementById('chartDisponibilidade')?.getContext('2d');
    if (ctxDisp) {
        new Chart(ctxDisp, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Disponibilidade %',
                    data: dadosGraficos.disponibilidade,
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

    // Gráfico de Manutenções
    const ctxMan = document.getElementById('chartManutencoes')?.getContext('2d');
    if (ctxMan) {
        new Chart(ctxMan, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Manutenções',
                    data: dadosGraficos.manutencoesMes,
                    backgroundColor: '#0d6efd'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Gráfico de Custos
    const ctxCust = document.getElementById('chartCustos')?.getContext('2d');
    if (ctxCust) {
        new Chart(ctxCust, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Custos (R$)',
                    data: dadosGraficos.custosMes,
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
    if (ctxFalh) {
        new Chart(ctxFalh, {
            type: 'doughnut',
            data: {
                labels: dadosGraficos.falhasRecorrentes,
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

// Navegação entre abas
function configurarNavegacao() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(tab => tab.style.display = 'none');
            
            // Adicionar active ao clicado
            this.classList.add('active');
            const tabId = this.getAttribute('href').substring(1);
            document.getElementById(tabId).style.display = 'block';
        });
    });
}
