import React from 'react';
import { motion } from 'framer-motion';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageDescription}>
            Manage your account preferences, blog settings, and security.
          </p>
        </div>
      </header>

      <div className={styles.contentShell}>
        [Settings Form Placeholder]
      </div>
    </motion.div>
  );
};

export default SettingsPage;
