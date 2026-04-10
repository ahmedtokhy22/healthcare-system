import axios from 'axios';

const api = axios.create({
  // الرابط الجديد الخاص بك من الصور
  baseURL: 'https://unalterably-unasphalted-felton.ngrok-free.dev',
});

// إضافة التوكن تلقائياً لكل الطلبات
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;