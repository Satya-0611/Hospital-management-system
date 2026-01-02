import axios from 'axios';

// 1. Create the Axios instance
const api = axios.create({
  baseURL: 'https://hospital-management-system-nnaw.onrender.com', // Points to your Node backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (The "Stamp Paster")
// Before sending ANY request, this function runs.
api.interceptors.request.use(
  (config) => {
    // Check if a token exists in local storage
    const token = localStorage.getItem('token');
    
    // If it exists, attach it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;