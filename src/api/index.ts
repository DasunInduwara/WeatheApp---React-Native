import axios from 'axios';
import { API_KEY, BASE_URL } from '@env';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      key: API_KEY,
    };
  }
  return config;
});

export { api };
