import { Link } from 'react-router-dom';
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
        {topPosts.map((post, idx) => (
          <Link to={`${ROUTES.POSTS}/${post.id}`} key={post.id} className={styles.item}>
            <div className={styles.rank}>{idx + 1}</div>
            <div className={styles.info}>
              <h4 className={styles.postTitle}>{post.title}</h4>
              <div className={styles.metrics}>
                <span className={styles.metric}>
                  <span className={styles.icon}>👁️</span>
                  {formatNumber(post.views)}
                </span>
                <span className={styles.metric}>
                  <span className={styles.icon}>👆</span>
                  {formatNumber(post.clicks)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopPostsList;
