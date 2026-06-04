import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat, MdVisibility, MdMouse, MdAccessTime, MdShare } from 'react-icons/md';
import type { PostStatistic } from '../../../types/statistics.types';
import styles from './TopPostStatsList.module.css';
import { cn } from '../../../utils/cn';

interface TopPostStatsListProps {
  posts: PostStatistic[];
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  switch (trend) {
    case 'up': return <MdTrendingUp className={cn(styles.trendIcon, styles.up)} />;
    case 'down': return <MdTrendingDown className={cn(styles.trendIcon, styles.down)} />;
    case 'stable': return <MdTrendingFlat className={cn(styles.trendIcon, styles.stable)} />;
  }
};

const TopPostStatsList: React.FC<TopPostStatsListProps> = ({ posts }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 10, posts.length));
      setIsLoading(false);
    }, 800); // Fake network delay
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top Post Performance</h2>
      </div>

      <div className={styles.list}>
        {visiblePosts.map((post, index) => (
          <motion.div 
            key={post.id}
            className={styles.postRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: (index % 10) * 0.05 }}
          >
            <div className={styles.rank}>
              {String(index + 1).padStart(2, '0')}
            </div>
            
            <div className={styles.mainInfo}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postMeta}>
                <span className={styles.categoryBadge}>{post.category}</span>
                <span className={styles.dot}>·</span>
                <span style={{ textTransform: 'capitalize' }}>{post.status}</span>
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

            <TrendIcon trend={post.trend} />
          </motion.div>
        ))}

        {isLoading && (
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

      {hasMore && !isLoading && (
        <button 
          className={styles.loadMoreBtn} 
          onClick={handleLoadMore}
        >
          Load More Posts
        </button>
      )}
    </div>
  );
};

export default TopPostStatsList;
