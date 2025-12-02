import axios from 'axios';

const api = axios.create({
    baseURL: 'https://conecta-saber-backend.onrender.com/api', // Endereço da sua API Node.js
});

// Interceptor: Antes de cada requisição, insere o Token (se existir)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;