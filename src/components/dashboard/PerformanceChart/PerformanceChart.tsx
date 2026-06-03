import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Card from '../../ui/Card';
import FilterTabs from '../../ui/FilterTabs';
import type { FilterTab } from '../../ui/FilterTabs';
import {
  mockLineChartDataDaily,
  mockLineChartDataWeekly,
  mockLineChartDataMonthly
} from '../../../data/dashboardData';
import styles from './PerformanceChart.module.css';

const TABS: FilterTab[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' }
];

const PerformanceChart: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('weekly');

  const getChartData = () => {
    switch (activeFilter) {
      case 'daily':
        return mockLineChartDataDaily;
      case 'monthly':
        return mockLineChartDataMonthly;
      case 'weekly':
      default:
        return mockLineChartDataWeekly;
    }
  };

  return (
    <Card padding="large">
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>Blog Performance</h2>
          <p className={styles.subtitle}>Traffic and engagement metrics over time</p>
        </div>
        <FilterTabs
          tabs={TABS}
          activeTabId={activeFilter}
          onTabChange={setActiveFilter}
        />
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={getChartData()}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#071120',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#F5F7FA'
              }}
              itemStyle={{ color: '#F5F7FA' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
            />
            <Line
              type="monotone"
              name="Traffic"
              dataKey="traffic"
              stroke="#6D5DF6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6D5DF6', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              name="Clicks"
              dataKey="clicks"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;
