import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Ensure the URL always begins with http:// or https://
if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
  baseURL = `https://${baseURL}`;
}

const API = axios.create({
  baseURL,
});

export default API;