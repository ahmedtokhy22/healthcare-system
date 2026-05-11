import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. استيراد المكونات الثابتة ---
import Navbar from './components/Navbar'; 

// --- 2. تعريف الصفحات باستخدام Lazy Loading لسرعة التحميل ---
const AuthPage = lazy(() => import('./components/AuthPage'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const OTPPage = lazy(() => import('./components/OTPPage'));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage'));
const RegistrationPage1 = lazy(() => import('./components/RegistrationPage1'));
const RegistrationPage2 = lazy(() => import('./components/RegistrationPage2'));
const PendingRequests = lazy(() => import('./components/PendingRequests'));

// مكونات المسؤول (Admin)
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AdminUsers = lazy(() => import('./components/AdminUsers'));
const PostManagement = lazy(() => import('./components/PostManagement')); 
const TestManagement = lazy(() => import('./components/TestManagement')); 
const SpecialtyManagement = lazy(() => import('./components/SpecialtyManagement')); 

// مكونات الطبيب (Doctor)
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const DoctorManageAppointments = lazy(() => import('./components/AppointmentManagement'));
const AppointmentDetails = lazy(() => import('./components/AppointmentDetails'));
const DoctorProfile = lazy(() => import('./components/DoctorProfile'));
const DoctorPosts = lazy(() => import('./components/DoctorPosts'));
const PatientProfile = lazy(() => import('./components/PatientProfile'));
const DoctorChat = lazy(() => import('./components/DoctorChat'));

// مكونات التمريض (Nurse)
const NurseDashboard = lazy(() => import('./components/NurseDashboard'));
const NurseManageAppointments = lazy(() => import('./components/NurseManageAppointments'));
const NurseProfile = lazy(() => import('./components/NurseProfile'));
const NurseAppointmentDetails = lazy(() => import('./components/NurseAppointmentDetails'));

// مكونات المختبر (Lab)
const LabDashboard = lazy(() => import('./components/LabDashboard'));
const LabAppointments = lazy(() => import('./components/LabAppointments'));
const LabTestManagement = lazy(() => import('./components/LabTestManagement'));
const LabProfile = lazy(() => import('./components/LabProfile'));
const LabDetails = lazy(() => import('./components/LabDetails'));

// --- 3. حماية المسارات (Guards) ---

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // التأكد من أن الرتبة مطابقة (Admin, Lab, etc.)
  if (allowedRole && userRole?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to={`/${userRole?.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};

// هيكل الصفحة الرئيسي الذي يعرض الـ Navbar والمحتوى
const DashboardLayout = ({ children, role }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentRole = role || localStorage.getItem('role') || 'Guest';
  
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar role={currentRole} showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

// --- 4. المكون الأساسي (App Component) ---

export default function App() {
  return (
    <Router>
      {/* شاشة التحميل (Spinner) أثناء تحميل الصفحات */}
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-[#f8fafc]">
          <div className="relative flex items-center justify-center">
             <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
             <div className="absolute w-8 h-8 bg-blue-600 rounded-lg animate-pulse"></div>
          </div>
          <div className="mt-6 text-blue-600 font-black tracking-[0.2em] uppercase text-[10px]">
             جاري تحميل النظام الطبي...
          </div>
        </div>
      }>
        <Routes>
          {/* المسارات العامة (Public) */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/register-1" element={<RegistrationPage1 />} />
          <Route path="/register-2" element={<RegistrationPage2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* مسارات المسؤول (Admin) - تشمل الإضافات الجديدة */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="Admin">
              <DashboardLayout role="Admin">
                <Routes>
                  <Route path="dashboard" element={<AdminPanel />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="posts" element={<PostManagement />} />
                  <Route path="tests" element={<TestManagement />} />
                  <Route path="specialties" element={<SpecialtyManagement />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* مسارات المختبر (Lab) - حل مشكلة إدارة التحاليل */}
          <Route path="/lab/*" element={
            <ProtectedRoute allowedRole="Lab">
              <DashboardLayout role="Lab">
                <Routes>
                  <Route path="dashboard" element={<LabDashboard />} />
                  <Route path="appointments" element={<LabAppointments />} />
                  <Route path="appointment-details/:id" element={<LabDetails />} />
                  <Route path="pending-requests" element={<PendingRequests type="Lab" />} />
                  <Route path="tests" element={<LabTestManagement />} />
                  <Route path="profile" element={<LabProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* مسارات الطبيب (Doctor) */}
          <Route path="/doctor/*" element={
            <ProtectedRoute allowedRole="Doctor">
              <DashboardLayout role="Doctor">
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="appointments" element={<DoctorManageAppointments />} />
                  <Route path="appointment-details/:id" element={<AppointmentDetails />} />
                  <Route path="pending-requests" element={<PendingRequests type="Doctor" />} /> 
                  <Route path="posts" element={<DoctorPosts />} /> 
                  <Route path="profile" element={<DoctorProfile />} />
                  <Route path="chat" element={<DoctorChat />} /> 
                  <Route path="patient-profile/:id" element={<PatientProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* مسارات التمريض (Nurse) */}
          <Route path="/nurse/*" element={
            <ProtectedRoute allowedRole="Nurse">
              <DashboardLayout role="Nurse">
                <Routes>
                  <Route path="dashboard" element={<NurseDashboard />} />
                  <Route path="manage-appointments" element={<NurseManageAppointments />} />
                  <Route path="appointment-details/:id" element={<NurseAppointmentDetails />} />
                  <Route path="pending-requests" element={<PendingRequests type="Nurse" />} />
                  <Route path="profile" element={<NurseProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* تحويل أي مسار غير معروف إلى الصفحة الرئيسية */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}