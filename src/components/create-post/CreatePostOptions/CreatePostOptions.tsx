import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit3, FiFileText } from 'react-icons/fi';
import styles from './CreatePostOptions.module.css';

interface CreatePostOptionsProps {
  onSelectOption: (option: 'text' | 'document') => void;
}

const CreatePostOptions: React.FC<CreatePostOptionsProps> = ({ onSelectOption }) => {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className={styles.title}>How would you like to start?</h2>
      
      <div className={styles.optionsGrid}>
        <motion.div 
          className={styles.optionCard}
          onClick={() => onSelectOption('text')}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.iconWrapper}>
            <FiEdit3 />
          </div>
          <h3 className={styles.cardTitle}>Text Editor</h3>
          <p className={styles.cardDesc}>
            Write manually using a Word-like editor. Best for drafting posts directly in the dashboard.
          </p>
          <button className={styles.ctaBtn}>Start Writing</button>
        </motion.div>

        <motion.div 
          className={styles.optionCard}
          onClick={() => onSelectOption('document')}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.iconWrapper}>
            <FiFileText />
          </div>
          <h3 className={styles.cardTitle}>Upload Document</h3>
          <p className={styles.cardDesc}>
            Upload a Word document and convert it into blog content. Best for imported drafts.
          </p>
          <button className={styles.ctaBtn}>Upload File</button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePostOptions;
