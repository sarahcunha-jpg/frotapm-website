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
                            <li class="nav-item"><a class="nav-link" href="#dashboard">Dashboard</a></li>
                            <li class="nav-item"><a class="nav-link" href="#viaturas">Viaturas</a></li>
                            <li class="nav-item"><a class="nav-link" href="#manutencao">Manutenção</a></li>
                            <li class="nav-item"><a class="nav-link" href="#relatorios">Relatórios</a></li>
                            <li class="nav-item"><a class="nav-link" href="#rastreamento">Rastreamento</a></li>
                            <li class="nav-item"><a class="nav-link" href="#relogio">Relógio Global</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Container -->
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
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card bg-success text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">Viaturas Ativas</h6>
                                    <h2 class="mb-0">48</h2>
                                </div>
                                <i class="bi bi-car-front" style="font-size: 2rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card bg-warning text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">Em Manutenção</h6>
                                    <h2 class="mb-0">5</h2>
                                </div>
                                <i class="bi bi-tools" style="font-size: 2rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card bg-info text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">OS Abertas</h6>
                                    <h2 class="mb-0">12</h2>
                                </div>
                                <i class="bi bi-file-earmark-text" style="font-size: 2rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card bg-danger text-white shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title text-white-50">Custos Mês</h6>
                                    <h2 class="mb-0">R$ 15K</h2>
                                </div>
                                <i class="bi bi-currency-dollar" style="font-size: 2rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Sections -->
            <div class="row">
                <!-- Viaturas Section -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="bi bi-car-front"></i> Viaturas</h5>
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
                                        <tr>
                                            <td><strong>JKL-3456</strong></td>
                                            <td>Mercedes Sprinter</td>
                                            <td><span class="badge bg-danger">Indisponível</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button class="btn btn-primary btn-sm w-100">Ver Todas as Viaturas</button>
                        </div>
                    </div>
                </div>

                <!-- Ordens de Serviço Section -->
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
                                        <tr>
                                            <td><strong>#004</strong></td>
                                            <td>JKL-3456</td>
                                            <td><span class="badge bg-danger">Atrasado</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button class="btn btn-success btn-sm w-100">Ver Todas as OS</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Row -->
            <div class="row mb-4">
                <div class="col-md-6 mb-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-map" style="font-size: 3rem; color: #0d6efd;"></i>
                            <h5 class="card-title mt-3">Rastreamento em Tempo Real</h5>
                            <p class="card-text text-muted">Monitore a localização de todas as viaturas em um mapa interativo</p>
                            <a href="#rastreamento" class="btn btn-primary btn-sm">Acessar Rastreamento</a>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-graph-up" style="font-size: 3rem; color: #198754;"></i>
                            <h5 class="card-title mt-3">Relatórios Avançados</h5>
                            <p class="card-text text-muted">Gere relatórios em PDF, Excel e analise custos, disponibilidade e performance</p>
                            <a href="#relatorios" class="btn btn-success btn-sm">Ver Relatórios</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-6 mb-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-tools" style="font-size: 3rem; color: #ffc107;"></i>
                            <h5 class="card-title mt-3">Gestão de Manutenção</h5>
                            <p class="card-text text-muted">Controle manutenção preventiva, corretiva e registre todas as intervenções</p>
                            <a href="#manutencao" class="btn btn-warning btn-sm">Gerenciar Manutenção</a>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-globe" style="font-size: 3rem; color: #0dcaf0;"></i>
                            <h5 class="card-title mt-3">Relógio Global Multi-Zona</h5>
                            <p class="card-text text-muted">Monitore a hora em diferentes fusos horários para coordenação internacional</p>
                            <a href="#relogio" class="btn btn-info btn-sm">Ver Relógio</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tech Stack Info -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card shadow-sm bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Tecnologias Utilizadas</h5>
                            <div class="d-flex flex-wrap gap-2">
                                <span class="badge bg-primary">Bootstrap 5.3</span>
                                <span class="badge bg-success">JavaScript</span>
                                <span class="badge bg-info">HTML5</span>
                                <span class="badge bg-warning text-dark">CSS3</span>
                                <span class="badge bg-danger">Node.js (Backend)</span>
                                <span class="badge bg-secondary">MySQL</span>
                                <span class="badge bg-dark">GitHub Pages</span>
                                <span class="badge bg-purple">REST API</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="bg-dark text-white text-center py-3 mt-4">
                <p class="mb-0">&copy; 2026 FrotaPM Profissional - Sistema de Gestão de Frota | Desenvolvido por Sarah Cunha</p>
            </footer>
        </div>
    `;

    console.log('Dashboard renderizado com sucesso!');
    console.log('Componentes carregados:');
    console.log('- ✓ Navegação');
    console.log('- ✓ KPI Cards');
    console.log('- ✓ Tabela de Viaturas');
    console.log('- ✓ Tabela de Ordens de Serviço');
    console.log('- ✓ Cards de Features');
    console.log('- ✓ Rodapé');
});
