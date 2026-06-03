import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiEdit3, FiArchive, FiTrash2, FiDownload, FiX } from 'react-icons/fi';
import styles from './BulkActionsBar.module.css';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: string) => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkAction
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          className={styles.bulkBarContainer}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className={styles.bulkBarInner}>
            <div className={styles.selectionInfo}>
              <span className={styles.badge}>{selectedCount}</span>
              <span className={styles.text}>Posts Selected</span>
              <button className={styles.clearBtn} onClick={onClearSelection}>
                <FiX size={14} /> Clear
              </button>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => onBulkAction('publish')}>
                <FiCheck /> Publish
              </button>
              <button className={styles.actionBtn} onClick={() => onBulkAction('draft')}>
                <FiEdit3 /> Move to Draft
              </button>
              <button className={styles.actionBtn} onClick={() => onBulkAction('archive')}>
                <FiArchive /> Archive
              </button>
              <button className={styles.actionBtn} onClick={() => onBulkAction('export')}>
                <FiDownload /> Export
              </button>
              <div className={styles.divider} />
              <button className={styles.dangerBtn} onClick={() => onBulkAction('delete')}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionsBar;
