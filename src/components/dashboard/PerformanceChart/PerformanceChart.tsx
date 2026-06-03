import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import FilterTabs from '../../ui/FilterTabs';
import type { FilterTab } from '../../ui/FilterTabs';
import {
  mockLineChartDataDaily,
  mockLineChartDataWeekly,
  mockLineChartDataMonthly,
  mockLineChartDataYearly,
} from '../../../data/dashboardData';
import styles from './PerformanceChart.module.css';

type FilterId = 'daily' | 'weekly' | 'monthly' | 'yearly';

const TABS: FilterTab[] = [
  { id: 'daily',   label: 'Daily'   },
  { id: 'weekly',  label: 'Weekly'  },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly',  label: 'Yearly'  },
];

// Each filter has an ordered list of "pages" (time slices)
const DATA_PAGES: Record<FilterId, { label: string; data: typeof mockLineChartDataDaily }[]> = {
  daily:   [
    { label: 'Today',      data: mockLineChartDataDaily  },
    { label: 'Yesterday',  data: mockLineChartDataDaily.map(d => ({ ...d, traffic: d.traffic! * 0.85, clicks: d.clicks! * 0.9 })) },
    { label: '2 days ago', data: mockLineChartDataDaily.map(d => ({ ...d, traffic: d.traffic! * 0.7,  clicks: d.clicks! * 0.75 })) },
  ],
  weekly: [
    { label: 'This week',  data: mockLineChartDataWeekly },
    { label: 'Last week',  data: mockLineChartDataWeekly.map(d => ({ ...d, traffic: d.traffic! * 0.88, clicks: d.clicks! * 0.82 })) },
    { label: '2 wks ago',  data: mockLineChartDataWeekly.map(d => ({ ...d, traffic: d.traffic! * 0.74, clicks: d.clicks! * 0.7 })) },
  ],
  monthly: [
    { label: 'This month', data: mockLineChartDataMonthly },
    { label: 'Last month', data: mockLineChartDataMonthly.map(d => ({ ...d, traffic: d.traffic! * 0.9, clicks: d.clicks! * 0.87 })) },
    { label: '2 mo ago',   data: mockLineChartDataMonthly.map(d => ({ ...d, traffic: d.traffic! * 0.78, clicks: d.clicks! * 0.72 })) },
  ],
  yearly: [
    { label: '2026', data: mockLineChartDataYearly },
    { label: '2025', data: mockLineChartDataYearly.map(d => ({ ...d, traffic: d.traffic! * 0.8, clicks: d.clicks! * 0.78 })) },
    { label: '2024', data: mockLineChartDataYearly.map(d => ({ ...d, traffic: d.traffic! * 0.65, clicks: d.clicks! * 0.6 })) },
  ],
};

const PerformanceChart = () => {
  const [filter, setFilter] = useState<FilterId>('daily');
  const [pageIdx, setPageIdx] = useState(0);

  const pages = DATA_PAGES[filter];
  const current = pages[pageIdx];
  const canPrev = pageIdx < pages.length - 1;
  const canNext = pageIdx > 0;

  const handleFilterChange = (id: string) => {
    setFilter(id as FilterId);
    setPageIdx(0);
  };

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
              onClick={() => setPageIdx(i => i + 1)}
              disabled={!canPrev}
              aria-label="Previous period"
            >
              <MdChevronLeft />
            </button>
            <span className={styles.periodLabel}>{current.label}</span>
            <button
              className={styles.navBtn}
              onClick={() => setPageIdx(i => i - 1)}
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
            data={current.data}
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
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} dy={8} />
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '12px',
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
              formatter={(v) => typeof v === 'number' ? v.toLocaleString() : String(v)}
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
              dot={false} activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area type="monotone" name="Clicks" dataKey="clicks"
              stroke="#10B981" strokeWidth={2.5}
              fill="url(#gradClicks)"
              dot={false} activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
