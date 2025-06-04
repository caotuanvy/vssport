// src/axios.js
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true; // để gửi cookie đến Laravel

export default axios;
