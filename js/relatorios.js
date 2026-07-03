// ==================== EXPORTAR RELATÓRIOS ====================

// Dados de exemplo
let ordensServico = [
    { id: 1, numero: 'OS-001', viatura: 'PM-001', tipo: 'Preventiva', data: '2026-07-01', custo: 250.00, status: 'finalizada', tempoParada: 2 },
    { id: 2, numero: 'OS-002', viatura: 'PM-003', tipo: 'Corretiva', data: '2026-07-02', custo: 1200.00, status: 'em_progresso', tempoParada: 8 },
    { id: 3, numero: 'OS-003', viatura: 'PM-002', tipo: 'Emergencial', data: '2026-07-03', custo: 450.00, status: 'aberta', tempoParada: 0 }
];

let manutencaoPreventiva = [
    { id: 1, viatura: 'PM-001', item: 'Troca de óleo', frequencia: '5.000 km', proximaExecucao: '2026-07-15', status: 'Pendente' },
    { id: 2, viatura: 'PM-002', item: 'Filtro de ar', frequencia: '10.000 km', proximaExecucao: '2026-07-10', status: 'Concluído' }
];

// ==================== EXPORTAR PARA EXCEL ====================
async function gerarExcel() {
    // Carregar biblioteca XLSX se não estiver carregada
    if (!window.XLSX) {
        await carregarBiblioteca('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
    }

    if (!window.XLSX) {
        return alert('Não foi possível carregar a biblioteca XLSX. Gerando CSV alternativo...');
    }

    const wb = window.XLSX.utils.book_new();

    // Aba 1: Ordens de Serviço
    const wsOS = window.XLSX.utils.json_to_sheet(ordensServico.map(os => ({
        'Número': os.numero,
        'Viatura': os.viatura,
        'Tipo': os.tipo,
        'Data': new Date(os.data).toLocaleDateString('pt-BR'),
        'Custo': `R$ ${Number(os.custo).toFixed(2)}`,
        'Status': os.status,
        'Tempo Parada (h)': os.tempoParada
    })));
    window.XLSX.utils.book_append_sheet(wb, wsOS, 'Ordens de Serviço');

    // Aba 2: Manutenção Preventiva
    const wsPreventiva = window.XLSX.utils.json_to_sheet(manutencaoPreventiva.map(m => ({
        'Viatura': m.viatura,
        'Item': m.item,
        'Frequência': m.frequencia,
        'Próxima Execução': new Date(m.proximaExecucao).toLocaleDateString('pt-BR'),
        'Status': m.status
    })));
    window.XLSX.utils.book_append_sheet(wb, wsPreventiva, 'Manutenção Preventiva');

    // Aba 3: Análise de Custos
    const custosPorViatura = {};
    ordensServico.forEach(os => {
        if (!custosPorViatura[os.viatura]) {
            custosPorViatura[os.viatura] = 0;
        }
        custosPorViatura[os.viatura] += os.custo;
    });

    const wsCustos = window.XLSX.utils.json_to_sheet(Object.entries(custosPorViatura).map(([viatura, custo]) => ({
        'Viatura': viatura,
        'Custo Total': `R$ ${Number(custo).toFixed(2)}`
    })));
    window.XLSX.utils.book_append_sheet(wb, wsCustos, 'Análise de Custos');

    // Aba 4: Resumo Executivo
    const totalCusto = ordensServico.reduce((sum, os) => sum + os.custo, 0);
    const totalOS = ordensServico.length;
    const osFinalizadas = ordensServico.filter(os => os.status === 'finalizada').length;

    const wsResumo = window.XLSX.utils.json_to_sheet([
        { 'Métrica': 'Total de Ordens de Serviço', 'Valor': totalOS },
        { 'Métrica': 'Ordens Finalizadas', 'Valor': osFinalizadas },
        { 'Métrica': 'Custo Total de Manutenção', 'Valor': `R$ ${Number(totalCusto).toFixed(2)}` },
        { 'Métrica': 'Custo Médio por OS', 'Valor': `R$ ${Number(totalCusto / totalOS).toFixed(2)}` },
        { 'Métrica': 'Data do Relatório', 'Valor': new Date().toLocaleDateString('pt-BR') }
    ]);
    window.XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo Executivo');

    // Salvar arquivo
    window.XLSX.writeFile(wb, `FrotaPM_Relatorio_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ==================== EXPORTAR PARA PDF ====================
async function gerarPDF() {
    // Carregar bibliotecas se não estiverem carregadas
    if (!window.jspdf || !window.jspdf.jsPDF) {
        await carregarBiblioteca('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');
    }

    if (!window.html2pdf) {
        await carregarBiblioteca('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', 'html2pdf');
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) return alert('Erro ao carregar jsPDF');

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(13, 110, 253);
    doc.text('FrotaPM - Relatório de Manutenção', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Data do relatório
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, currentY);
    currentY += 10;

    // Seção: Resumo Executivo
    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253);
    doc.text('1. Resumo Executivo', 20, currentY);
    currentY += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const totalCusto = ordensServico.reduce((sum, os) => sum + os.custo, 0);
    const totalOS = ordensServico.length;
    const osFinalizadas = ordensServico.filter(os => os.status === 'finalizada').length;

    doc.text(`Total de Ordens de Serviço: ${totalOS}`, 30, currentY);
    currentY += 6;
    doc.text(`Ordens Finalizadas: ${osFinalizadas}`, 30, currentY);
    currentY += 6;
    doc.text(`Custo Total de Manutenção: R$ ${totalCusto.toFixed(2)}`, 30, currentY);
    currentY += 6;
    doc.text(`Custo Médio por OS: R$ ${(totalCusto / totalOS).toFixed(2)}`, 30, currentY);
    currentY += 15;

    // Seção: Ordens de Serviço
    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253);
    doc.text('2. Ordens de Serviço', 20, currentY);
    currentY += 8;

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    ordensServico.forEach((os, idx) => {
        if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
        }
        doc.text(`${idx + 1}. ${os.numero} - ${os.viatura} | Tipo: ${os.tipo} | Custo: R$ ${os.custo.toFixed(2)} | Status: ${os.status}`, 30, currentY);
        currentY += 5;
    });

    currentY += 5;

    // Seção: Manutenção Preventiva
    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253);
    doc.text('3. Plano de Manutenção Preventiva', 20, currentY);
    currentY += 8;

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    manutencaoPreventiva.forEach((m, idx) => {
        if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
        }
        doc.text(`${idx + 1}. ${m.viatura} - ${m.item} (${m.frequencia}) | Próxima: ${new Date(m.proximaExecucao).toLocaleDateString('pt-BR')}`, 30, currentY);
        currentY += 5;
    });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`FrotaPM_Relatorio_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ==================== FUNÇÃO AUXILIAR ====================
function carregarBiblioteca(url, nomeGlobal) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            console.log(`✓ Biblioteca ${nomeGlobal} carregada com sucesso`);
            resolve();
        };
        script.onerror = () => {
            console.error(`✗ Erro ao carregar ${nomeGlobal}`);
            reject(new Error(`Falha ao carregar ${nomeGlobal}`));
        };
        document.head.appendChild(script);
    });
}

