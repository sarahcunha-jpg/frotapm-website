// ==================== FIREBASE CONFIG ====================
// Inicializar Firebase - Cole suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxxx",
    appId: "1:xxxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};

// Inicializar Firebase (substitua pela sua config real)
let db = null;
let auth = null;

// Função para inicializar Firebase
function inicializarFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        
        // Listener de autenticação
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log("✓ Usuário autenticado:", user.email);
                carregarDadosDoFirebase();
            } else {
                console.log("✗ Usuário não autenticado");
            }
        });
    } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
    }
}

// ==================== DADOS GLOBAIS ====================
let viaturas = [];
let ordensServico = [];
let manutencaoPreventiva = [];
let historicoManutencao = [];

// ==================== FUNÇÃO PARA CARREGAR DADOS ====================
async function carregarDadosDoFirebase() {
    if (!db) return;

    try {
        // Carregar Viaturas
        db.collection("viaturas").onSnapshot(snapshot => {
            viaturas = [];
            snapshot.forEach(doc => {
                viaturas.push({ id: doc.id, ...doc.data() });
            });
            console.log("✓ Viaturas carregadas:", viaturas.length);
            if (typeof carregarViaturas === 'function') carregarViaturas();
        });

        // Carregar Ordens de Serviço
        db.collection("ordensServico").onSnapshot(snapshot => {
            ordensServico = [];
            snapshot.forEach(doc => {
                ordensServico.push({ id: doc.id, ...doc.data() });
            });
            console.log("✓ Ordens de Serviço carregadas:", ordensServico.length);
            if (typeof carregarOrdenServico === 'function') carregarOrdenServico();
        });

        // Carregar Manutenção Preventiva
        db.collection("manutencaoPreventiva").onSnapshot(snapshot => {
            manutencaoPreventiva = [];
            snapshot.forEach(doc => {
                manutencaoPreventiva.push({ id: doc.id, ...doc.data() });
            });
            console.log("✓ Manutenção Preventiva carregada:", manutencaoPreventiva.length);
            if (typeof carregarManutencaoPreventiva === 'function') carregarManutencaoPreventiva();
        });

        // Carregar Histórico
        db.collection("historicoManutencao").onSnapshot(snapshot => {
            historicoManutencao = [];
            snapshot.forEach(doc => {
                historicoManutencao.push({ id: doc.id, ...doc.data() });
            });
            console.log("✓ Histórico carregado:", historicoManutencao.length);
            if (typeof carregarHistoricoManutencao === 'function') carregarHistoricoManutencao();
        });
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

// ==================== SALVAR/ATUALIZAR/DELETAR NO FIREBASE ====================

// Salvar Nova Viatura
async function salvarViaturaFirebase(viatura) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        const docRef = await db.collection("viaturas").add({
            placa: viatura.placa.toUpperCase(),
            modelo: viatura.modelo,
            ano: parseInt(viatura.ano),
            quilometragem: parseInt(viatura.quilometragem) || 0,
            unidade: viatura.unidade,
            status: viatura.status || 'operacao',
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString()
        });
        console.log("✓ Viatura salva com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("✗ Erro ao salvar viatura:", error);
        alert("Erro ao salvar viatura: " + error.message);
    }
}

// Atualizar Viatura
async function atualizarViaturaFirebase(viaturaId, dados) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        await db.collection("viaturas").doc(viaturaId).update({
            ...dados,
            atualizadoEm: new Date().toISOString()
        });
        console.log("✓ Viatura atualizada:", viaturaId);
        return true;
    } catch (error) {
        console.error("✗ Erro ao atualizar viatura:", error);
        alert("Erro ao atualizar viatura: " + error.message);
    }
}

// Deletar Viatura
async function deletarViaturaFirebase(viaturaId) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        await db.collection("viaturas").doc(viaturaId).delete();
        console.log("✓ Viatura deletada:", viaturaId);
        return true;
    } catch (error) {
        console.error("✗ Erro ao deletar viatura:", error);
        alert("Erro ao deletar viatura: " + error.message);
    }
}

// Salvar Nova Ordem de Serviço
async function salvarOSFirebase(os) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        const docRef = await db.collection("ordensServico").add({
            numero: `OS-${Date.now()}`,
            viatura: os.viatura,
            tipo: os.tipo,
            data: os.data,
            custo: parseFloat(os.custo) || 0,
            status: os.status || 'aberta',
            tempoParada: parseInt(os.tempoParada) || 0,
            descricao: os.descricao || '',
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString()
        });
        console.log("✓ Ordem de Serviço salva com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("✗ Erro ao salvar OS:", error);
        alert("Erro ao salvar OS: " + error.message);
    }
}

