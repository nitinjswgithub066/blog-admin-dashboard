import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TravelToolbar from './TravelToolbar';
import MoreToolsMenu from './MoreToolsMenu';
import styles from './TravelEditor.module.css';

interface TravelEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const TravelEditor: React.FC<TravelEditorProps> = ({ value, onChange }) => {
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TravelToolbar 
        onMoreClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)} 
      />
      
      <MoreToolsMenu 
        isOpen={isMoreToolsOpen} 
        onClose={() => setIsMoreToolsOpen(false)} 
      />

      <div className={styles.canvas}>
        <textarea
          className={styles.textarea}
          placeholder="Start writing your travel story..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
};

export default TravelEditor;
