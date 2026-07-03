const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Supabase using service role key for server-side operations
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Warning: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY should be set in .env for full functionality');
}
const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Frota PM Backend is running' });
});

// Simple CRUD for Ordens de Serviço (os)
app.get('/api/os', async (req, res) => {
  try {
    const { data, error } = await supabase.from('ordens_servico').select('*').order('data_abertura', { ascending: false }).limit(100);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/os', async (req, res) => {
  try {
    const payload = req.body;
    payload.data_abertura = payload.data_abertura || new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('ordens_servico').insert([payload]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/os/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.atualizado_em = new Date().toISOString();
    const { data, error } = await supabase.from('ordens_servico').update(updates).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/os/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('ordens_servico').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ deleted: data.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Basic routes for viaturas
app.get('/api/viaturas', async (req, res) => {
  try {
    const { data, error } = await supabase.from('viaturas').select('*').order('placa');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/viaturas', async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from('viaturas').insert([payload]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Simple audit: write to historico_alteracoes table
async function registrarHistorico(usuario_id, tabela, registro_id, acao, detalhe) {
  try {
    await supabase.from('historico_alteracoes').insert([{ usuario_id, tabela, registro_id, acao, detalhe }]);
  } catch (e) {
    console.warn('Falha ao registrar histórico', e.message);
  }
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
