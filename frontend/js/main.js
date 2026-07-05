// Main application entry point - FrotaPM Dashboard
console.log('Frota PM - Sistema de Gestão da Frota');

document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    
    // Render the complete dashboard
    app.innerHTML = `
        <!-- Navigation Bar -->
        <nav class="navbar navbar-dark bg-dark sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="#">
                    <i class="bi bi-shield-check"></i> FrotaPM Profissional
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title">Menu</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item"><a class="nav-link" href="#dashboard" data-page="dashboard">Dashboard</a></li>
                            <li class="nav-item"><a class="nav-link" href="#viaturas" data-page="viaturas">Viaturas</a></li>
                            <li class="nav-item"><a class="nav-link" href="#os" data-page="os">Ordens de Serviço</a></li>
                            <li class="nav-item"><a class="nav-link" href="#manutencao" data-page="manutencao">Manutenção</a></li>
                            <li class="nav-item"><a class="nav-link" href="#rastreamento" data-page="rastreamento">Rastreamento</a></li>
                            <li class="nav-item"><a class="nav-link" href="#relatorios" data-page="relatorios">Relatórios</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Tabs Navigation -->
        <div class="bg-light border-bottom sticky-top" style="top: 56px; z-index: 90;">
            <div class="container-fluid">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="btn-dashboard" data-page="dashboard" type="button">
                            <i class="bi bi-speedometer2"></i> Dashboard
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="btn-viaturas" data-page="viaturas" type="button">
                            <i class="bi bi-car-front"></i> Viaturas
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="btn-os" data-page="os" type="button">
                            <i class="bi bi-file-text"></i> Ordens de Serviço
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="btn-manutencao" data-page="manutencao" type="button">
                            <i class="bi bi-tools"></i> Manutenção
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="btn-rastreamento" data-page="rastreamento" type="button">
                            <i class="bi bi-map"></i> Rastreamento
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="btn-relatorios" data-page="relatorios" type="button">
                            <i class="bi bi-graph-up"></i> Relatórios
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Content Container -->
        <div id="content-container"></div>

        <!-- Footer -->
        <footer class="bg-dark text-white text-center py-3 mt-4">
            <p class="mb-0">&copy; 2026 FrotaPM Profissional - Sistema de Gestão de Frota | Desenvolvido por Sarah Cunha</p>
        </footer>
    `;

    // Set up event listeners for tabs
    setupTabListeners();
    
    // Load initial page
    loadPage('dashboard');

    console.log('Dashboard renderizado com sucesso!');
});

function setupTabListeners() {
    const buttons = document.querySelectorAll('[data-page]');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.getAttribute('data-page');
            loadPage(page);
        });
    });
}

