import axios from 'axios';

// URL de la API según el entorno
const API_URL = '/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Servicios para lentes
export const lensService = {
  // Obtener todos los lentes con filtros opcionales
  getAll: (filters = {}) => {
    return api.get('/lentes', { params: filters });
  },
  
  // Obtener un lente por ID
  getById: (id) => {
    return api.get(`/lentes/${id}`);
  },
  
  // Crear un nuevo lente
  create: (lensData) => {
    return api.post('/lentes', lensData);
  },
  
  // Actualizar un lente
  update: (id, lensData) => {
    return api.put(`/lentes/${id}`, lensData);
  },
  
  // Eliminar un lente
  delete: (id) => {
    return api.delete(`/lentes/${id}`);
  },
  
  // Registrar venta de un lente
  sell: (id) => {
    return api.put(`/lentes/${id}/sell`);
  },
  
  // Generar reporte PDF por número de lote
  generateReport: (numeroLote) => {
    return api.get(`/lentes/report/${numeroLote}`, { responseType: 'blob' });
  }
};

// Servicios para marcas
export const brandService = {
  // Obtener todas las marcas
  getAll: () => {
    return api.get('/marcas');
  },
  
  // Obtener una marca por ID
  getById: (id) => {
    return api.get(`/marcas/${id}`);
  },
  
  // Crear una nueva marca
  create: (brandData) => {
    return api.post('/marcas', brandData);
  },
  
  // Actualizar una marca
  update: (id, brandData) => {
    return api.put(`/marcas/${id}`, brandData);
  },
  
  // Eliminar una marca
  delete: (id) => {
    return api.delete(`/marcas/${id}`);
  }
};

export default api;