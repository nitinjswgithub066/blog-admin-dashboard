import React from 'react';
import { FiEye, FiMousePointer, FiClock, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Post } from '../../../types';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusVariant = (status: string) => {
    return status.toLowerCase() === 'published' ? 'success' : 'warning';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Card className={styles.postCard}>
      <div className={styles.header}>
        <h3 className={styles.title} title={post.title}>{post.title}</h3>
        <Badge variant={getStatusVariant(post.status)}>{post.status}</Badge>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <Badge variant="primary">{post.category}</Badge>
        </span>
        <span className={styles.metaItem}>
          <FiCalendar /> {formatDate(post.date)}
        </span>
        <span className={styles.metaItem}>
          <FiClock /> {post.readingTimeMin} min read
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Views</span>
          <span className={styles.statValue}>
            <FiEye className="mr-1 inline" /> {formatNumber(post.views)}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Clicks</span>
          <span className={styles.statValue}>
            <FiMousePointer className="mr-1 inline" /> {formatNumber(post.clicks)}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button 
          variant="secondary" 
          size="small" 
          fullWidth 
          leftIcon={<FiEdit2 />}
          onClick={() => onEdit?.(post.id)}
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          size="small" 
          fullWidth 
          leftIcon={<FiTrash2 />}
          onClick={() => onDelete?.(post.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