function loadPage(page) {
    const contentContainer = document.getElementById('content-container');
    
    // Remove active class from all tabs
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab
    const activeBtn = document.getElementById(`btn-${page}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Load content based on page
    switch(page) {
        case 'dashboard':
            contentContainer.innerHTML = getDashboardContent();
            break;
        case 'viaturas':
            contentContainer.innerHTML = getViaturasContent();
            break;
        case 'os':
            contentContainer.innerHTML = getOSContent();
            break;
        case 'manutencao':
            contentContainer.innerHTML = getManutencaoContent();
            break;
        case 'rastreamento':
            contentContainer.innerHTML = getRastreamentoContent();
            setTimeout(() => initializeMap(), 500);
            break;
        case 'relatorios':
            contentContainer.innerHTML = getRelatoriosContent();
            break;
        default:
            contentContainer.innerHTML = getDashboardContent();
    }
}

function getDashboardContent() {
    return `
        <div class="container-fluid py-4">
            <!-- Welcome Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="bg-primary text-white p-4 rounded shadow-sm">
                        <h1 class="mb-1">Bem-vindo ao FrotaPM Profissional</h1>
                        <p class="mb-0">Sistema completo de Gestão de Frota com Dashboard, Rastreamento, Relatórios, Usuários e Manutenções</p>
                    </div>
                </div>
            </div>

            <!-- KPI Cards Row -->
            <div class="row mb-4">
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card bg-success text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">Viaturas Ativas</h6>
                                    <h2 class="mb-0">48</h2>
                                </div>
                                <i class="bi bi-car-front" style="font-size: 2.5rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card bg-warning text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">Em Manutenção</h6>
                                    <h2 class="mb-0">5</h2>
                                </div>
                                <i class="bi bi-tools" style="font-size: 2.5rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card bg-info text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">OS Abertas</h6>
                                    <h2 class="mb-0">12</h2>
                                </div>
                                <i class="bi bi-file-earmark-text" style="font-size: 2.5rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card bg-danger text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">Custos Mês</h6>
                                    <h2 class="mb-0">R$ 15K</h2>
                                </div>
                                <i class="bi bi-currency-dollar" style="font-size: 2.5rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="row">
                <!-- Viaturas Card -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="bi bi-car-front"></i> Últimas Viaturas</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Placa</th>
                                            <th>Modelo</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>ABC-1234</strong></td>
                                            <td>Ford Transit</td>
                                            <td><span class="badge bg-success">Disponível</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>DEF-5678</strong></td>
                                            <td>Volkswagen Kombi</td>
                                            <td><span class="badge bg-warning">Manutenção</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>GHI-9012</strong></td>
                                            <td>Fiat Ducato</td>
                                            <td><span class="badge bg-success">Disponível</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button class="btn btn-primary btn-sm w-100">Ver Todas as Viaturas</button>
                        </div>
                    </div>
                </div>

                <!-- Ordens de Serviço Card -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="bi bi-file-earmark-check"></i> Ordens de Serviço Recentes</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>OS ID</th>
                                            <th>Viatura</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>#001</strong></td>
                                            <td>ABC-1234</td>
                                            <td><span class="badge bg-info">Em Progresso</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>#002</strong></td>
                                            <td>DEF-5678</td>
                                            <td><span class="badge bg-warning">Pendente</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>#003</strong></td>
                                            <td>GHI-9012</td>
                                            <td><span class="badge bg-success">Concluído</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button class="btn btn-success btn-sm w-100">Ver Todas as OS</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getViaturasContent() {
    return `
        <div class="container-fluid py-4">
            <h2 class="mb-4"><i class="bi bi-car-front"></i> Gestão de Viaturas</h2>
            
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Lista de Viaturas</h5>
                        <button class="btn btn-light btn-sm">+ Adicionar Viatura</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder="Buscar por placa...">
                        </div>
                        <div class="col-md-6">
                            <select class="form-select">
                                <option>Filtrar por Status</option>
                                <option>Disponível</option>
                                <option>Em Manutenção</option>
                                <option>Indisponível</option>
                            </select>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Placa</th>
                                    <th>Marca/Modelo</th>
                                    <th>Ano</th>
                                    <th>Status</th>
                                    <th>Quilometragem</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>ABC-1234</strong></td>
                                    <td>Ford Transit</td>
                                    <td>2020</td>
                                    <td><span class="badge bg-success">Disponível</span></td>
                                    <td>45.230 km</td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Editar</button>
                                        <button class="btn btn-sm btn-danger">Deletar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>DEF-5678</strong></td>
                                    <td>Volkswagen Kombi</td>
                                    <td>2019</td>
                                    <td><span class="badge bg-warning">Manutenção</span></td>
                                    <td>78.540 km</td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Editar</button>
                                        <button class="btn btn-sm btn-danger">Deletar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>GHI-9012</strong></td>
                                    <td>Fiat Ducato</td>
                                    <td>2021</td>
                                    <td><span class="badge bg-success">Disponível</span></td>
                                    <td>32.100 km</td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Editar</button>
                                        <button class="btn btn-sm btn-danger">Deletar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>JKL-3456</strong></td>
                                    <td>Mercedes Sprinter</td>
                                    <td>2022</td>
                                    <td><span class="badge bg-danger">Indisponível</span></td>
                                    <td>15.870 km</td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Editar</button>
                                        <button class="btn btn-sm btn-danger">Deletar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getOSContent() {
    return `
        <div class="container-fluid py-4">
            <h2 class="mb-4"><i class="bi bi-file-earmark-text"></i> Ordens de Serviço</h2>
            
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-success text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Ordens de Serviço Ativas</h5>
                        <button class="btn btn-light btn-sm">+ Nova OS</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Viatura</th>
                                    <th>Tipo de Manutenção</th>
                                    <th>Data Criação</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>#001</strong></td>
                                    <td>ABC-1234</td>
                                    <td>Manutenção Preventiva</td>
                                    <td>05/07/2026</td>
                                    <td><span class="badge bg-info">Em Progresso</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Editar</button>
                                        <button class="btn btn-sm btn-danger">Cancelar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>#002</strong></td>
                                    <td>DEF-5678</td>
                                    <td>Troca de Óleo</td>
                                    <td>04/07/2026</td>
                                    <td><span class="badge bg-warning">Pendente</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Editar</button>
                                        <button class="btn btn-sm btn-danger">Cancelar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>#003</strong></td>
                                    <td>GHI-9012</td>
                                    <td>Revisão Geral</td>
                                    <td>03/07/2026</td>
                                    <td><span class="badge bg-success">Concluído</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-info">Visualizar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getManutencaoContent() {
    return `
        <div class="container-fluid py-4">
            <h2 class="mb-4"><i class="bi bi-tools"></i> Gestão de Manutenção</h2>
            
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>8</h3>
                            <p class="mb-0">Preventivas Agendadas</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body text-center">
                            <h3>3</h3>
                            <p class="mb-0">Corretivas Pendentes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>25</h3>
                            <p class="mb-0">Concluídas (Mês)</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-danger text-white">
                        <div class="card-body text-center">
                            <h3>2</h3>
                            <p class="mb-0">Em Atraso</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-warning text-white">
                    <h5 class="mb-0">Histórico de Manutenção</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Viatura</th>
                                    <th>Tipo</th>
                                    <th>Data</th>
                                    <th>Custo</th>
                                    <th>Próxima Manutenção</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ABC-1234</td>
                                    <td><span class="badge bg-success">Preventiva</span></td>
                                    <td>01/07/2026</td>
                                    <td>R$ 450,00</td>
                                    <td>01/10/2026</td>
                                </tr>
                                <tr>
                                    <td>DEF-5678</td>
                                    <td><span class="badge bg-danger">Corretiva</span></td>
                                    <td>28/06/2026</td>
                                    <td>R$ 1.200,00</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getRastreamentoContent() {
    return `
        <div class="container-fluid py-4">
            <h2 class="mb-4"><i class="bi bi-map"></i> Rastreamento em Tempo Real</h2>
            
            <div class="row">
                <div class="col-lg-3 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0">Viaturas Rastreadas</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button type="button" class="list-group-item list-group-item-action active">
                                    <strong>ABC-1234</strong><br>
                                    <small>Ford Transit - Disponível</small>
                                </button>
                                <button type="button" class="list-group-item list-group-item-action">
                                    <strong>DEF-5678</strong><br>
                                    <small>VW Kombi - Em Manutenção</small>
                                </button>
                                <button type="button" class="list-group-item list-group-item-action">
                                    <strong>GHI-9012</strong><br>
                                    <small>Fiat Ducato - Disponível</small>
                                </button>
                                <button type="button" class="list-group-item list-group-item-action">
                                    <strong>JKL-3456</strong><br>
                                    <small>Mercedes - Em Rota</small>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-9 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0">Mapa de Localização</h5>
                        </div>
                        <div class="card-body p-0">
                            <div id="map" style="height: 500px; border-radius: 0 0 0.25rem 0.25rem;"></div>
                        </div>
                    </div>

                    <div class="card shadow-sm mt-3">
                        <div class="card-header bg-secondary text-white">
                            <h5 class="mb-0">Detalhes do Rastreamento - ABC-1234</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <p class="text-muted">Localização Atual</p>
                                    <strong>São Paulo, SP</strong>
                                </div>
                                <div class="col-md-3">
                                    <p class="text-muted">Velocidade</p>
                                    <strong>58 km/h</strong>
                                </div>
                                <div class="col-md-3">
                                    <p class="text-muted">Última Atualização</p>
                                    <strong>agora</strong>
                                </div>
                                <div class="col-md-3">
                                    <p class="text-muted">Status</p>
                                    <strong><span class="badge bg-success">Ativo</span></strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getRelatoriosContent() {
    return `
        <div class="container-fluid py-4">
            <h2 class="mb-4"><i class="bi bi-graph-up"></i> Relatórios e Análises</h2>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-body text-center">
                            <i class="bi bi-file-pdf" style="font-size: 2.5rem; color: #dc3545;"></i>
                            <h5 class="card-title mt-3">Relatório em PDF</h5>
                            <p class="card-text">Gerar relatório completo em formato PDF com gráficos e dados</p>
                            <button class="btn btn-danger btn-sm">Gerar PDF</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-spreadsheet" style="font-size: 2.5rem; color: #198754;"></i>
                            <h5 class="card-title mt-3">Relatório em Excel</h5>
                            <p class="card-text">Exportar dados para planilha Excel com múltiplas abas</p>
                            <button class="btn btn-success btn-sm">Gerar Excel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Filtros de Relatório</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Data Inicial</label>
                                    <input type="date" class="form-control">
                                </div>
                                <div class="col-md-3">
                                    <label>Data Final</label>
                                    <input type="date" class="form-control">
                                </div>
                                <div class="col-md-3">
                                    <label>Tipo de Relatório</label>
                                    <select class="form-select">
                                        <option>Custos</option>
                                        <option>Disponibilidade</option>
                                        <option>Manutenção</option>
                                        <option>Geral</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label>&nbsp;</label>
                                    <button class="btn btn-primary w-100">Gerar Relatório</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Análise de Custos (Últimos 12 Meses)</h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <strong>Gráfico será exibido aqui após implementação de Chart.js</strong><br>
                        Dados de custos: Manutenção Preventiva, Manutenção Corretiva, Combustível, Seguro
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to initialize Leaflet Map
function initializeMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.log('Map element not found');
        return;
    }

    // Add Leaflet CSS if not already added
    if (!document.querySelector('link[href*="leaflet.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);
    }

    // Add Leaflet JS if not already added
    if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = function() {
            createMap();
        };
        document.head.appendChild(script);
    } else {
        createMap();
    }
}

function createMap() {
    // Clear existing map if it exists
    if (window.map) {
        window.map.remove();
    }

    // Create map centered on São Paulo
    window.map = L.map('map').setView([-23.5505, -46.6333], 12);

    // Add map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(window.map);

    // Add markers for vehicles
    const vehicles = [
        { lat: -23.5505, lng: -46.6333, name: 'ABC-1234 - Ford Transit', status: 'Disponível', color: 'green' },
        { lat: -23.5600, lng: -46.6400, name: 'DEF-5678 - VW Kombi', status: 'Em Manutenção', color: 'orange' },
        { lat: -23.5400, lng: -46.6200, name: 'GHI-9012 - Fiat Ducato', status: 'Disponível', color: 'green' },
        { lat: -23.5300, lng: -46.6500, name: 'JKL-3456 - Mercedes', status: 'Em Rota', color: 'blue' }
    ];

    vehicles.forEach(vehicle => {
        const iconColor = vehicle.color === 'green' ? '90ee90' : vehicle.color === 'orange' ? 'ffa500' : '0087be';
        L.circleMarker([vehicle.lat, vehicle.lng], {
            radius: 10,
            fillColor: '#' + iconColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<strong>${vehicle.name}</strong><br>Status: ${vehicle.status}`).addTo(window.map);
    });
}
