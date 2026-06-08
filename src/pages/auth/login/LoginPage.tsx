import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await fetch(API_BASE_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: allows cookie to be set
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setServerError(json.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Update auth context state with the returned admin object
      if (json.data && json.data.admin) {
        setAuth(json.data.admin);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setServerError('Unable to reach the server. Please make sure the backend is running.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Animated Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>
      <div className={`${styles.shape} ${styles.shape3}`}></div>

      {/* Login Card */}
      <motion.div
        className={`${styles.content} glass-card`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.header}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to access the admin dashboard
          </motion.p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <motion.div 
            className={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className={styles.input}
                {...register('email')}
              />
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
          </motion.div>

          <motion.div 
            className={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={styles.input}
                {...register('password')}
              />
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
          </motion.div>

          <motion.div 
            className={styles.forgotPassword}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/auth/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </Link>
          </motion.div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FCA5A5',
                fontSize: '13px',
                marginBottom: '4px',
              }}
            >
              {serverError}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            <FiLogIn />
          </motion.button>
        </form>

        <motion.div 
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Don't have an admin account?
          <Link to="/auth/register" className={styles.footerLink}>
            Register here
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
