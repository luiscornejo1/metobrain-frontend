import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Reemplaza con tu URL real
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
