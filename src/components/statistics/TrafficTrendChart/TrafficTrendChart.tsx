import React, { useEffect, useRef, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import type { TrafficTrendPoint } from '../../../types/statistics.types';
import styles from './TrafficTrendChart.module.css';

interface TrafficTrendChartProps {
  data: TrafficTrendPoint[];
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

const TrafficTrendChart: React.FC<TrafficTrendChartProps> = ({ data }) => {
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
        <h2 className={styles.title}>Traffic Trend</h2>
        <p className={styles.subtitle}>Views and clicks over selected period.</p>
      </div>
      
      <div ref={chartRef} className={styles.chartContainer}>
        {canRenderChart && (
          <AreaChart
            width={chartSize.width}
            height={chartSize.height}
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-views)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-views)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-clicks)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-clicks)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }}
            />
            <Area
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="var(--chart-views)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorViews)"
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--chart-views)' }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="var(--chart-clicks)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--chart-clicks)' }}
            />
          </AreaChart>
        )}
      </div>
    </div>
  );
};

export default TrafficTrendChart;
