import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import ForgotPasswordPage from './pages/auth/forgot-password/ForgotPasswordPage';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreatePostPage from './pages/create-post/CreatePostPage';
import PostsPage from './pages/posts/PostsPage';
import StatsPage from './pages/stats/StatsPage';
import ProfilePage from './pages/profile/Profile';
import SettingsPage from './pages/settings/SettingsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
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
        <Route path="/posts/create" element={<CreatePostPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
