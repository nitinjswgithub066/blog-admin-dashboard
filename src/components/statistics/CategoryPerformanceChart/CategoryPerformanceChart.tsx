/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { CategoryPerformance } from '../../../types/statistics.types';
import styles from './CategoryPerformanceChart.module.css';

interface CategoryPerformanceChartProps {
  data: CategoryPerformance[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className={styles.tooltipRow}>
            <div className={styles.tooltipDot} style={{ background: entry.color }} />
            <span className={styles.tooltipName}>{entry.name}:</span>
            <span className={styles.tooltipValue}>
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CategoryPerformanceChart: React.FC<CategoryPerformanceChartProps> = ({ data }) => {
  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Category Performance</h2>
        <p className={styles.subtitle}>Compare views and clicks by topic.</p>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              stroke="#9CA3AF" 
              fontSize={11}
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            />
            <YAxis 
              dataKey="category" 
              type="category" 
              stroke="#9CA3AF" 
              fontSize={11}
              tickLine={false} 
              axisLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
            />
            <Bar dataKey="views" name="Views" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="clicks" name="Clicks" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryPerformanceChart;
