import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiUploadCloud } from 'react-icons/fi';
import styles from './EmptyPostsState.module.css';

interface EmptyPostsStateProps {
  onImportWord?: () => void;
}

const EmptyPostsState: React.FC<EmptyPostsStateProps> = ({ onImportWord }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className={styles.emptyStateContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.iconCircle}>
        <FiEdit3 size={32} className={styles.icon} />
      </div>
      <h3 className={styles.title}>No posts found.</h3>
      <p className={styles.subtitle}>Create your first travel story or import a Word document.</p>
      
      <div className={styles.actions}>
        <button 
          className={styles.primaryBtn} 
          onClick={() => navigate('/posts/create')}
        >
          <FiEdit3 /> Create New Post
        </button>
        <button 
          className={styles.secondaryBtn} 
          onClick={onImportWord}
        >
          <FiUploadCloud /> Import Word
        </button>
      </div>
    </motion.div>
  );
};

export default EmptyPostsState;
