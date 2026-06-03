import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBold, FiItalic, FiUnderline, FiType, 
  FiList, FiMenu, FiCode, FiLink, FiImage, 
  FiCornerUpLeft, FiCornerUpRight 
} from 'react-icons/fi';
import styles from './MockTextEditor.module.css';

interface MockTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const MockTextEditor: React.FC<MockTextEditorProps> = ({ value, onChange }) => {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const toggleFormat = (format: string) => {
    setActiveFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const isActive = (format: string) => activeFormats.includes(format);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('bold') ? styles.active : ''}`} onClick={() => toggleFormat('bold')} title="Bold">
            <FiBold />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('italic') ? styles.active : ''}`} onClick={() => toggleFormat('italic')} title="Italic">
            <FiItalic />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('underline') ? styles.active : ''}`} onClick={() => toggleFormat('underline')} title="Underline">
            <FiUnderline />
          </button>
        </div>
        
        <div className={styles.toolbarGroup}>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('heading') ? styles.active : ''}`} onClick={() => toggleFormat('heading')} title="Heading">
            <FiType />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('bulletList') ? styles.active : ''}`} onClick={() => toggleFormat('bulletList')} title="Bullet List">
            <FiList />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('numberList') ? styles.active : ''}`} onClick={() => toggleFormat('numberList')} title="Number List">
            <FiMenu />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('code') ? styles.active : ''}`} onClick={() => toggleFormat('code')} title="Code">
            <FiCode />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('link') ? styles.active : ''}`} onClick={() => toggleFormat('link')} title="Link">
            <FiLink />
          </button>
          <button type="button" className={`${styles.toolbarBtn} ${isActive('image') ? styles.active : ''}`} onClick={() => toggleFormat('image')} title="Image">
            <FiImage />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button type="button" className={styles.toolbarBtn} title="Undo">
            <FiCornerUpLeft />
          </button>
          <button type="button" className={styles.toolbarBtn} title="Redo">
            <FiCornerUpRight />
          </button>
        </div>
      </div>

      <div className={styles.editorArea}>
        <textarea
          className={styles.textarea}
          placeholder="Start writing your blog content..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
};

export default MockTextEditor;
