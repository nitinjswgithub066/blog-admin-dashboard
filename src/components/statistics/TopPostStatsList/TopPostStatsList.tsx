import React from 'react';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat, MdVisibility, MdMouse, MdAccessTime, MdShare } from 'react-icons/md';
import type { PostStatistic } from '../../../types/statistics.types';
import styles from './TopPostStatsList.module.css';
import { cn } from '../../../utils/cn';

interface TopPostStatsListProps {
  posts: PostStatistic[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

const TrendBadge = ({ trend, growth }: { trend: 'up' | 'down' | 'stable'; growth: number }) => {
  const label = `${growth > 0 ? '+' : ''}${growth}%`;
  switch (trend) {
    case 'up': return <span className={cn(styles.trendBadge, styles.up)}><MdTrendingUp /> {label}</span>;
    case 'down': return <span className={cn(styles.trendBadge, styles.down)}><MdTrendingDown /> {label}</span>;
    case 'stable': return <span className={cn(styles.trendBadge, styles.stable)}><MdTrendingFlat /> {label}</span>;
  }
};

const TopPostStatsList: React.FC<TopPostStatsListProps> = ({ posts, hasMore, isLoadingMore, onLoadMore }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top Post Performance</h2>
      </div>

      <div className={styles.list}>
        {posts.length === 0 && !isLoadingMore ? (
          <div className={styles.emptyState}>No post performance data yet.</div>
        ) : posts.map((post, index) => (
          <motion.div 
            layout
            key={post.id}
            className={styles.postRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: (index % 10) * 0.05 }}
          >
            <div className={styles.rank}>
              {String(post.rank || index + 1).padStart(2, '0')}
            </div>
            
            <div className={styles.mainInfo}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postMeta}>
                <span className={styles.categoryBadge}>{post.category}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.statusText}>{post.status.toLowerCase()}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.metaItem}>
                  <MdVisibility /> {post.views >= 1000 ? (post.views / 1000).toFixed(1) + 'K' : post.views}
                </span>
                <span className={styles.metaItem}>
                  <MdMouse /> {post.clicks >= 1000 ? (post.clicks / 1000).toFixed(1) + 'K' : post.clicks}
                </span>
                <span className={styles.metaItem}>
                  <MdAccessTime /> {post.readingTime} min
                </span>
                <span className={styles.metaItem}>
                  <MdShare /> {post.shares >= 1000 ? (post.shares / 1000).toFixed(1) + 'K' : post.shares}
                </span>
              </div>
            </div>

            <TrendBadge trend={post.trend} growth={post.growth || 0} />
          </motion.div>
        ))}

        {isLoadingMore && (
          <>
            {[1, 2, 3].map(i => (
              <div key={`skeleton-${i}`} className={styles.skeletonRow}>
                <div className={styles.skeletonRank} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonMeta} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {hasMore && !isLoadingMore && (
        <button 
          className={styles.loadMoreBtn} 
          onClick={onLoadMore}
        >
          Load More Posts
        </button>
      )}
    </div>
  );
};

export default TopPostStatsList;
