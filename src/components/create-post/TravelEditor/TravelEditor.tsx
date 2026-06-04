import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import TravelToolbar from './TravelToolbar';
import styles from './TravelEditor.module.css';
import { calculateReadingTime } from '../../../utils/calculateReadingTime';

interface TravelEditorProps {
  value: string;
  onChange: (val: string) => void;
  title: string;
  onTitleChange: (val: string) => void;
}

const TravelEditor: React.FC<TravelEditorProps> = ({ value, onChange, title, onTitleChange }) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState('1 min');
  const [saveStatus, setSaveStatus] = useState('Saved locally');

  // Calculate metrics when content changes
  useEffect(() => {
    const text = value.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).length : 0);
    setReadTime(calculateReadingTime(text) + ' min');
    
    setSaveStatus('Unsaved changes');
    const timer = setTimeout(() => {
      setSaveStatus('Saved locally');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [value, title]);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 1. Editor Top Header */}
      <div className={styles.editorHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.docIconWrapper}>
            <FiFileText />
          </div>
          <div className={styles.docInfo}>
            <input 
              type="text" 
              className={styles.docTitleInput}
              placeholder="Untitled Blog Document"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
            <span className={styles.saveStatus}>
              {saveStatus} · Last edited just now
            </span>
          </div>
        </div>
      </div>

      {/* 2. Formatting Toolbar */}
      <TravelToolbar />

      {/* 3. Document Canvas */}
      <div className={styles.editorBody}>
        <div className={styles.documentPage}>
          <textarea
            className={styles.documentEditable}
            placeholder="Start writing your blog post..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      {/* 4. Editor Footer / Stats */}
      <div className={styles.editorFooter}>
        <div className={styles.footerStats}>
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
          <span>Estimated reading time: {readTime}</span>
        </div>
        <div className={styles.footerStatus}>
          {saveStatus}
        </div>
      </div>
    </motion.div>
  );
};

export default TravelEditor;
