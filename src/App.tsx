import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      
      {/* Placeholders for upcoming pages */}
      <Route path="/auth/forgot-password" element={<div>Forgot Password placeholder</div>} />
      <Route path="/dashboard" element={<div>Dashboard placeholder</div>} />
    </Routes>
  );
}

export default App;
