import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import AuthPage from './components/AuthPage';
import MedicalStaffRegister from './components/MedicalStaffRegister';
import UserManagement from './components/UserManagement';


const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-10 text-center" dir="rtl">
    <h1 className="text-4xl font-black text-blue-600 mb-8">نظام الرعاية الصحية 🏥</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
      <Link to="/" className="p-4 bg-white shadow-lg rounded-2xl font-bold hover:bg-blue-100 transition">تسجيل الدخول</Link>
      <Link to="/register-staff" className="p-4 bg-white shadow-lg rounded-2xl font-bold hover:bg-blue-100 transition">تسجيل كادر طبي</Link>
      <Link to="/users" className="p-4 bg-white shadow-lg rounded-2xl font-bold hover:bg-blue-100 transition">إدارة المستخدمين</Link>
    </div>
  </div>
);

function App() {
  const dummyUsers = { items: [{ id: 1, name: "هيثم", email: "test@test.com", role: "Admin" }] };

  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية الجديدة للاختبار */}
        <Route path="/home" element={<Home />} />
        
        {/* المسارات الأصلية */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/register-staff" element={<MedicalStaffRegister />} />
        <Route path="/users" element={<UserManagement data={dummyUsers} />} />
        
        {/* مسار احتياطي لو الرابط غلط */}
        <Route path="*" element={<div className="p-20 text-center">الصفحة غير موجودة - جرب /home</div>} />
      </Routes>
    </Router>
  );
}

export default App;