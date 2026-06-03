import { PageTransition } from '../../components/animations';
import MotionCard from '../../components/animations/MotionCard';
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
          <p className={styles.description}>Here's what's happening with your blog today.</p>
        </div>
      </header>

      {/* Top row: DateTime + Traffic + TopPosts */}
      <div className={styles.topRow}>
        <MotionCard delay={1} className={styles.dateTimeSlot}>
          <DateTimeCard />
        </MotionCard>

        <MotionCard delay={2} className={styles.trafficSlot}>
          <SearchTrafficCard />
        </MotionCard>

        <MotionCard delay={3} className={styles.topPostsSlot}>
          <TopPostsList />
        </MotionCard>
      </div>

      {/* Bottom row: Performance chart full-width */}
      <MotionCard delay={4} className={styles.chartSlot}>
        <PerformanceChart />
      </MotionCard>
    </PageTransition>
  );
};

export default DashboardPage;
