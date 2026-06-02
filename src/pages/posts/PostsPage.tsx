import React from 'react';
import { motion } from 'framer-motion';
import styles from './PostsPage.module.css';

const PostsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Posts</h1>
          <p className={styles.pageDescription}>
            Manage, edit, or delete your published and draft articles.
          </p>
        </div>
      </header>

      <div className={styles.contentShell}>
        [Posts Data Table Placeholder]
      </div>
    </motion.div>
  );
};

export default PostsPage;
