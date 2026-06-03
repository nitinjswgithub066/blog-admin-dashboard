import { Link } from 'react-router-dom';
import { HiEye, HiCursorClick, HiTrendingUp } from 'react-icons/hi';
import { usePostStore } from '../../../store';
import { formatNumber } from '../../../utils';
import { ROUTES } from '../../../constants';
import styles from './TopPostsList.module.css';

const TopPostsList = () => {
  const { posts } = usePostStore();
  const topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Top Performing Posts</h3>
      <div className={styles.list}>
        {topPosts.map((post, idx) => {
          const isTop = idx === 0;
          return (
            <Link 
              to={`${ROUTES.POSTS}/${post.id}`} 
              key={post.id} 
              className={`${styles.item} ${isTop ? styles.topItem : ''}`}
            >
              <div className={`${styles.rank} ${isTop ? styles.topRank : ''}`}>
                {idx + 1}
              </div>
              
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <h4 className={styles.postTitle} title={post.title}>
                    {post.title}
                  </h4>
                  {isTop && (
                    <span className={styles.trendBadge}>
                      <HiTrendingUp /> +14%
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
    </div>
  );
};

export default TopPostsList;
