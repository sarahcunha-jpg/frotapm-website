// ============================================
// FASE 4: EXPORTAÇÃO PDF E EXCEL
// ============================================

// Carregamento de bibliotecas via CDN
function carregarBibliotecas() {
  if (!window.html2pdf) {
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    document.head.appendChild(script1);
  }
  
  if (!window.XLSX) {
    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
    document.head.appendChild(script2);
  }
}

carregarBibliotecas();

// Montar dados do relatório
function obterDadosRelatorio() {
  const tipoRelatorio = document.getElementById('tipoRelatorio')?.value || 'completo';
  const dataInicio = document.getElementById('dataInicio')?.value;
  const dataFim = document.getElementById('dataFim')?.value;
  
  let dados = {
    titulo: '',
    tabelas: []
  };
  
  const ordensServico = JSON.parse(localStorage.getItem('ordensServico')) || [];
  const manutencoes = JSON.parse(localStorage.getItem('manutencaoPreventiva')) || [];
  const viaturas = JSON.parse(localStorage.getItem('viaturas')) || [];
  
  const osFiltradasPorData = ordensServico.filter(os => {
    if (!dataInicio && !dataFim) return true;
    const dataOS = new Date(os.data);
    if (dataInicio && dataOS < new Date(dataInicio)) return false;
    if (dataFim && dataOS > new Date(dataFim)) return false;
    return true;
  });
  
  switch(tipoRelatorio) {
    case 'os':
      dados.titulo = 'Relatório de Ordens de Serviço';
      dados.tabelas.push({
        titulo: 'Ordens de Serviço',
        colunas: ['ID', 'Viatura', 'Tipo', 'Data', 'Custo', 'Status', 'Tempo Parada'],
        dados: osFiltradasPorData.map((os, idx) => [
          idx + 1,
          os.viatura,
          os.tipo,
          new Date(os.data).toLocaleDateString('pt-BR'),
          `R$ ${parseFloat(os.custo).toFixed(2)}`,
          os.status,
          `${os.tempoParada} dias`
        ])
      });
      break;
      
    case 'preventiva':
      dados.titulo = 'Relatório de Manutenção Preventiva';
      dados.tabelas.push({
        titulo: 'Manutenção Preventiva',
        colunas: ['ID', 'Viatura', 'Tipo', 'Frequência (km)', 'Próxima Execução', 'Status'],
        dados: manutencoes.map((m, idx) => [
          idx + 1,
          m.viatura,
          m.tipo,
          m.frequencia,
          new Date(m.proximaExecucao).toLocaleDateString('pt-BR'),
          m.status
        ])
      });
      break;
      
    case 'custos':
      dados.titulo = 'Análise de Custos de Manutenção';
      
      const custosPorViatura = {};
      osFiltradasPorData.forEach(os => {
        custosPorViatura[os.viatura] = (custosPorViatura[os.viatura] || 0) + parseFloat(os.custo);
      });
      
      dados.tabelas.push({
        titulo: 'Custos por Viatura',
        colunas: ['Viatura', 'Total Gasto (R$)', 'Número de OS'],
        dados: Object.entries(custosPorViatura).map(([viatura, custo]) => [
          viatura,
          `R$ ${parseFloat(custo).toFixed(2)}`,
          osFiltradasPorData.filter(os => os.viatura === viatura).length
        ])
      });
      
      const custosPorTipo = {};
      osFiltradasPorData.forEach(os => {
        custosPorTipo[os.tipo] = (custosPorTipo[os.tipo] || 0) + parseFloat(os.custo);
      });
      
      dados.tabelas.push({
        titulo: 'Custos por Tipo de Manutenção',
        colunas: ['Tipo', 'Total Gasto (R$)'],
        dados: Object.entries(custosPorTipo).map(([tipo, custo]) => [
          tipo,
          `R$ ${parseFloat(custo).toFixed(2)}`
        ])
      });
      break;
      
    case 'completo':
    default:
      dados.titulo = 'Relatório Completo - Gestão de Frota';
      
      const totalOS = osFiltradasPorData.length;
      const custoTotal = osFiltradasPorData.reduce((sum, os) => sum + parseFloat(os.custo), 0);
      
      dados.indicadores = {
        'Total de Viaturas': viaturas.length,
        'Total de OS': totalOS,
        'Custo Total (R$)': custoTotal.toFixed(2),
        'Custo Médio por Viatura (R$)': (totalOS > 0 ? (custoTotal / viaturas.length).toFixed(2) : '0,00')
      };
      
      dados.tabelas.push({
        titulo: 'Ordens de Serviço',
        colunas: ['Viatura', 'Tipo', 'Data', 'Custo', 'Status'],
        dados: osFiltradasPorData.slice(0, 10).map(os => [
          os.viatura,
          os.tipo,
          new Date(os.data).toLocaleDateString('pt-BR'),
          `R$ ${parseFloat(os.custo).toFixed(2)}`,
          os.status
        ])
      });
      break;
  }
  
  return dados;
}

// Gerar PDF
function gerarPDF() {
  const dados = obterDadosRelatorio();
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h1 { margin: 0; color: #333; }
        .data { text-align: right; font-size: 12px; color: #666; }
        .indicadores { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .indicador { background: #f5f5f5; padding: 10px; border-left: 4px solid #007bff; }
        .indicador-label { font-weight: bold; font-size: 12px; color: #666; }
        .indicador-valor { font-size: 18px; color: #333; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #007bff; color: white; padding: 10px; text-align: left; font-weight: bold; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .section-title { background: #34495e; color: white; padding: 10px; margin-top: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${dados.titulo}</h1>
        <div class="data">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
      </div>
  `;
  
  if (dados.indicadores) {
    html += '<div class="indicadores">';
    Object.entries(dados.indicadores).forEach(([label, valor]) => {
      html += `
        <div class="indicador">
          <div class="indicador-label">${label}</div>
          <div class="indicador-valor">${valor}</div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  dados.tabelas.forEach(tabela => {
    html += `<div class="section-title">${tabela.titulo}</div>`;
    html += '<table>';
    html += '<thead><tr>';
    tabela.colunas.forEach(col => {
      html += `<th>${col}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    tabela.dados.forEach(linha => {
      html += '<tr>';
      linha.forEach(celula => {
        html += `<td>${celula}</td>`;
      });
      html += '</tr>';
    });
    
    html += '</tbody></table>';
  });
  
  html += '</body></html>';
  
  const element = document.createElement('div');
  element.innerHTML = html;
  
  const opt = {
    margin: 10,
    filename: `relatorio-frota-${new Date().getTime()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  
  if (typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(element).save();
  } else {
    alert('Biblioteca html2pdf não carregada. Aguarde alguns segundos e tente novamente.');
  }
}

// Gerar Excel
function gerarExcel() {
  const dados = obterDadosRelatorio();
  
  if (typeof XLSX === 'undefined') {
    alert('Biblioteca XLSX não carregada. Aguarde alguns segundos e tente novamente.');
    return;
  }
  
  const wb = XLSX.utils.book_new();
  
  dados.tabelas.forEach((tabela, idx) => {
    const dados_planilha = [
      tabela.colunas,
      ...tabela.dados
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(dados_planilha);
    const tamanhoColuna = tabela.colunas.map(col => ({ wch: Math.max(12, col.length) }));
    ws['!cols'] = tamanhoColuna;
    
    XLSX.utils.book_append_sheet(wb, ws, tabela.titulo.substring(0, 31));
  });
  
  const nomeArquivo = `relatorio-frota-${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Módulo de Relatórios carregado');
});