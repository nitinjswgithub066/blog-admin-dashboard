import { PageTransition, MotionCard } from '../../components/animations';
import DateTimeCard from '../../components/dashboard/DateTimeCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import SearchTrafficCard from '../../components/dashboard/SearchTrafficCard';
import TopPostsList from '../../components/dashboard/TopPostsList';
import { useProfileStore } from '../../store';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { profile } = useProfileStore();

  return (
    <PageTransition className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {profile.fullName.split(' ')[0]}! 👋</h1>
          <p className={styles.description}>
            Here's what's happening with your blog today.
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Top row */}
        <MotionCard delay={1} className={styles.dateTimeCard}>
          <DateTimeCard />
        </MotionCard>
        
        <MotionCard delay={2} className={styles.trafficCard}>
          <SearchTrafficCard />
        </MotionCard>

        <MotionCard delay={3} className={styles.topPostsCard}>
          <TopPostsList />
        </MotionCard>

        {/* Bottom row */}
        <MotionCard delay={4} className={styles.chartCard}>
          <PerformanceChart />
        </MotionCard>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
