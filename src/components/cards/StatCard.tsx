import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import Card from '../ui/Card';
import type { DashboardMetric } from '../../types';
import styles from './StatCard.module.css';

interface StatCardProps {
  metric: DashboardMetric;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ metric, icon }) => {
  return (
    <Card className={styles.statCard}>
      <div className={styles.header}>
        <h3 className={styles.label}>{metric.label}</h3>
        <div className={styles.iconWrapper}>
          {icon || <FiActivity />}
        </div>
      </div>
      
      <div className={styles.valueContainer}>
        <p className={styles.value}>{metric.value}</p>
        <div className={`${styles.change} ${metric.isPositive ? styles.positive : styles.negative}`}>
          {metric.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          <span>{metric.change}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
