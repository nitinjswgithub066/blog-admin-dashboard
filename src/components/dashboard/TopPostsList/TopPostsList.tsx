import { Link } from 'react-router-dom';
import { HiEye, HiCursorClick, HiTrendingUp } from 'react-icons/hi';
import { useDashboardStore } from '../../../store/dashboardStore';
import { formatNumber } from '../../../utils';
import { ROUTES } from '../../../constants';
import Skeleton from '../../ui/Skeleton/Skeleton';
import styles from './TopPostsList.module.css';

const TopPostsList = () => {
  const { data, isLoading, error } = useDashboardStore();
  
  const topPosts = data?.topPosts || [];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Top Performing Posts</h3>
      
      {isLoading && !data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height="60px" width="100%" variant="rectangular" />
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          {error}
        </div>
      ) : topPosts.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', margin: 'auto' }}>
          No post performance data yet. Publish posts to start tracking performance.
        </div>
      ) : (
        <div className={styles.list}>
          {topPosts.map((post) => {
            const isTop = post.isTrending;
            return (
              <Link 
                to={`${ROUTES.POSTS}/${post.id}`} 
                key={post.id} 
                className={`${styles.item} ${isTop ? styles.topItem : ''}`}
              >
                <div className={`${styles.rank} ${isTop ? styles.topRank : ''}`}>
                  {post.rank}
                </div>
                
                <div className={styles.info}>
                  <div className={styles.titleRow}>
                    <h4 className={styles.postTitle} title={post.title}>
                      {post.title}
                    </h4>
                    {isTop && (
                      <span className={styles.trendBadge}>
                        <HiTrendingUp /> {post.growth > 0 ? `+${post.growth.toFixed(0)}%` : 'Trending'}
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.metaRow}>
                    <span className={styles.categoryBadge}>{post.category}</span>
                    
                    <div className={styles.metrics}>
                      <span className={styles.metric}>
                        <HiEye className={styles.metricIcon} />
                        {formatNumber(post.views)}
                      </span>
                      <span className={styles.metric}>
                        <HiCursorClick className={styles.metricIcon} />
                        {formatNumber(post.clicks)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopPostsList;
