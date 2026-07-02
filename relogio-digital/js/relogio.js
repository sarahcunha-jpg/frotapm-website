// Estado da aplicação
const appState = {
    selectedTimezones: [],
    isDarkTheme: true,
    updateInterval: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('relogio-theme') || 'dark';
    if (savedTheme === 'light') {
        appState.isDarkTheme = false;
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }

    // Carregar fusos horários salvos
    const savedTimezones = localStorage.getItem('relogio-fusos');
    if (savedTimezones) {
        appState.selectedTimezones = JSON.parse(savedTimezones);
    } else {
        appState.selectedTimezones = [...defaultTimezones];
    }

    // Eventos
    document.getElementById('btn-adicionar').addEventListener('click', abrirModalFuso);
    document.getElementById('btn-tema').addEventListener('click', alterarTema);
    document.getElementById('search-fuso').addEventListener('input', filtrarFusos);

    // Renderizar
    renderizarRelogios();
    renderizarListaFusos();
    atualizarRelogios();
    atualizarStats();

    // Atualizar a cada segundo
    appState.updateInterval = setInterval(() => {
        atualizarRelogios();
        atualizarStats();
    }, 1000);
});

// Abrir modal de fuso horário
function abrirModalFuso() {
    document.getElementById('modal-fuso').classList.add('ativo');
    renderizarListaFusos();
}

// Fechar modal
function fecharModalFuso() {
    document.getElementById('modal-fuso').classList.remove('ativo');
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-fuso');
    if (e.target === modal) {
        fecharModalFuso();
    }
});

// Renderizar lista de fusos
function renderizarListaFusos() {
    const container = document.getElementById('lista-fusos');
    const searchValue = document.getElementById('search-fuso').value.toLowerCase();

    const filtrados = timezonesData.filter(tz => {
        return tz.cidade.toLowerCase().includes(searchValue) ||
               tz.pais.toLowerCase().includes(searchValue) ||
               tz.timezone.toLowerCase().includes(searchValue);
    });

    container.innerHTML = filtrados.map(tz => `
        <div class="fuso-item" onclick="adicionarFuso('${tz.timezone}')">
            <div class="fuso-info">
                <span class="fuso-nome">${tz.flag} ${tz.cidade}</span>
                <span class="fuso-offset">UTC ${tz.offset > 0 ? '+' : ''}${tz.offset}</span>
            </div>
            ${appState.selectedTimezones.includes(tz.timezone) ? '<i class="fas fa-check" style="color: #00d4ff;"></i>' : ''}
        </div>
    `).join('');
}

// Filtrar fusos
function filtrarFusos() {
    renderizarListaFusos();
}

// Adicionar fuso horário
function adicionarFuso(timezone) {
    if (!appState.selectedTimezones.includes(timezone)) {
        appState.selectedTimezones.push(timezone);
        salvarFusos();
        renderizarRelogios();
        renderizarListaFusos();
        atualizarStats();
    }
}

// Remover fuso horário
function removerFuso(timezone) {
    appState.selectedTimezones = appState.selectedTimezones.filter(tz => tz !== timezone);
    salvarFusos();
    renderizarRelogios();
    atualizarStats();
}

// Salvar fusos em localStorage
function salvarFusos() {
    localStorage.setItem('relogio-fusos', JSON.stringify(appState.selectedTimezones));
}

