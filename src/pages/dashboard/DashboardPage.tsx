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
          <h1 className={styles.title}>
            Welcome back, {profile.fullName.split(' ')[0]}! 👋
          </h1>
          <p className={styles.description}>
            Here's what's happening with your blog today.
          </p>
        </div>
      </header>

      {/* ── Row 1: 3 equal-height cards ── */}
      <div className={styles.topRow}>
        <MotionCard delay={1} className={styles.cardSlot}>
          <DateTimeCard />
        </MotionCard>

        <MotionCard delay={2} className={styles.cardSlot}>
          <SearchTrafficCard />
        </MotionCard>

        <MotionCard delay={3} className={styles.cardSlot}>
          <TopPostsList />
        </MotionCard>
      </div>

      {/* ── Row 2: Full-width chart ── */}
      <MotionCard delay={4} className={styles.chartSlot}>
        <PerformanceChart />
      </MotionCard>
    </PageTransition>
  );
};

export default DashboardPage;
