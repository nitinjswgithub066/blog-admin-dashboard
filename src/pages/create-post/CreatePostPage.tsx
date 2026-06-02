import React from 'react';
import { motion } from 'framer-motion';
import styles from './CreatePostPage.module.css';

const CreatePostPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Create New Post</h1>
          <p className={styles.pageDescription}>
            Draft and publish a new article for your blog.
          </p>
        </div>
      </header>

      <div className={styles.contentShell}>
        [Create Post Editor Placeholder]
      </div>
    </motion.div>
  );
};

export default CreatePostPage;
