import React from 'react';
import { LuMapPin, LuGlobe, LuLanguages, LuBanknote, LuSettings2, LuTrash2 } from 'react-icons/lu';
import styles from './DestinationFactsBlock.module.css';

interface DestinationFactsBlockProps {
  country?: string;
  language?: string;
  currency?: string;
  capital?: string;
  onRemove?: () => void;
}

const DestinationFactsBlock: React.FC<DestinationFactsBlockProps> = ({
  country = "Switzerland",
  language = "German, French",
  currency = "Swiss Franc (CHF)",
  capital = "Bern",
  onRemove
}) => {
  return (
    <div className={styles.container} contentEditable={false}>
      <div className={styles.actions}>
        <button className={styles.actionBtn} title="Settings">
          <LuSettings2 size={14} />
        </button>
        <button className={styles.actionBtn} onClick={onRemove} title="Remove Block">
          <LuTrash2 size={14} />
        </button>
      </div>

      <div className={styles.header}>
        <LuMapPin size={16} /> Destination Facts
      </div>
      
      <h3 className={styles.title}>At a Glance</h3>
      
      <div className={styles.grid}>
        <div className={styles.factItem}>
          <div className={styles.factIcon}>
            <LuGlobe size={20} />
          </div>
          <div className={styles.factContent}>
            <span className={styles.factLabel}>Country/Region</span>
            <span className={styles.factValue}>{country}</span>
          </div>
        </div>

        <div className={styles.factItem}>
          <div className={styles.factIcon}>
            <LuMapPin size={20} />
          </div>
          <div className={styles.factContent}>
            <span className={styles.factLabel}>Capital</span>
            <span className={styles.factValue}>{capital}</span>
          </div>
        </div>

        <div className={styles.factItem}>
          <div className={styles.factIcon}>
            <LuLanguages size={20} />
          </div>
          <div className={styles.factContent}>
            <span className={styles.factLabel}>Language</span>
            <span className={styles.factValue}>{language}</span>
          </div>
        </div>

        <div className={styles.factItem}>
          <div className={styles.factIcon}>
            <LuBanknote size={20} />
          </div>
          <div className={styles.factContent}>
            <span className={styles.factLabel}>Currency</span>
            <span className={styles.factValue}>{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationFactsBlock;
