import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiKey, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ResetPassword.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const passwordRule = /^[A-Za-z0-9@_#!]{6,12}$/;

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  adminRegistrationCode: z.string().min(1, { message: 'Admin Registration Code is required' }),
  newPassword: z.string().regex(passwordRule, {
    message: 'Use 6-12 characters: letters, numbers, @, _, #, or !',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [isChecking, setIsChecking] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
          credentials: 'include',
        });
        setIsTokenValid(response.ok);
      } catch {
        setIsTokenValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError(null);

    try {
      const response = await fetch(API_BASE_URL + '/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          token,
          email: data.email,
          adminRegistrationCode: data.adminRegistrationCode,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setServerError(json.message || 'Password reset failed. Please request a new reset link.');
        return;
      }

      setIsSuccess(true);
      setTimeout(() => navigate('/auth/login'), 1800);
    } catch {
      setServerError('Unable to reach the server. Please make sure the backend is running.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>
      <div className={`${styles.shape} ${styles.shape3}`}></div>

      <motion.div
        className={`${styles.content} glass-card`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {isChecking ? (
            <motion.div key="checking" className={styles.statePanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className={styles.loader} />
              <h1 className={styles.stateTitle}>Checking reset link</h1>
              <p className={styles.stateText}>Please wait while we verify this password reset request.</p>
            </motion.div>
          ) : !isTokenValid ? (
            <motion.div key="invalid" className={styles.statePanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FiShield className={styles.invalidIcon} />
              <h1 className={styles.stateTitle}>Reset link expired or invalid.</h1>
              <p className={styles.stateText}>Please request a new password reset link.</p>
            </motion.div>
          ) : isSuccess ? (
            <motion.div key="success" className={styles.statePanel} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <FiCheckCircle className={styles.successIcon} />
              <h1 className={styles.stateTitle}>Password changed</h1>
              <p className={styles.stateText}>Password changed successfully. Please login.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className={styles.header}>
                <h1 className={styles.title}>Reset Admin Password</h1>
                <p className={styles.subtitle}>Enter your account email and create a new password.</p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <div className={styles.inputWrapper}>
                    <FiMail className={styles.inputIcon} />
                    <input id="email" type="email" className={styles.input} placeholder="admin@example.com" {...register('email')} />
                  </div>
                  {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="adminRegistrationCode" className={styles.label}>Admin Registration Code</label>
                  <div className={styles.inputWrapper}>
                    <FiKey className={styles.inputIcon} />
                    <input id="adminRegistrationCode" type="text" className={styles.input} placeholder="A9#K2P@Z" {...register('adminRegistrationCode')} />
                  </div>
                  {errors.adminRegistrationCode && <span className={styles.errorText}>{errors.adminRegistrationCode.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="newPassword" className={styles.label}>New Password</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input id="newPassword" type="password" className={styles.input} placeholder="New@123" {...register('newPassword')} />
                  </div>
                  {errors.newPassword && <span className={styles.errorText}>{errors.newPassword.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input id="confirmPassword" type="password" className={styles.input} placeholder="New@123" {...register('confirmPassword')} />
                  </div>
                  {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword.message}</span>}
                </div>

                {serverError && <div className={styles.serverError}>{serverError}</div>}

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Changing password...' : 'Change Password'}
                  <FiShield />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.footer}>
          <Link to="/auth/login" className={styles.footerLink}>
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
