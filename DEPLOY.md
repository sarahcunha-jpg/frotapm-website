# 🚀 Guia de Deploy - FrotaPM

Este guia ajudará você a fazer deploy do FrotaPM em servidores gratuitos (Heroku + Vercel).

---

## ⚡ Op ção 1: Deploy Rápido (Recomendado)

### Pré-requisitos
- GitHub Account
- Heroku Account (gratuito em [heroku.com](https://heroku.com))
- Vercel Account (gratuito em [vercel.com](https://vercel.com))
- Supabase Account (gratuito em [supabase.com](https://supabase.com))

---

## 1️⃣ Configurar Supabase

### Passo 1: Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados e crie

### Passo 2: Executar Schema
1. Na dashboard, vá em **SQL Editor**
2. Crie uma nova query
3. Copie todo o conteúdo de `database/schema.sql`
4. Cole e execute (Run)

### Passo 3: Copiar Credenciais
1. Vá em **Settings** > **API**
2. Copie:
   - `Project URL` → será `SUPABASE_URL`
   - `service_role` (secret) → será `SUPABASE_SERVICE_ROLE_KEY`

**Guarde essas credenciais**, você vai precisar em breve!

---

## 2️⃣ Deploy Backend no Heroku

### Passo 1: Criar App no Heroku
1. Acesse [heroku.com](https://heroku.com)
2. Faça login ou crie conta
3. Clique em "New" > "Create new app"
4. Nome: `frotapm-backend-seu-nome` (ex: `frotapm-backend-sarah`)
5. Clique "Create"

### Passo 2: Conectar ao GitHub
1. Na dashboard do app, vá em **Deploy**
2. Selecione "GitHub" como deployment method
3. Busque `frotapm-website`
4. Clique "Connect"

### Passo 3: Configurar Variáveis de Ambiente
1. Vá em **Settings**
2. Clique em "Reveal Config Vars"
3. Adicione:
   - **Key:** `SUPABASE_URL` | **Value:** `https://seu-projeto.supabase.co`
   - **Key:** `SUPABASE_SERVICE_ROLE_KEY` | **Value:** (cole a chave)

### Passo 4: Deploy
1. Volte para **Deploy**
2. Em "Manual deploy", selecione a branch `complete-implementation`
3. Clique "Deploy Branch"
4. Aguarde (2-3 minutos)
5. Clique "View" quando terminar

**Sua URL será algo como:** `https://frotapm-backend-sarah.herokuapp.com`

✅ **Teste:** Acesse `https://seu-app.herokuapp.com/health`

---

## 3️⃣ Deploy Frontend no Vercel

### Passo 1: Conectar GitHub ao Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique "Sign up" ou faça login com GitHub
3. Clique "Import Project"
4. Selecione `frotapm-website`

### Passo 2: Configurar Build
1. **Root Directory:** `frontend`
2. Clique "Deploy"
3. Aguarde (1-2 minutos)

**Sua URL será:** `https://frotapm-website.vercel.app`

### Passo 3: Atualizar Config do Frontend
1. No seu computador, abra `frontend/js/config.js`
2. Altere:
```javascript
const API_URL = 'https://seu-app-heroku.herokuapp.com/api';
```

3. Faça commit e push:
```bash
git add frontend/js/config.js
git commit -m "chore: update API URL for production"
git push origin complete-implementation
```

4. Vercel vai fazer redeploy automaticamente

---

## ✅ Verificar se Tudo Funciona

### Backend
```bash
curl https://seu-app-heroku.herokuapp.com/health
# Resposta: {"status":"OK","message":"Frota PM Backend is running"}
```

### Frontend
1. Abra `https://frotapm-website.vercel.app`
2. Você deve ver o Dashboard
3. Tente criar uma viatura
4. Tente criar uma OS

---

## 🔗 URLs Finais

```
Frontend:  https://frotapm-website.vercel.app
Backend:   https://seu-app-heroku.herokuapp.com
Supabase:  https://seu-projeto.supabase.co
```

---

## ⚠️ Troubleshooting

### Erro: "Cannot GET /api/viaturas"
- Verifique se o backend está rodando em Heroku
- Verifique se as variáveis de ambiente estão preenchidas
- Verifique se o `frontend/js/config.js` tem a URL correta

### Erro: "Supabase connection failed"
- Verifique se o schema foi executado
- Verifique as credenciais de Supabase
- Teste diretamente em `https://app.supabase.com`

### Frontend não atualiza
- Aguarde 1-2 minutos para o Vercel fazer rebuild
- Abra em incognito ou limpe cache (`Ctrl+Shift+Del`)

### Heroku não faz deploy
- Verifique se o `Procfile` existe em `backend/Procfile`
- Verifique se o `package.json` está correto

---

## 💡 Próximas Melhorias

- [ ] Adicionar SSL/TLS (automático em ambos)
- [ ] Configurar domínio customizado
- [ ] Adicionar CI/CD com GitHub Actions
- [ ] Monitoramento e alertas
- [ ] Backups automáticos

---

## 📞 Suporte

Se algo não funcionar:
1. Verifique este guia novamente
2. Verifique os logs (Heroku/Vercel dashboard)
3. Abra uma issue no GitHub

**Sucesso no deploy! 🚀**
