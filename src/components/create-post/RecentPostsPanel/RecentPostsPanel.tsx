import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiEdit2, FiExternalLink, FiPlus, FiBookOpen } from 'react-icons/fi';
import type { AdminPost } from '../../../types/post.types';
import { formatDate } from '../../../utils/formatDate';
import styles from './RecentPostsPanel.module.css';

interface RecentPostsPanelProps {
  posts: AdminPost[];
  onWritePost: () => void;
}

const RecentPostsPanel: React.FC<RecentPostsPanelProps> = ({ posts, onWritePost }) => {
  const [filter, setFilter] = useState('all');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const filteredPosts = posts.filter(post => {
    // Only show posts from last 30 days
    if (new Date(post.createdAt) < thirtyDaysAgo) return false;
    
    if (filter === 'all') return true;
    return post.status === filter;
  });

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Recent Created Posts</h2>
          <p className={styles.subtitle}>Posts added in the last 30 days</p>
        </div>
        <button className={styles.writePostBtn} onClick={onWritePost}>
          <FiPlus /> Write Post
        </button>
      </div>

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
        <button 
          className={`${styles.filterBtn} ${filter === 'scheduled' ? styles.active : ''}`}
          onClick={() => setFilter('scheduled')}
        >
          Scheduled
        </button>
      </div>

      <div className={styles.list}>
        {filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <FiBookOpen className={styles.emptyIcon} />
            <p>No posts added in the last 30 days.</p>
            <p>Click "Write Post" to create a new blog post.</p>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div 
              key={post.id} 
              className={styles.card}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
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
                <h4 className={styles.cardTitle} title={post.title}>{post.title}</h4>
                
                <div className={styles.cardMetrics}>
                  <span className={styles.metricItem}>
                    <FiClock /> {formatDate(post.createdAt)}
                  </span>
                  <span className={styles.metricItem}>
                    <FiEye /> {post.views}
                  </span>
                </div>
                
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}><FiEdit2 /> Edit</button>
                  <button className={styles.actionBtnSecondary}><FiExternalLink /> Preview</button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentPostsPanel;
