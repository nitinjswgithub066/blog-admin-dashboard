import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiEdit2, FiExternalLink } from 'react-icons/fi';
import type { AdminPost } from '../../../types/post.types';
import { formatDate } from '../../../utils/formatDate';
import styles from './RecentPostGrid.module.css';

interface RecentPostGridProps {
  posts: AdminPost[];
}

const RecentPostGrid: React.FC<RecentPostGridProps> = ({ posts }) => {
  const [filter, setFilter] = useState('all');

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Created Posts</h3>
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'published' ? styles.active : ''}`}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'draft' ? styles.active : ''}`}
            onClick={() => setFilter('draft')}
          >
            Draft
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className={styles.emptyState}>
          No posts found for this filter in the last 30 days.
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPosts.map((post, i) => (
            <motion.div 
              key={post.id} 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className={styles.cardImage}>
                {post.coverImage && <img src={post.coverImage} alt={post.title} />}
                <span className={`${styles.cardBadge} ${
                  post.status === 'published' ? styles.badgePublished : 
                  post.status === 'scheduled' ? styles.badgeScheduled : 
                  styles.badgeDraft
                }`}>
                  {post.status}
                </span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardCategory}>{post.category}</span>
                <h4 className={styles.cardTitle}>{post.title}</h4>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <FiClock /> {formatDate(post.createdAt)}
                  </div>
                  <div className={styles.metaItem}>
                    <FiEye /> {post.views}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.editBtn}><FiEdit2 /> Edit</button>
                  <button className={styles.previewBtn}><FiExternalLink /> Preview</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPostGrid;
