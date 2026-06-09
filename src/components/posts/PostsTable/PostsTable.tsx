import React from 'react';
import { motion } from 'framer-motion';
import type { AdminPost } from '../../../types/post.types';
import PostStatusBadge from '../PostStatusBadge/PostStatusBadge';
import PostRowActions from '../PostRowActions/PostRowActions';
import styles from './PostsTable.module.css';

interface PostsTableProps {
  posts: AdminPost[];
  selectedPosts: string[];
  onSelectPost: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onAction: (action: string, postId: string) => void;
}

const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  selectedPosts,
  onSelectPost,
  onSelectAll,
  onAction
}) => {
  const allSelected = posts.length > 0 && selectedPosts.length === posts.length;
  const someSelected = selectedPosts.length > 0 && !allSelected;
  const isRecoverableStatus = (status: AdminPost['status']) => status === 'archived' || status === 'deleted';

  const getCategoryInitials = (category: string) =>
    category
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PO';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.tableWrapper}>
      {/* Desktop Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCell}>
              <input 
                type="checkbox" 
                className={styles.checkbox}
                checked={allSelected}
                ref={input => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th>Post</th>
            <th>Category</th>
            <th>Status</th>
            <th>Author</th>
            <th>Last Updated</th>
            <th>Views</th>
            <th className={styles.actionsCell}></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <motion.tr 
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={selectedPosts.includes(post.id) ? styles.selectedRow : ''}
            >
              <td className={styles.checkboxCell}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => onSelectPost(post.id, e.target.checked)}
                />
              </td>
              <td>
                <div className={styles.postInfo}>
                  <div className={styles.thumbnail}>
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} />
                    ) : (
                      <span className={styles.placeholderText}>{getCategoryInitials(post.category)}</span>
                    )}
                  </div>
                  <div className={styles.postTitleBlock}>
                    <p className={styles.postTitle}>{post.title}</p>
                    <p className={styles.postSlug}>/{post.slug}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className={styles.categoryBadge}>{post.category}</span>
              </td>
              <td>
                <PostStatusBadge status={post.status} />
              </td>
              <td className={styles.author}>{post.author}</td>
              <td className={styles.date}>{formatDate(post.updatedAt)}</td>
              <td className={styles.views}>{post.views.toLocaleString()}</td>
              <td className={styles.actionsCell}>
                <PostRowActions 
                  onEdit={() => onAction('edit', post.id)}
                  onPreview={() => onAction('preview', post.id)}
                  onDuplicate={() => onAction('duplicate', post.id)}
                  onArchive={() => onAction('archive', post.id)}
                  onDelete={() => onAction('delete', post.id)}
                  onRestore={() => onAction('restore', post.id)}
                  isArchived={isRecoverableStatus(post.status)}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards View */}
      <div className={styles.mobileCardsList}>
        {posts.map(post => (
          <div key={post.id} className={`${styles.mobileCard} ${selectedPosts.includes(post.id) ? styles.selectedCard : ''}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardSelect}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => onSelectPost(post.id, e.target.checked)}
                />
                <PostStatusBadge status={post.status} />
              </div>
              <PostRowActions 
                onEdit={() => onAction('edit', post.id)}
                onPreview={() => onAction('preview', post.id)}
                onDuplicate={() => onAction('duplicate', post.id)}
                onArchive={() => onAction('archive', post.id)}
                onDelete={() => onAction('delete', post.id)}
                onRestore={() => onAction('restore', post.id)}
                isArchived={isRecoverableStatus(post.status)}
              />
            </div>
            
            <div className={styles.cardBody}>
              {post.coverImage && (
                <div className={styles.cardImage}>
                  <img src={post.coverImage} alt={post.title} />
                </div>
              )}
              <div className={styles.cardContent}>
                <h4 className={styles.postTitle}>{post.title}</h4>
                <p className={styles.postSlug}>/{post.slug}</p>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.categoryBadge}>{post.category}</span>
              <span className={styles.date}>{formatDate(post.updatedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsTable;
