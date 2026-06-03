/* eslint-disable */
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import FilterTabs from '../../ui/FilterTabs';
import type { FilterTab } from '../../ui/FilterTabs';
import {
  generateDailyData,
  generateWeeklyData,
  generateMonthlyData,
  generateYearlyData,
} from '../../../data/dashboardData';
import styles from './PerformanceChart.module.css';

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
        <p className={styles.tooltipLabel}>{data.timestamp}</p>
        <div className={styles.tooltipMetrics}>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: '#10B981' }}></span>
            <span className={styles.tooltipName}>Clicks:</span>
            <span className={styles.tooltipValue}>
              {payload.find((p: any) => p.dataKey === 'clicks')?.value?.toLocaleString() || 0}
            </span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: '#6D5DF6' }}></span>
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
  const [offset, setOffset] = useState(0);

  const handleFilterChange = (id: string) => {
    setFilter(id as FilterId);
    setOffset(0);
  };

  const { data, label, canPrev, canNext } = useMemo(() => {
    let d;
    let l = '';
    let p = true;
    const n = offset > 0;

    switch (filter) {
      case 'daily':
        d = generateDailyData(offset);
        l = offset === 0 ? 'Today' : offset === 1 ? 'Yesterday' : `${offset} days ago`;
        p = offset < 7;
        break;
      case 'weekly':
        d = generateWeeklyData(offset);
        l = offset === 0 ? 'This Week' : offset === 1 ? 'Previous Week' : `${offset} Weeks Ago`;
        p = offset < 12; // Arbitrary limit for mock data
        break;
      case 'monthly':
        d = generateMonthlyData(offset);
        l = offset === 0 ? 'This Month' : offset === 1 ? 'Previous Month' : `${offset} Months Ago`;
        p = offset < 12; // Arbitrary limit for mock data
        break;
      case 'yearly':
        d = generateYearlyData(offset);
        l = offset === 0 ? 'This Year' : 'Previous Year';
        p = offset < 1; // Only this year and previous year
        break;
    }

    return { data: d, label: l, canPrev: p, canNext: n };
  }, [filter, offset]);

  // Extract clean ticks that we want to show on the X-axis
  const activeTicks = useMemo(() => {
    return data.filter(d => d.name !== '').map(d => d.name);
  }, [data]);

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
              onClick={() => setOffset(i => i + 1)}
              disabled={!canPrev}
              aria-label="Previous period"
            >
              <MdChevronLeft />
            </button>
            <span className={styles.periodLabel}>{label}</span>
            <button
              className={styles.navBtn}
              onClick={() => setOffset(i => i - 1)}
              disabled={!canNext}
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
              dataKey="name" 
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
              wrapperStyle={{ fontSize: '11px', color: '#9CA3AF', paddingBottom: '8px' }}
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
      </div>
    </div>
  );
};

export default PerformanceChart;
