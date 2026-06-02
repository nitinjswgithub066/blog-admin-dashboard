import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import ForgotPasswordPage from './pages/auth/forgot-password/ForgotPasswordPage';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Dashboard Routes wrapped in Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/posts/create" element={<div>Create Post placeholder</div>} />
        <Route path="/posts" element={<div>All Posts placeholder</div>} />
        <Route path="/stats" element={<div>Statistics placeholder</div>} />
        <Route path="/settings" element={<div>Settings placeholder</div>} />
      </Route>
    </Routes>
  );
}

export default App;
