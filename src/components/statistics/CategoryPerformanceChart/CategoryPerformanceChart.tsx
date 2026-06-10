import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import type { CategoryPerformance } from '../../../types/statistics.types';
import styles from './CategoryPerformanceChart.module.css';

interface CategoryPerformanceChartProps {
  data: CategoryPerformance[];
}

type ChartPayload = Array<{
  color?: string;
  name?: string;
  value?: number;
  dataKey?: string;
}>;

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: ChartPayload; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        {payload.map((entry) => (
          <div key={entry.dataKey || entry.name} className={styles.tooltipRow}>
            <div className={styles.tooltipDot} style={{ background: entry.color }} />
            <span className={styles.tooltipName}>{entry.name}:</span>
            <span className={styles.tooltipValue}>
              {(entry.value || 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CategoryPerformanceChart: React.FC<CategoryPerformanceChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const canRenderChart = chartSize.width > 0 && chartSize.height > 0;

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      setChartSize({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Category Performance</h2>
        <p className={styles.subtitle}>Compare views and clicks by topic.</p>
      </div>
      
      {data.length === 0 ? (
        <div className={styles.emptyState}>No category performance data yet.</div>
      ) : (
        <div ref={chartRef} className={styles.chartContainer}>
          {canRenderChart && (
          <BarChart
            width={chartSize.width}
            height={chartSize.height}
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            />
            <YAxis
              dataKey="category"
              type="category"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-elevated)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }}
            />
            <Bar dataKey="views" name="Views" fill="var(--chart-views)" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="clicks" name="Clicks" fill="var(--chart-clicks)" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="shares" name="Shares" fill="var(--chart-shares)" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPerformanceChart;