// Atualizar Ordem de Serviço
async function atualizarOSFirebase(osId, dados) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        await db.collection("ordensServico").doc(osId).update({
            ...dados,
            atualizadoEm: new Date().toISOString()
        });
        console.log("✓ Ordem de Serviço atualizada:", osId);
        return true;
    } catch (error) {
        console.error("✗ Erro ao atualizar OS:", error);
        alert("Erro ao atualizar OS: " + error.message);
    }
}

// Deletar Ordem de Serviço
async function deletarOSFirebase(osId) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        await db.collection("ordensServico").doc(osId).delete();
        console.log("✓ Ordem de Serviço deletada:", osId);
        return true;
    } catch (error) {
        console.error("✗ Erro ao deletar OS:", error);
        alert("Erro ao deletar OS: " + error.message);
    }
}

// Salvar Manutenção Preventiva
async function salvarManutencaoFirebase(manutencao) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        const docRef = await db.collection("manutencaoPreventiva").add({
            viatura: manutencao.viatura,
            item: manutencao.item,
            frequencia: manutencao.frequencia,
            proximaExecucao: manutencao.proximaExecucao,
            status: manutencao.status || 'Pendente',
            ultimaExecucao: manutencao.ultimaExecucao || new Date().toISOString().split('T')[0],
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString()
        });
        console.log("✓ Manutenção salva com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("✗ Erro ao salvar manutenção:", error);
        alert("Erro ao salvar manutenção: " + error.message);
    }
}

// Atualizar Manutenção
async function atualizarManutencaoFirebase(manutencaoId, dados) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        await db.collection("manutencaoPreventiva").doc(manutencaoId).update({
            ...dados,
            atualizadoEm: new Date().toISOString()
        });
        console.log("✓ Manutenção atualizada:", manutencaoId);
        return true;
    } catch (error) {
        console.error("✗ Erro ao atualizar manutenção:", error);
        alert("Erro ao atualizar manutenção: " + error.message);
    }
}

// Deletar Manutenção
async function deletarManutencaoFirebase(manutencaoId) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        await db.collection("manutencaoPreventiva").doc(manutencaoId).delete();
        console.log("✓ Manutenção deletada:", manutencaoId);
        return true;
    } catch (error) {
        console.error("✗ Erro ao deletar manutenção:", error);
        alert("Erro ao deletar manutenção: " + error.message);
    }
}

// Adicionar ao Histórico
async function adicionarHistoricoFirebase(historico) {
    if (!db) return alert('Banco de dados não inicializado');

    try {
        const docRef = await db.collection("historicoManutencao").add({
            viatura: historico.viatura,
            servico: historico.servico,
            data: historico.data || new Date().toISOString().split('T')[0],
            custo: parseFloat(historico.custo) || 0,
            pecas: historico.pecas || '',
            tempoParada: parseInt(historico.tempoParada) || 0,
            criadoEm: new Date().toISOString()
        });
        console.log("✓ Histórico adicionado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("✗ Erro ao adicionar histórico:", error);
    }
}

// ==================== FUNÇÕES DE BUSCA ====================
function buscarViaturasFirebase(termo) {
    if (!termo) return viaturas;
    
    const termo_lower = termo.toLowerCase();
    return viaturas.filter(v => 
        v.placa.toLowerCase().includes(termo_lower) ||
        v.modelo.toLowerCase().includes(termo_lower) ||
        v.unidade.toLowerCase().includes(termo_lower)
    );
}

// ==================== SINCRONIZAÇÃO EM TEMPO REAL ====================
function escutarMudanças() {
    if (!db) return;

    // Escutar mudanças nas viaturas
    db.collection("viaturas").onSnapshot(snapshot => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("📌 Nova viatura adicionada:", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("✏️ Viatura modificada:", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("🗑️ Viatura removida:", change.doc.id);
            }
        });
    });

    // Similar para outros tipos de dados
    db.collection("ordensServico").onSnapshot(snapshot => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "modified" || change.type === "added") {
                console.log("🔄 Ordem de Serviço atualizada - recarregando...");
                // Recarrega automaticamente na função carregarOrdenServico
            }
        });
    });
}

// ==================== INICIALIZAR TUDO ====================
document.addEventListener('DOMContentLoaded', function() {
    inicializarFirebase();
    escutarMudanças();
});
