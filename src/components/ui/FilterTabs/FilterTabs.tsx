import React from 'react';
import styles from './FilterTabs.module.css';

export interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`${styles.filterTabs} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`${styles.tab} ${activeTabId === tab.id ? styles.active : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
