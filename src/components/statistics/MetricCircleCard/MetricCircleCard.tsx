import React, { useEffect, useState } from 'react';

import { MdTrendingUp, MdTrendingDown, MdTrendingFlat, MdMouse, MdVisibility, MdAccessTime, MdShare } from 'react-icons/md';
import type { StatisticsMetric } from '../../../types/statistics.types';
import styles from './MetricCircleCard.module.css';
import { cn } from '../../../utils/cn';

interface MetricCircleCardProps {
  metric: StatisticsMetric;
}

const getIcon = (id: string) => {
  switch (id) {
    case 'clicks': return <MdMouse />;
    case 'views': return <MdVisibility />;
    case 'time': return <MdAccessTime />;
    case 'shares': return <MdShare />;
    default: return <MdTrendingUp />;
  }
};

const MetricCircleCard: React.FC<MetricCircleCardProps> = ({ metric }) => {
  const [progress, setProgress] = useState(0);
  
  // Calculate a fake progress ring percentage based on change (just for visual effect)
  const targetProgress = Math.min(100, Math.max(20, 50 + metric.change));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn(styles.card, styles[metric.color])}>
      <div className={styles.ringContainer}>
        <svg className={styles.svgRing} viewBox="0 0 100 100">
          <circle
            className={styles.bgCircle}
            cx="50"
            cy="50"
            r={radius}
          />
          <circle
            className={styles.progressCircle}
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className={styles.iconWrapper}>
          {getIcon(metric.id)}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.value}>{metric.value}</div>
        <div className={styles.label}>{metric.label}</div>
        
        <div className={cn(styles.change, metric.change > 0 ? styles.positive : metric.change < 0 ? styles.negative : styles.stable)}>
          {metric.change > 0 ? <MdTrendingUp /> : metric.change < 0 ? <MdTrendingDown /> : <MdTrendingFlat />}
          <span className={styles.changeText}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCircleCard;
