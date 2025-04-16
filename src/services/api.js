import axios from 'axios';

const api = axios.create({
  baseURL: 'https://luxe-api-production-d5c9.up.railway.app',
});

export default api;