// ==================== EXPORTAR CSV (ALTERNATIVA) ====================
function gerarCSV() {
    const headers = ['Número', 'Viatura', 'Tipo', 'Data', 'Custo', 'Status', 'Tempo Parada'];
    const rows = ordensServico.map(os => [
        os.numero,
        os.viatura,
        os.tipo,
        new Date(os.data).toLocaleDateString('pt-BR'),
        `R$ ${os.custo.toFixed(2)}`,
        os.status,
        os.tempoParada
    ]);

    let csvContent = headers.join(';') + '\n';
    rows.forEach(r => {
        csvContent += r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FrotaPM_Relatorio_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==================== ADICIONAR OPÇÕES DE EXPORTAÇÃO NA PÁGINA ====================
function inicializarBotoesRelatorios() {
    const container = document.getElementById('relatorios') || document.querySelector('[id*="relatorio"]');
    if (!container) return;

    const btnContainer = container.querySelector('.mb-3') || container;
    
    // Adicionar botão CSV se não existir
    if (!container.querySelector('[onclick*="gerarCSV"]')) {
        const btnCSV = document.createElement('button');
        btnCSV.className = 'btn btn-info ms-2';
        btnCSV.innerHTML = '<i class="fas fa-file-csv"></i> Exportar CSV';
        btnCSV.onclick = gerarCSV;
        btnContainer.appendChild(btnCSV);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarBotoesRelatorios);
