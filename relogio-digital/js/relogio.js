// Script mínimo para o relógio digital (evita erros se arquivos originais estiverem ausentes)
(function(){
    function startSimpleClock() {
        var container = document.getElementById('relogios-container');
        if (!container) return;

        var div = document.createElement('div');
        div.className = 'relogio-simples';
        div.style.padding = '20px';
        div.style.background = '#fff';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        div.innerHTML = '<h3>Hora Atual (fuso padrão)</h3><p id="hora-atual" style="font-size:24px;font-weight:700">--:--:--</p>';
        container.appendChild(div);

        function update() {
            var now = new Date();
            var s = now.toLocaleTimeString();
            var el = document.getElementById('hora-atual');
            if (el) el.textContent = s;
        }
        update();
        setInterval(update, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSimpleClock);
    } else {
        startSimpleClock();
    }
})();
