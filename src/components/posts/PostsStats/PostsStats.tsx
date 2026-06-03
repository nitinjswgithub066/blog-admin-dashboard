import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiEdit3, FiClock } from 'react-icons/fi';
import styles from './PostsStats.module.css';

interface PostsStatsProps {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
}

const PostsStats: React.FC<PostsStatsProps> = ({ total, published, drafts, scheduled }) => {
  const stats = [
    { label: 'Total Posts', value: total, icon: FiFileText, color: 'var(--text-primary)' },
    { label: 'Published', value: published, icon: FiCheckCircle, color: 'var(--success)' },
    { label: 'Drafts', value: drafts, icon: FiEdit3, color: 'var(--accent-secondary)' },
    { label: 'Scheduled', value: scheduled, icon: FiClock, color: 'var(--info)' },
  ];

  return (
    <div className={styles.statsContainer}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.iconWrapper} style={{ color: stat.color }}>
              <Icon size={20} />
            </div>
            <div className={styles.statInfo}>
              <h4 className={styles.statValue}>{stat.value}</h4>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PostsStats;
