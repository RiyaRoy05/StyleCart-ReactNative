import axios from 'axios';
const api = axios.create({
  baseURL: 'http://144.202.25.149/skeleton/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
