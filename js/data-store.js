// data-store.js — abstração para operações com Supabase (ordens de serviço)
// Depende de js/supabase-client.js which sets window.supabaseClient
const DataStore = (function(){
  const client = window.supabaseClient;

  async function getOS() {
    if (!client) return [];
    const { data, error } = await client.from('ordens_servico').select('*').order('data_abertura', { ascending: false }).limit(100);
    if (error) throw error;
    return data;
  }

  async function createOS(os) {
    if (!client) return null;
    const { data, error } = await client.from('ordens_servico').insert([os]).select();
    if (error) throw error;
    return data[0];
  }

  async function updateOS(id, updates) {
    if (!client) return null;
    const { data, error } = await client.from('ordens_servico').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  }

  async function deleteOS(id) {
    if (!client) return null;
    const { data, error } = await client.from('ordens_servico').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }

  function onOSChange(callback) {
    if (!client) return () => {};
    const subscription = client
      .from('ordens_servico')
      .on('*', payload => {
        callback(payload);
      })
      .subscribe();
    return () => { if (subscription) client.removeSubscription(subscription); };
  }

  return { getOS, createOS, updateOS, deleteOS, onOSChange };
})();
