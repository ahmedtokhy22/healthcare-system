import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. استيراد المكونات الثابتة ---
import Navbar from './components/Navbar'; 

// --- 2. تعريف الصفحات (Lazy Loading) ---
// Auth & Registration
const AuthPage = lazy(() => import('./components/AuthPage'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const OTPPage = lazy(() => import('./components/OTPPage'));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage'));
const RegistrationPage1 = lazy(() => import('./components/RegistrationPage1'));
const RegistrationPage2 = lazy(() => import('./components/RegistrationPage2'));

// Admin
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AdminUsers = lazy(() => import('./components/AdminUsers'));
const UserList = lazy(() => import('./components/UserList'));

// Doctor
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const DoctorManageAppointments = lazy(() => import('./components/DoctorManageAppointments'));
const DoctorProfile = lazy(() => import('./components/DoctorProfile'));
const DoctorPosts = lazy(() => import('./components/DoctorPosts'));
const PatientProfile = lazy(() => import('./components/PatientProfile')); // ضفنا الاستيراد هنا

// Nurse
const NurseDashboard = lazy(() => import('./components/NurseDashboard'));
const NurseManageAppointments = lazy(() => import('./components/NurseManageAppointments'));
const NurseProfile = lazy(() => import('./components/NurseProfile'));

// Lab
const LabDashboard = lazy(() => import('./components/LabDashboard'));
const LabAppointments = lazy(() => import('./components/LabAppointments'));
const LabTestManagement = lazy(() => import('./components/LabTestManagement'));
const LabProfile = lazy(() => import('./components/LabProfile'));

// Generic
const EditProfile = lazy(() => import('./components/EditProfile'));

// --- 3. المكونات المساعدة ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/" replace />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to={`/${userRole.toLowerCase()}/dashboard`} replace />;
  return children;
};

const DashboardLayout = ({ children, role }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar role={role} showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
      <main className="max-w-7xl mx-auto p-6 md:p-10">{children}</main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen animate-pulse text-blue-600 font-black tracking-widest">HEALTHCARE SYSTEM...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/register-1" element={<RegistrationPage1 />} />
          <Route path="/register-2" element={<RegistrationPage2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="Admin">
              <DashboardLayout role="Admin">
                <Routes>
                  <Route path="dashboard" element={<AdminPanel />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="user-list" element={<UserList />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/*" element={
            <ProtectedRoute allowedRole="Doctor">
              <DashboardLayout role="Doctor">
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="appointments" element={<DoctorManageAppointments />} />
                  <Route path="posts" element={<DoctorPosts />} /> 
                  <Route path="profile" element={<DoctorProfile />} />
                  {/* مسار تفاصيل المريض أصبح مفعلاً الآن */}
                  <Route path="patient-profile/:id" element={<PatientProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Nurse Routes */}
          <Route path="/nurse/*" element={
            <ProtectedRoute allowedRole="Nurse">
              <DashboardLayout role="Nurse">
                <Routes>
                  <Route path="dashboard" element={<NurseDashboard />} />
                  <Route path="manage-appointments" element={<NurseManageAppointments />} />
                  <Route path="profile" element={<NurseProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Lab Routes */}
          <Route path="/lab/*" element={
            <ProtectedRoute allowedRole="Lab">
              <DashboardLayout role="Lab">
                <Routes>
                  <Route path="dashboard" element={<LabDashboard />} />
                  <Route path="appointments" element={<LabAppointments />} />
                  <Route path="tests" element={<LabTestManagement />} />
                  <Route path="profile" element={<LabProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}