import axios from 'axios';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});


export default api;

