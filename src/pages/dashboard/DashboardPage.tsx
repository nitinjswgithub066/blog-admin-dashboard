import React from 'react';
import { motion } from 'framer-motion';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageDescription}>
            Welcome back! Here's what's happening with your blog today.
          </p>
        </div>
      </header>

      <div className={styles.contentShell}>
        [Dashboard Content Placeholder]
      </div>
    </motion.div>
  );
};

export default DashboardPage;
