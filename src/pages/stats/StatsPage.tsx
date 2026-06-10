import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import styles from './StatsPage.module.css';

import MetricCircleCard from '../../components/statistics/MetricCircleCard/MetricCircleCard';
import CategoryPerformanceChart from '../../components/statistics/CategoryPerformanceChart/CategoryPerformanceChart';
import TrafficTrendChart from '../../components/statistics/TrafficTrendChart/TrafficTrendChart';
import TopPostStatsList from '../../components/statistics/TopPostStatsList/TopPostStatsList';
import DropdownSelect from '../../components/ui/DropdownSelect/DropdownSelect';
import { postService, type ApiCategory } from '../../services/post.service';
import { statisticsService } from '../../services/statistics.service';
import type {
  CategoryPerformance,
  PostStatistic,
  StatisticsExportFormat,
  StatisticsExportSections,
  StatisticsMetric,
  StatisticsOverview,
  StatisticsRange,
  StatisticsSort,
  TrafficTrendPoint,
} from '../../types/statistics.types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const emptyOverview: StatisticsOverview = {
  clicks: { value: 0, label: 'Daily Clicks', growth: 0, trend: 'stable' },
  views: { value: 0, label: 'Views', growth: 0, trend: 'stable' },
  readingTime: { value: 0, unit: 'min', label: 'Reading Time', growth: 0, trend: 'stable' },
  shares: { value: 0, label: 'Shares', growth: 0, trend: 'stable' },
};

const formatMetricValue = (value: number, unit?: string) => {
  const formatted = value >= 1000000
    ? `${(value / 1000000).toFixed(1)}M`
    : value >= 1000
      ? `${(value / 1000).toFixed(1)}K`
      : value.toLocaleString();

  return unit ? `${formatted} ${unit}` : formatted;
};

const overviewToMetrics = (overview: StatisticsOverview): StatisticsMetric[] => [
  {
    id: 'clicks',
    label: overview.clicks.label,
    value: formatMetricValue(overview.clicks.value),
    change: overview.clicks.growth,
    trend: overview.clicks.trend,
    color: 'purple',
  },
  {
    id: 'views',
    label: overview.views.label,
    value: formatMetricValue(overview.views.value),
    change: overview.views.growth,
    trend: overview.views.trend,
    color: 'blue',
  },
  {
    id: 'time',
    label: overview.readingTime.label,
    value: formatMetricValue(overview.readingTime.value, overview.readingTime.unit),
    change: overview.readingTime.growth,
    trend: overview.readingTime.trend,
    color: 'green',
  },
  {
    id: 'shares',
    label: overview.shares.label,
    value: formatMetricValue(overview.shares.value),
    change: overview.shares.growth,
    trend: overview.shares.trend,
    color: 'orange',
  },
];

const exportFormats: Array<{ value: StatisticsExportFormat; label: string; note?: string }> = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'google_sheet', label: 'Google Sheet', note: 'Google Sheet export requires Google Sheets API setup.' },
  { value: 'pdf', label: 'PDF / Report with charts' },
];

const exportSectionOptions: Array<{ key: keyof StatisticsExportSections; label: string }> = [
  { key: 'overview', label: 'Overview Summary' },
  { key: 'trafficTrend', label: 'Traffic Trend' },
  { key: 'categoryPerformance', label: 'Category Performance' },
  { key: 'topPosts', label: 'Top Post Performance' },
  { key: 'charts', label: 'Include chart visuals if available' },
];

const defaultExportSections: StatisticsExportSections = {
  overview: true,
  trafficTrend: true,
  categoryPerformance: true,
  topPosts: true,
  charts: true,
};

