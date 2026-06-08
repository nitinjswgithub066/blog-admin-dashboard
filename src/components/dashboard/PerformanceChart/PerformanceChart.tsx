/* eslint-disable */
import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import FilterTabs from '../../ui/FilterTabs';
import type { FilterTab } from '../../ui/FilterTabs';
import { dashboardService } from '../../../services/dashboard.service';
import type { BlogPerformanceResponse } from '../../../services/dashboard.service';
import styles from './PerformanceChart.module.css';
import Skeleton from '../../ui/Skeleton/Skeleton';

type FilterId = 'daily' | 'weekly' | 'monthly' | 'yearly';

const TABS: FilterTab[] = [
  { id: 'daily',   label: 'Daily'   },
  { id: 'weekly',  label: 'Weekly'  },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly',  label: 'Yearly'  },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{data.label}</p>
        <div className={styles.tooltipMetrics}>
          <div className={styles.tooltipRow}>
            <span className={`${styles.tooltipDot} ${styles.clicksDot}`}></span>
            <span className={styles.tooltipName}>Clicks:</span>
            <span className={styles.tooltipValue}>
              {payload.find((p: any) => p.dataKey === 'clicks')?.value?.toLocaleString() || 0}
            </span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={`${styles.tooltipDot} ${styles.trafficDot}`}></span>
            <span className={styles.tooltipName}>Traffic:</span>
            <span className={styles.tooltipValue}>
              {payload.find((p: any) => p.dataKey === 'traffic')?.value?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceChart = () => {
  const [filter, setFilter] = useState<FilterId>('daily');
  const [currentDate, setCurrentDate] = useState<string | undefined>(undefined);
  const [performanceData, setPerformanceData] = useState<BlogPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = async (range: string, dateStr?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getBlogPerformance(range, dateStr);
      setPerformanceData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance(filter, currentDate);
    
    // Polling intervals
    const intervalMs = filter === 'daily' ? 60000 : 120000;
    const intervalId = setInterval(() => {
      fetchPerformance(filter, currentDate);
    }, intervalMs);
    
    return () => clearInterval(intervalId);
  }, [filter, currentDate]);

  const handleFilterChange = (id: string) => {
    setFilter(id as FilterId);
    setCurrentDate(undefined); // reset to latest when changing filter
  };

  const handlePrev = () => {
    if (performanceData?.navigation.previousDate) {
      setCurrentDate(performanceData.navigation.previousDate);
    }
  };

  const handleNext = () => {
    if (performanceData?.navigation.nextDate) {
      setCurrentDate(performanceData.navigation.nextDate);
    }
  };

  const activeTicks = useMemo(() => {
    if (!performanceData) return [];
    const rawTicks = performanceData.series.filter(d => d.label !== '').map(d => d.label);
    
    // For daily range with 24 hours, only show every 4th hour to prevent label overlapping
    if (performanceData.range === 'daily' && rawTicks.length > 12) {
      return rawTicks.filter((_, idx) => idx % 4 === 0 || idx === rawTicks.length - 1);
    }
    return rawTicks;
  }, [performanceData]);

  return (
    <div className={styles.performanceCard}>
      <div className={styles.performanceHeader}>
        <div>
          <h2 className={styles.title}>Blog Performance</h2>
          <p className={styles.subtitle}>Traffic and engagement over time</p>
        </div>

        <div className={styles.performanceControls}>
          <div className={styles.periodControl}>
            <button
              className={styles.navBtn}
              onClick={handlePrev}
              disabled={!performanceData?.navigation.previousDate || loading}
              aria-label="Previous period"
            >
              <MdChevronLeft />
            </button>
            <span className={styles.periodLabel}>
              {loading && !performanceData ? 'Loading...' : (performanceData?.currentLabel || '...')}
            </span>
            <button
              className={styles.navBtn}
              onClick={handleNext}
              disabled={!performanceData?.navigation.nextDate || loading}
              aria-label="Next period"
            >
              <MdChevronRight />
            </button>
          </div>

          <div className={styles.filterTabs}>
            <FilterTabs
              tabs={TABS}
              activeTabId={filter}
              onTabChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {loading && !performanceData ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : error ? (
          <div className={styles.errorState}>{error}</div>
        ) : performanceData ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={performanceData.series}
            margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6D5DF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6D5DF6" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#9CA3AF" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={8}
              ticks={activeTicks}
              interval={0}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              isAnimationActive={false}
            />
            <Legend
              verticalAlign="top"
              height={28}
              iconType="circle"
            />

            <Area type="monotone" name="Traffic" dataKey="traffic"
              stroke="#6D5DF6" strokeWidth={2.5}
              fill="url(#gradTraffic)"
              dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#6D5DF6' }}
            />
            <Area type="monotone" name="Clicks" dataKey="clicks"
              stroke="#10B981" strokeWidth={2.5}
              fill="url(#gradClicks)"
              dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#10B981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
};

export default PerformanceChart;
