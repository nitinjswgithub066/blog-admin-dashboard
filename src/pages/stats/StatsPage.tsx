import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './StatsPage.module.css';

import MetricCircleCard from '../../components/statistics/MetricCircleCard/MetricCircleCard';
import CategoryPerformanceChart from '../../components/statistics/CategoryPerformanceChart/CategoryPerformanceChart';
import TrafficTrendChart from '../../components/statistics/TrafficTrendChart/TrafficTrendChart';
import TopPostStatsList from '../../components/statistics/TopPostStatsList/TopPostStatsList';

import { 
  mockMetrics, 
  mockCategoryPerformance, 
  generateTrafficTrend, 
  mockTopPosts 
} from '../../data/statisticsData';

type FilterPeriod = 'daily' | 'weekly' | 'monthly';
type SortOrder = 'views' | 'shares';

const CATEGORIES = ['Technology', 'Programming', 'AI', 'Career', 'Startups', 'Web Dev'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const StatsPage: React.FC = () => {
  const [period, setPeriod] = useState<FilterPeriod>('daily');
  const [sortBy, setSortBy] = useState<SortOrder>('views');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Get data based on selected period
  const metrics = mockMetrics[period] || mockMetrics.daily;
  const trafficData = useMemo(() => generateTrafficTrend(period), [period]);

  // Filter and sort posts
  const processedPosts = useMemo(() => {
    let result = [...mockTopPosts];
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    return result;
  }, [sortBy, categoryFilter]);

  return (
    <motion.div
      className={styles.statisticsPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog Statistics</h1>
          <p className={styles.pageDescription}>
            Track blog traffic, engagement, reading time, and shares.
          </p>
        </div>
        <button className={styles.exportBtn}>Export Report</button>
      </header>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <button 
          className={`${styles.filterTab} ${period === 'daily' ? styles.active : ''}`}
          onClick={() => setPeriod('daily')}
        >
          Daily
        </button>
        <button 
          className={`${styles.filterTab} ${period === 'weekly' ? styles.active : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`${styles.filterTab} ${period === 'monthly' ? styles.active : ''}`}
          onClick={() => setPeriod('monthly')}
        >
          Monthly
        </button>
        <select 
          className={`${styles.filterTab} ${categoryFilter ? styles.active : ''}`}
          value={categoryFilter || ''}
          onChange={(e) => setCategoryFilter(e.target.value || null)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button 
          className={`${styles.filterTab} ${sortBy === 'views' ? styles.active : ''}`}
          onClick={() => setSortBy('views')}
        >
          Most Viewed
        </button>
        <button 
          className={`${styles.filterTab} ${sortBy === 'shares' ? styles.active : ''}`}
          onClick={() => setSortBy('shares')}
        >
          Most Shared
        </button>
      </div>

      {/* Metrics Grid */}
      <motion.div 
        className={styles.metricsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={period} // Re-animate when period changes
      >
        {metrics.map((metric) => (
          <motion.div key={metric.id} variants={itemVariants}>
            <MetricCircleCard metric={metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div 
        className={styles.chartsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <TrafficTrendChart data={trafficData} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CategoryPerformanceChart data={mockCategoryPerformance} />
        </motion.div>
      </motion.div>

      {/* Top Posts */}
      <motion.div 
        key={sortBy + (categoryFilter || '')}
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <TopPostStatsList posts={processedPosts} />
      </motion.div>
    </motion.div>
  );
};

export default StatsPage;
