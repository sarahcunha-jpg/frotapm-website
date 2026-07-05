// API Service
class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: { 'Content-Type': 'application/json' },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Viaturas
  getViaturas(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/viaturas?${params}`);
  }

  getViatura(id) {
    return this.request(`/viaturas/${id}`);
  }

  createViatura(data) {
    return this.request('/viaturas', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateViatura(id, data) {
    return this.request(`/viaturas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteViatura(id) {
    return this.request(`/viaturas/${id}`, { method: 'DELETE' });
  }

  // Ordens de Serviço
  getOS(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/os?${params}`);
  }

  getOSById(id) {
    return this.request(`/os/${id}`);
  }

  createOS(data) {
    return this.request('/os', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateOS(id, data) {
    return this.request(`/os/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteOS(id) {
    return this.request(`/os/${id}`, { method: 'DELETE' });
  }
}

const api = new API(CONFIG.apiUrl);