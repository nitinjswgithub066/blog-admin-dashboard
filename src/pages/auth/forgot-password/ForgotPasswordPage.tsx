import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiSend, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('We have sent a password reset link to your email address.');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      const response = await fetch(API_BASE_URL + '/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email }),
      });

      const json = await response.json();

      if (!response.ok) {
        setServerError(json.message || 'Unable to send reset link. Please try again.');
        return;
      }

      setSuccessMessage(json.message || 'We have sent a password reset link to your email address.');
      setIsSuccess(true);
    } catch {
      setServerError('Unable to reach the server. Please make sure the backend is running.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Animated Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>
      <div className={`${styles.shape} ${styles.shape3}`}></div>

      {/* Forgot Password Card */}
      <motion.div
        className={`${styles.content} glass-card`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.header}>
                <motion.h1 
                  className={styles.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Reset Password
                </motion.h1>
                <motion.p 
                  className={styles.subtitle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Enter your email and we'll send a reset link
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

                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.serverError}
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
                  transition={{ delay: 0.5 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  <FiSend />
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className={styles.successState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
            >
              <FiCheckCircle className={styles.successIcon} />
              <h2 className={styles.successTitle}>Check your inbox</h2>
              <p className={styles.successText}>
                {successMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/auth/login" className={`${styles.footerLink} ${styles.backLink}`}>
            <FiArrowLeft /> Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
