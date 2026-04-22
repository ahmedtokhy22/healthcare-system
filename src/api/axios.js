import axios from 'axios';

// 1. إعداد القاعدة الأساسية للـ API
const API = axios.create({
  // الرابط الذي زودتني به
  baseURL: 'https://unalterably-unasphalted-felton.ngrok-free.dev/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // مهم جداً لـ ngrok لتجنب صفحة التحذير التي تمنع وصول البيانات
    'ngrok-skip-browser-warning': 'true',
  },
});

// 2. "Interceptor" لإرسال التوكن تلقائياً مع كل طلب (لو متاح)
// هذا السطر يغنيك عن كتابة الـ Header في كل صفحة يدوياً
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. تعريف الدوال (Endpoints) لكل موديول في المشروع

// --- المصادقة (Authentication) ---

export const login = (credentials) => API.post('/Auth/login', credentials);
export const register = (userData) => API.post('/Auth/register', userData);
export const logout = () => API.post('/Auth/logout');

// --- جدول الطبيب (Doctor Schedule) ---
export const getDoctorSchedule = () => API.get('/doctor/schedule');
export const addScheduleSlot = (slotData) => API.post('/doctor/schedule', slotData);
export const deleteScheduleSlot = (id) => API.delete(`/doctor/schedule/${id}`);

// --- إدارة المعمل (Lab Management) ---
export const getLabAppointments = () => API.get('/lab/appointments');
// دالة الرفع تحتاج FormData لأنها تحتوي على ملفات
export const uploadLabResults = (formData) => API.post('/lab/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// --- التمريض (Nurse) ---
export const getNurseAppointments = () => API.get('/nurse/appointments');
export const updateAppointmentStatus = (id, status) => API.put(`/appointments/${id}`, { status });

// --- المرضى (Patients) ---
export const getPatientProfile = (id) => API.get(`/patients/${id}`);
export const updateProfile = (data) => API.post('/profile/update', data);

// --- الإدارة (Admin) ---
export const getAllUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;