const StatsPage: React.FC = () => {
  const [range, setRange] = useState<StatisticsRange>('daily');
  const [sort, setSort] = useState<StatisticsSort>('most_viewed');
  const [categoryId, setCategoryId] = useState('all');
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const [overview, setOverview] = useState<StatisticsOverview>(emptyOverview);
  const [trafficData, setTrafficData] = useState<TrafficTrendPoint[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [topPosts, setTopPosts] = useState<PostStatistic[]>([]);
  const [topPostPage, setTopPostPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<StatisticsExportFormat>('csv');
  const [exportSections, setExportSections] = useState<StatisticsExportSections>(defaultExportSections);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const metricCards = useMemo(() => overviewToMetrics(overview), [overview]);

  const showToast = (message: string) => {
    setToastMsg(message);
    window.setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchStatistics = useCallback(async (page = 1, append = false) => {
    if (append) setIsLoadingMore(true);
    else {
      setIsLoading(true);
      setError('');
    }

    try {
      const data = await statisticsService.getStatistics({
        range,
        categoryId,
        sort,
        page,
        limit: 15,
      });

      setOverview(data.overview);
      setTrafficData(data.trafficTrend.series);
      setCategoryPerformance(data.categoryPerformance);
      setTopPosts((current) => append ? [...current, ...data.topPosts.items] : data.topPosts.items);
      setTopPostPage(data.topPosts.pagination.page);
      setHasMore(data.topPosts.pagination.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [categoryId, range, sort]);

  useEffect(() => {
    postService.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const initialFetch = window.setTimeout(() => {
      fetchStatistics(1, false);
    }, 0);

    const interval = window.setInterval(() => {
      fetchStatistics(1, false);
    }, 30000);

    return () => {
      window.clearTimeout(initialFetch);
      window.clearInterval(interval);
    };
  }, [fetchStatistics]);

  const handleRangeChange = (nextRange: StatisticsRange) => {
    setTopPosts([]);
    setTopPostPage(1);
    setRange(nextRange);
  };

  const handleSortChange = (nextSort: StatisticsSort) => {
    setTopPosts([]);
    setTopPostPage(1);
    setSort(nextSort);
  };

  const handleCategoryChange = (nextCategoryId: string) => {
    setTopPosts([]);
    setTopPostPage(1);
    setCategoryId(nextCategoryId);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchStatistics(topPostPage + 1, true);
  };

  const toggleExportSection = (section: keyof StatisticsExportSections) => {
    setExportSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const getFileNameFromResponse = (response: Response) => {
    const disposition = response.headers.get('content-disposition');
    const match = disposition?.match(/filename="?([^"]+)"?/i);
    if (match?.[1]) return match[1];

    const extension = exportFormat === 'excel' ? 'xlsx' : exportFormat === 'pdf' ? 'pdf' : 'csv';
    return `vexirahub-statistics-${range}.${extension}`;
  };

  const handleExportReport = async () => {
    if (exportFormat === 'google_sheet') {
      showToast('Google Sheet export requires Google Sheets API setup.');
      return;
    }

    setIsExporting(true);

    try {
      const response = await statisticsService.exportStatisticsReport({
        range,
        categoryId,
        sort,
        format: exportFormat,
        sections: exportSections,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await response.json();
          throw new Error(json.message || 'Failed to export statistics report.');
        }
        throw new Error('Failed to export statistics report.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileNameFromResponse(response);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setIsExportOpen(false);
      showToast('Statistics report exported successfully.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to export statistics report.');
    } finally {
      setIsExporting(false);
    }
  };

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
        <button type="button" className={styles.exportBtn} onClick={() => setIsExportOpen(true)}>
          Export Report
        </button>
      </header>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterTab} ${range === 'daily' ? styles.active : ''}`}
          onClick={() => handleRangeChange('daily')}
        >
          Daily
        </button>
        <button
          className={`${styles.filterTab} ${range === 'weekly' ? styles.active : ''}`}
          onClick={() => handleRangeChange('weekly')}
        >
          Weekly
        </button>
        <button
          className={`${styles.filterTab} ${range === 'monthly' ? styles.active : ''}`}
          onClick={() => handleRangeChange('monthly')}
        >
          Monthly
        </button>
        <DropdownSelect
          className={styles.categoryDropdown}
          triggerClassName={`${styles.categoryTrigger} ${categoryId !== 'all' ? styles.active : ''}`}
          options={[
            { label: 'All Categories', value: 'all' },
            ...categories.map((category) => ({ label: category.name, value: category.id })),
          ]}
          value={categoryId}
          onChange={handleCategoryChange}
        />
        <button
          className={`${styles.filterTab} ${sort === 'most_viewed' ? styles.active : ''}`}
          onClick={() => handleSortChange('most_viewed')}
        >
          Most Viewed
        </button>
        <button
          className={`${styles.filterTab} ${sort === 'most_shared' ? styles.active : ''}`}
          onClick={() => handleSortChange('most_shared')}
        >
          Most Shared
        </button>
      </div>

      {error && <div className={styles.errorState}>{error}</div>}

      <motion.div
        className={styles.metricsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={range + categoryId + sort}
      >
        {metricCards.map((metric) => (
          <motion.div key={metric.id} variants={itemVariants}>
            <MetricCircleCard metric={metric} />
          </motion.div>
        ))}
      </motion.div>

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
          <CategoryPerformanceChart data={categoryPerformance} />
        </motion.div>
      </motion.div>

      <motion.div
        key={sort + categoryId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className={styles.loadingState}>Loading statistics...</div>
        ) : (
          <TopPostStatsList
            posts={topPosts}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </motion.div>

      {isExportOpen && (
        <div className={styles.dialogBackdrop} role="presentation">
          <div className={styles.exportDialog} role="dialog" aria-modal="true" aria-labelledby="export-statistics-title">
            <div className={styles.dialogHeader}>
              <div>
                <h2 id="export-statistics-title">Export Statistics Report</h2>
                <p>Choose the format and data sections you want to export.</p>
              </div>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setIsExportOpen(false)}
                aria-label="Close export dialog"
              >
                <FiX />
              </button>
            </div>

            <div className={styles.dialogSection}>
              <h3>Format</h3>
              <div className={styles.exportOptions}>
                {exportFormats.map((format) => (
                  <label
                    key={format.value}
                    className={`${styles.exportOption} ${exportFormat === format.value ? styles.exportOptionActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="statisticsExportFormat"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={() => setExportFormat(format.value)}
                    />
                    <span>{format.label}</span>
                    {format.note && <small>{format.note}</small>}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.dialogSection}>
              <h3>Data Sections</h3>
              <div className={styles.sectionOptions}>
                {exportSectionOptions.map((section) => (
                  <label key={section.key} className={styles.sectionOption}>
                    <input
                      type="checkbox"
                      checked={exportSections[section.key]}
                      onChange={() => toggleExportSection(section.key)}
                    />
                    <span>{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.dialogActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setIsExportOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleExportReport} disabled={isExporting}>
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className={styles.toast} role="status">
          {toastMsg}
        </div>
      )}
    </motion.div>
  );
};

export default StatsPage;
