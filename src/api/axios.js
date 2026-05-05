import axios from 'axios';

const API = axios.create({
  // الرابط الجديد بتاعك
  baseURL: 'https://healthcare52.runasp.net/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// لاحظ إننا مسحنا هيدر ngrok-skip-browser-warning لأنه مبقاش ليه لازمة
export default API;