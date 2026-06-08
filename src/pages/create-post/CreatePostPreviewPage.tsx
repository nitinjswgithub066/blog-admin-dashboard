import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiClock, FiEye, FiRefreshCw } from 'react-icons/fi';
import { postService, type PostPreviewResponse } from '../../services/post.service';
import { formatDate } from '../../utils/formatDate';
import styles from './CreatePostPreviewPage.module.css';

const categoryInitials: Record<string, string> = {
  technology: 'TE',
  ai: 'AI',
  'web development': 'WD',
  thoughts: 'TH',
};

const getCategoryInitials = (category?: string) => {
  if (!category) return 'PO';
  const normalized = category.trim().toLowerCase();
  if (categoryInitials[normalized]) return categoryInitials[normalized];
  return category
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PO';
};

const CreatePostPreviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostPreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPreview = async () => {
      if (!id) {
        setError('Post id is missing.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await postService.getPostPreview(id);
        if (isMounted) {
          setPost(data);
          setError('');
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load preview.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const categoryName = post?.category?.name || 'Uncategorized';

  return (
    <div className={styles.previewPage}>
      <div className={styles.previewToolbar}>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <span className={styles.previewBadge}>Preview</span>
      </div>

      {isLoading && (
        <div className={styles.stateBox}>
          <FiRefreshCw className={styles.spinIcon} />
          <span>Loading preview...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className={`${styles.stateBox} ${styles.errorBox}`}>
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && post && (
        <article className={styles.article}>
          {post.contentCss && <style>{post.contentCss}</style>}

          <header className={styles.hero}>
            <div className={styles.coverFrame}>
              {post.optimizedCoverUrl || post.coverImageUrl ? (
                <img src={post.optimizedCoverUrl || post.coverImageUrl || ''} alt={post.title} />
              ) : (
                <div className={styles.coverPlaceholder}>{getCategoryInitials(categoryName)}</div>
              )}
            </div>

            <div className={styles.heroContent}>
              <span className={styles.category}>{categoryName}</span>
              <h1>{post.title}</h1>
              {post.subtitle && <p className={styles.subtitle}>{post.subtitle}</p>}

              <div className={styles.metaRow}>
                <span>{post.author?.name || 'Admin'}</span>
                <span>{formatDate(post.createdAt)}</span>
                <span><FiClock /> {post.readingTime} min read</span>
                <span><FiEye /> {post.views}</span>
              </div>
            </div>
          </header>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '<p>No preview content available.</p>' }}
          />
        </article>
      )}
    </div>
  );
};

export default CreatePostPreviewPage;
