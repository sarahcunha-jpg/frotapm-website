# Rastreamento em Tempo Real (Frota PM)

Este diretório contém uma implementação mínima de backend (Node.js + Express + Socket.io) e um frontend de exemplo (Google Maps) para rastreamento em tempo real das viaturas.

Arquivos adicionados:
- server.js — servidor Express + Socket.io que recebe POST /api/rastreio e broadcasta eventos aos clientes.
- rastreamento.html — exemplo de cliente (Google Maps JS + Socket.io) que mostra marcadores e histórico (polyline).
- .env.example — variáveis de ambiente necessárias.
- create_rastreamento.sql — script para criar a tabela de rastreamento.
- package.json — dependências e scripts para executar o servidor.

Instruções rápidas

1. Instalar dependências

```bash
cd rastreio
npm install
```

2. Criar tabela no MySQL (ver create_rastreamento.sql)

3. Copiar .env.example para .env e ajustar valores (DB, GOOGLE_MAPS_API_KEY, DEVICE_TOKEN)

4. Executar servidor

```bash
NODE_ENV=development npm start
```

5. Abrir rastreamento.html (substitua YOUR_GOOGLE_MAPS_API_KEY) e ajustar SOCKET_URL para apontar ao seu servidor.

Testando envio de posição (curl)

```bash
curl -X POST https://SEU_BACKEND/api/rastreio \
  -H "Content-Type: application/json" \
  -H "x-device-token: troque_por_token_seguro" \
  -d '{"viatura_id":"uuid-viatura-1","latitude":-26.9183,"longitude":-49.0650,"velocidade":40.5}'
```

Próximos passos recomendados
- Adicionar Redis adapter para socket.io em produção.
- Implementar autenticação por token para dispositivos e usuários.
- Ajustar política de retenção/aggregação de pontos GPS.
- Integrar com as telas existentes do projeto (ficha da viatura, OS, dashboard).
