import React from 'react';
import { motion } from 'framer-motion';
import styles from './StatsPage.module.css';

const StatsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog Statistics</h1>
          <p className={styles.pageDescription}>
            Detailed analytics for your blog performance and audience engagement.
          </p>
        </div>
      </header>

      <div className={styles.contentShell}>
        [Analytics Charts & Graphs Placeholder]
      </div>
    </motion.div>
  );
};

export default StatsPage;
