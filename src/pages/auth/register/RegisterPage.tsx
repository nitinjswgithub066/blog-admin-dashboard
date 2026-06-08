import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiUserPlus, FiAtSign } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(12, { message: 'Password must be at most 12 characters' })
    .regex(/^[A-Za-z0-9@_#!]+$/, { message: 'Use only letters, numbers, @, _, #, or !' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    try {
      const response = await fetch(API_BASE_URL + '/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.fullName,
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setServerError(json.message || 'Registration failed. Please try again.');
        return;
      }

      // Simple success redirect
      setSuccessMsg('Account created! Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 2000);
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

      {/* Register Card */}
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
            Create Admin Account
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create a secure admin profile for your dashboard
          </motion.p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <motion.div 
            className={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={styles.input}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && <span className={styles.errorText}>{errors.fullName.message}</span>}
          </motion.div>

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
            transition={{ delay: 0.42 }}
          >
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <FiAtSign className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                placeholder="admin123"
                className={styles.input}
                {...register('username')}
              />
            </div>
            {errors.username && <span className={styles.errorText}>{errors.username.message}</span>}
          </motion.div>

          <motion.div 
            className={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
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
            className={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={styles.input}
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword.message}</span>}
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

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#6EE7B7',
                fontSize: '13px',
                marginBottom: '4px',
              }}
            >
              {successMsg}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || !!successMsg}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
            <FiUserPlus />
          </motion.button>
        </form>

        <motion.div 
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Already have an account?
          <Link to="/auth/login" className={styles.footerLink}>
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
