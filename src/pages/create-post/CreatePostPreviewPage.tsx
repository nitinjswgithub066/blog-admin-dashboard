import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiClock, FiEye, FiRefreshCw } from 'react-icons/fi';
import { postService, type PostPreviewResponse } from '../../services/post.service';
import { formatDate } from '../../utils/formatDate';
import styles from './CreatePostPreviewPage.module.css';

const formatViews = (views: number) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toLocaleString();
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
  const coverImage = post?.optimizedCoverUrl || post?.coverImageUrl || '';
  const authorName = 'VEXIRAHUB';
  const authorRole = 'Author';

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
            <div className={styles.heroGlow} aria-hidden="true" />

            <div className={styles.heroContent}>
              <span className={styles.category}>{categoryName}</span>
              <h1 className={styles.previewTitle}>{post.title}</h1>
              {post.subtitle && <p className={styles.previewSubtitle}>{post.subtitle}</p>}

              <div className={styles.metaRow}>
                <div className={styles.author}>
                  {post.author?.avatarUrl ? (
                    <img className={styles.avatarImage} src={post.author.avatarUrl} alt="VEXIRAHUB" />
                  ) : (
                    <div className={styles.avatarInitials} aria-hidden="true">
                      VH
                    </div>
                  )}
                  <div className={styles.authorText}>
                    <span className={styles.authorName}>{authorName}</span>
                    <span className={styles.authorRole}>{authorRole}</span>
                  </div>
                </div>

                <div className={styles.stats}>
                  <span className={styles.stat}>{formatDate(post.createdAt)}</span>
                  <span className={styles.stat}><FiClock aria-hidden="true" /> {post.readingTime} min read</span>
                  <span className={styles.stat}><FiEye aria-hidden="true" /> {formatViews(post.views)} views</span>
                </div>
              </div>
            </div>

            <div className={styles.coverFrame}>
              {coverImage ? (
                <img className={styles.previewCover} src={coverImage} alt={post.title} />
              ) : (
                <div className={styles.coverPlaceholder}>
                  <span>VH</span>
                  <small>{categoryName}</small>
                </div>
              )}
            </div>
          </header>

          <section className={styles.contentWrapper}>
            <div
              className={styles.articleBody}
              dangerouslySetInnerHTML={{ __html: post.contentHtml || '<p>No preview content available.</p>' }}
            />
          </section>
        </article>
      )}
    </div>
  );
};

export default CreatePostPreviewPage;