// Renderizar relógios
function renderizarRelogios() {
    const container = document.getElementById('relogios-container');

    if (appState.selectedTimezones.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <h2>Nenhum fuso horário selecionado</h2>
                <p>Clique em "Adicionar Fuso" para começar a monitorar diferentes fusos horários</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.selectedTimezones.map(tzName => {
        const tzData = timezonesData.find(tz => tz.timezone === tzName);
        if (!tzData) return '';

        return `
            <div class="relogio-card">
                <div class="relogio-header">
                    <div class="cidade-info">
                        <span class="cidade-nome">${tzData.flag} ${tzData.cidade}</span>
                        <span class="pais-nome">${tzData.pais}</span>
                    </div>
                    <button class="btn-remover" onclick="removerFuso('${tzName}')" title="Remover">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="relogio-display" data-timezone="${tzName}">
                    --:--:--
                </div>
                
                <div class="fuso-horario" data-offset="${tzName}">
                    UTC ${tzData.offset > 0 ? '+' : ''}${tzData.offset}
                </div>

                <div class="tempo-info">
                    <div class="info-item">
                        <span class="info-label">Data</span>
                        <span class="info-value" data-date="${tzName}">--/--/--</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Período</span>
                        <span class="info-value" data-period="${tzName}">--</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Atualizar relógios
function atualizarRelogios() {
    appState.selectedTimezones.forEach(tzName => {
        const time = obterHoraFuso(tzName);
        
        const displayElement = document.querySelector(`[data-timezone="${tzName}"]`);
        if (displayElement) {
            displayElement.textContent = time.horaFormatada;
        }

        const dateElement = document.querySelector(`[data-date="${tzName}"]`);
        if (dateElement) {
            dateElement.textContent = time.dataFormatada;
        }

        const periodElement = document.querySelector(`[data-period="${tzName}"]`);
        if (periodElement) {
            periodElement.textContent = time.periodo;
        }
    });
}

// Obter hora no fuso horário
function obterHoraFuso(timezone) {
    try {
        const options = {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const formatter = new Intl.DateTimeFormat('pt-BR', options);
        const parts = formatter.formatToParts(new Date());

        const hora = parts.find(p => p.type === 'hour').value;
        const minuto = parts.find(p => p.type === 'minute').value;
        const segundo = parts.find(p => p.type === 'second').value;
        const dia = parts.find(p => p.type === 'day').value;
        const mes = parts.find(p => p.type === 'month').value;
        const ano = parts.find(p => p.type === 'year').value;

        const horaFormatada = `${hora}:${minuto}:${segundo}`;
        const dataFormatada = `${dia}/${mes}/${ano}`;
        const periodo = hora >= 12 ? 'PM' : 'AM';

        return {
            horaFormatada,
            dataFormatada,
            periodo,
            hora: parseInt(hora),
            minuto: parseInt(minuto),
            segundo: parseInt(segundo)
        };
    } catch (e) {
        console.error(`Erro ao obter hora para ${timezone}:`, e);
        return {
            horaFormatada: '--:--:--',
            dataFormatada: '--/--/--',
            periodo: '--'
        };
    }
}

// Atualizar estatísticas
function atualizarStats() {
    // Total de fusos
    document.getElementById('stat-fusos').textContent = appState.selectedTimezones.length;

    // Total de cidades
    document.getElementById('stat-cidades').textContent = appState.selectedTimezones.length;

    // Diferença máxima
    if (appState.selectedTimezones.length > 1) {
        const horas = appState.selectedTimezones.map(tz => {
            const data = timezonesData.find(d => d.timezone === tz);
            return data ? data.offset : 0;
        });

        const maxOffset = Math.max(...horas);
        const minOffset = Math.min(...horas);
        const diferenca = maxOffset - minOffset;

        document.getElementById('stat-diferenca').textContent = `${diferenca}h`;
    } else {
        document.getElementById('stat-diferenca').textContent = '0h';
    }
}

// Alternar tema
function alterarTema() {
    appState.isDarkTheme = !appState.isDarkTheme;
    
    if (appState.isDarkTheme) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('relogio-theme', 'dark');
        document.querySelector('.btn-theme i').classList.remove('fa-sun');
        document.querySelector('.btn-theme i').classList.add('fa-moon');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('relogio-theme', 'light');
        document.querySelector('.btn-theme i').classList.remove('fa-moon');
        document.querySelector('.btn-theme i').classList.add('fa-sun');
    }
}

// Limpar quando sair da página
window.addEventListener('beforeunload', () => {
    if (appState.updateInterval) {
        clearInterval(appState.updateInterval);
    }
});
