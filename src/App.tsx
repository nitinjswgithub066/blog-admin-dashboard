import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/LoginPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      
      {/* Placeholders for upcoming pages */}
      <Route path="/auth/register" element={<div>Register Page placeholder</div>} />
      <Route path="/auth/forgot-password" element={<div>Forgot Password placeholder</div>} />
      <Route path="/dashboard" element={<div>Dashboard placeholder</div>} />
    </Routes>
  );
}

export default App;
