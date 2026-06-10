import React from 'react';
import { LuWallet, LuHotel, LuUtensils, LuCar, LuTicket, LuSettings2, LuTrash2 } from 'react-icons/lu';
import styles from './BudgetBoxBlock.module.css';

interface BudgetBoxBlockProps {
  totalAmount?: number;
  currency?: string;
  period?: string;
  onRemove?: () => void;
}

const BudgetBoxBlock: React.FC<BudgetBoxBlockProps> = ({
  totalAmount = 1250,
  currency = "$",
  period = "per person / week",
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
        <LuWallet size={16} /> Budget Breakdown
      </div>
      
      <h3 className={styles.title}>Estimated Costs</h3>
      
      <div className={styles.budgetTotal}>
        <span className={styles.budgetCurrency}>{currency}</span>
        {totalAmount}
        <span className={styles.budgetPeriod}>{period}</span>
      </div>
      
      <div className={styles.breakdown}>
        <div>
          <div className={styles.breakdownRow}>
            <div className={styles.breakdownLabel}><LuHotel size={14} /> Accommodation</div>
            <div className={styles.breakdownValue}>$500</div>
          </div>
          <div className={styles.progressBar}>
            <div className={`${styles.progressFill} ${styles.progressAccommodation}`}></div>
          </div>
        </div>

        <div>
          <div className={styles.breakdownRow}>
            <div className={styles.breakdownLabel}><LuUtensils size={14} /> Food & Dining</div>
            <div className={styles.breakdownValue}>$350</div>
          </div>
          <div className={styles.progressBar}>
            <div className={`${styles.progressFill} ${styles.progressFood}`}></div>
          </div>
        </div>

        <div>
          <div className={styles.breakdownRow}>
            <div className={styles.breakdownLabel}><LuTicket size={14} /> Activities</div>
            <div className={styles.breakdownValue}>$250</div>
          </div>
          <div className={styles.progressBar}>
            <div className={`${styles.progressFill} ${styles.progressActivities}`}></div>
          </div>
        </div>

        <div>
          <div className={styles.breakdownRow}>
            <div className={styles.breakdownLabel}><LuCar size={14} /> Transport</div>
            <div className={styles.breakdownValue}>$150</div>
          </div>
          <div className={styles.progressBar}>
            <div className={`${styles.progressFill} ${styles.progressTransport}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBoxBlock;
