/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { TrafficTrendPoint } from '../../../types/statistics.types';
import styles from './TrafficTrendChart.module.css';

interface TrafficTrendChartProps {
  data: TrafficTrendPoint[];
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

const TrafficTrendChart: React.FC<TrafficTrendChartProps> = ({ data }) => {
  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Traffic Trend</h2>
        <p className={styles.subtitle}>Views and clicks over selected period.</p>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#9CA3AF" 
              fontSize={11}
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={11}
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              name="Views" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }}
            />
            <Area 
              type="monotone" 
              dataKey="clicks" 
              name="Clicks" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorClicks)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#8B5CF6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficTrendChart;
