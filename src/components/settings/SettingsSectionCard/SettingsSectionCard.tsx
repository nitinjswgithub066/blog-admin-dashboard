import React from 'react';
import { FiRefreshCcw, FiSave } from 'react-icons/fi';
import styles from './SettingsSectionCard.module.css';

interface SettingsSectionCardProps {
  title: string;
  description?: string;
  hasChanges: boolean;
  onSave: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

const SettingsSectionCard: React.FC<SettingsSectionCardProps> = ({
  title,
  description,
  hasChanges,
  onSave,
  onReset,
  children
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {hasChanges && (
          <span className={styles.unsavedBadge}>Unsaved changes</span>
        )}
      </div>

      <div className={styles.content}>
        {children}
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.resetBtn} 
          onClick={onReset}
          disabled={!hasChanges}
        >
          <FiRefreshCcw /> Reset
        </button>
        <button 
          className={`${styles.saveBtn} ${hasChanges ? styles.active : ''}`}
          onClick={onSave}
          disabled={!hasChanges}
        >
          <FiSave /> Save
        </button>
      </div>
    </div>
  );
};

export default SettingsSectionCard;
