import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiEdit2, FiExternalLink, FiPlus, FiBookOpen, FiTrash2, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import type { AdminPost } from '../../../types/post.types';
import type { RecentPostFilter } from '../../../services/post.service';
import { formatDate } from '../../../utils/formatDate';
import styles from './RecentPostsPanel.module.css';

interface RecentPostsPanelProps {
  posts: AdminPost[];
  activeFilter: RecentPostFilter;
  isLoading: boolean;
  error: string;
  onWritePost: () => void;
  onFilterChange: (filter: RecentPostFilter) => void;
  onEditPost: (id: string) => void;
  onPreviewPost: (id: string) => void;
  onDeletePost: (id: string) => void;
}

const categoryInitials: Record<string, string> = {
  technology: 'TE',
  ai: 'AI',
  'web development': 'WD',
  thoughts: 'TH',
};

const getCategoryInitials = (category: string) => {
  const normalized = category.trim().toLowerCase();
  if (categoryInitials[normalized]) return categoryInitials[normalized];
  return category
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PO';
};

const filters: { label: string; value: RecentPostFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
];

const RecentPostsPanel: React.FC<RecentPostsPanelProps> = ({
  posts,
  activeFilter,
  isLoading,
  error,
  onWritePost,
  onFilterChange,
  onEditPost,
  onPreviewPost,
  onDeletePost,
}) => {
  const renderState = () => {
    if (isLoading) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <FiRefreshCw className={`${styles.emptyIcon} ${styles.spinIcon}`} />
            <p>Loading recent posts...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${styles.emptyState} ${styles.errorState}`}>
          <div className={styles.emptyStateContent}>
            <FiAlertCircle className={styles.emptyIcon} />
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <FiBookOpen className={styles.emptyIcon} />
            <p>No posts added in the last 30 days.</p>
            <p>Click "Write Post" to create a new blog post.</p>
          </div>
        </div>
      );
    }

    return posts.map((post, i) => (
      <motion.div
        key={post.id}
        className={styles.card}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: i * 0.05 }}
      >
        <div className={styles.cardImage}>
          {post.optimizedCoverUrl || post.coverImage ? (
            <img src={post.optimizedCoverUrl || post.coverImage} alt={post.title} />
          ) : (
            <div className={styles.imagePlaceholder}>
              {getCategoryInitials(post.category)}
            </div>
          )}
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
            <button type="button" className={styles.actionBtn} onClick={() => onEditPost(post.id)}>
              <FiEdit2 /> Edit
            </button>
            <button type="button" className={styles.actionBtnSecondary} onClick={() => onPreviewPost(post.id)}>
              <FiExternalLink /> Preview
            </button>
            <button
              type="button"
              className={`${styles.actionBtnSecondary} ${styles.actionBtnDanger}`}
              title="Delete post"
              aria-label={`Delete ${post.title}`}
              onClick={() => onDeletePost(post.id)}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </motion.div>
    ));
  };

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
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === filter.value ? styles.active : ''}`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {renderState()}
      </div>
    </div>
  );
};

export default RecentPostsPanel;
