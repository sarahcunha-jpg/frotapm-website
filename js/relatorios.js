// Funções para exportar relatórios: CSV (Excel) e PDF (jsPDF)
function gerarExcel() {
    // Compõe CSV simples com ordens de serviço
    if (typeof ordensServico === 'undefined') return alert('Dados de Ordens de Serviço não disponíveis');

    const headers = ['Número','Viatura','Data','Problema','Responsável','Peças','Custo','Status','Tempo Parada'];
    const rows = ordensServico.map(os => [os.numero, os.viatura, os.data, os.problema, os.responsavel, os.pecas, os.custo, os.status, os.tempoParada]);

    let csvContent = headers.join(';') + '\n';
    rows.forEach(r => {
        csvContent += r.map(cell => '"' + String(cell).replace(/"/g,'""') + '"').join(';') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_os.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function gerarPDF() {
    if (typeof window.jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
        // tenta usar o namespace UMD
        if (typeof window.jspdf === 'undefined' && typeof window.jspdf === 'object' && window.jspdf.jsPDF) {
            window.jspdf = window.jspdf;
        }
    }

    let jsPDFConstructor = null;
    if (window.jspdf && window.jspdf.jsPDF) jsPDFConstructor = window.jspdf.jsPDF;
    else if (window.jsPDF) jsPDFConstructor = window.jsPDF;

    if (!jsPDFConstructor) {
        // Tenta carregar dinamicamente a lib (CDN)
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
        }).catch(() => { alert('Não foi possível carregar jsPDF para gerar o PDF.'); });

        if (window.jspdf && window.jspdf.jsPDF) jsPDFConstructor = window.jspdf.jsPDF;
    }

    if (!jsPDFConstructor) return;

    const doc = new jsPDFConstructor();
    doc.setFontSize(16);
    doc.text('Relatório - Ordens de Serviço', 14, 20);
    doc.setFontSize(11);

    let y = 30;
    if (Array.isArray(ordensServico) && ordensServico.length > 0) {
        ordensServico.forEach((os, idx) => {
            const line = `${os.numero} | ${os.viatura} | ${os.data} | R$ ${Number(os.custo).toFixed(2)} | ${os.status}`;
            doc.text(line, 14, y);
            y += 7;
            if (y > 270) { doc.addPage(); y = 20; }
        });
    } else {
        doc.text('Nenhuma Ordem de Serviço encontrada.', 14, y);
    }

    doc.save('relatorio_os.pdf');
}
