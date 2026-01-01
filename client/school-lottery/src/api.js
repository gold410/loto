import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:1234/api',
});

export default API;
