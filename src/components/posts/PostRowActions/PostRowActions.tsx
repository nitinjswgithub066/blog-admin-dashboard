import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiEdit3, FiEye, FiCopy, FiArchive, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PostRowActions.module.css';

interface PostRowActionsProps {
  onEdit: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  isArchived?: boolean;
}

const PostRowActions: React.FC<PostRowActionsProps> = ({
  onEdit, onPreview, onDuplicate, onArchive, onDelete, onRestore, isArchived = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        className={styles.triggerBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More actions"
      >
        <FiMoreVertical />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.dropdown}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <button className={styles.menuItem} onClick={() => handleAction(onEdit)}>
              <FiEdit3 /> Edit
            </button>
            <button className={styles.menuItem} onClick={() => handleAction(onPreview)}>
              <FiEye /> Preview
            </button>
            <button className={styles.menuItem} onClick={() => handleAction(onDuplicate)}>
              <FiCopy /> Duplicate
            </button>
            <div className={styles.divider} />
            {isArchived && onRestore ? (
              <button className={styles.menuItem} onClick={() => handleAction(onRestore)}>
                <FiRotateCcw /> Restore
              </button>
            ) : (
              <button className={styles.menuItem} onClick={() => handleAction(onArchive)}>
                <FiArchive /> Archive
              </button>
            )}
            <button className={`${styles.menuItem} ${styles.danger}`} onClick={() => handleAction(onDelete)}>
              <FiTrash2 /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostRowActions;
