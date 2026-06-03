import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { mockPieChartData } from '../../../data/dashboardData';
import styles from './SearchTrafficCard.module.css';

const COLORS = [
  '#6D5DF6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#3B82F6', '#EC4899', '#14B8A6',
  '#F97316', '#94A3B8',
];

const total = mockPieChartData.reduce((s, d) => s + (d.value ?? 0), 0);

// Render label inside each slice — short name only
const RADIAN = Math.PI / 180;
const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
  if ((percent ?? 0) < 0.05) return null;
  const r = (Number(innerRadius ?? 0) + Number(outerRadius ?? 0)) * 0.55;
  const x = Number(cx ?? 0) + r * Math.cos(-Number(midAngle ?? 0) * RADIAN);
  const y = Number(cy ?? 0) + r * Math.sin(-Number(midAngle ?? 0) * RADIAN);
  const short = String(name ?? '').split(' ')[0].slice(0, 6);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {short}
    </text>
  );
};

const SearchTrafficCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Traffic by Category</h3>
        <p className={styles.subtitle}>{total.toLocaleString()} total views</p>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockPieChartData}
              cx="50%"
              cy="50%"
              innerRadius="38%"
              outerRadius="72%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              labelLine={false}
              label={renderCustomLabel}
            >
              {mockPieChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '12px',
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
              formatter={(value, name) => {
                const v = typeof value === 'number' ? value : 0;
                return [
                  `${((v / total) * 100).toFixed(1)}%  ·  ${v.toLocaleString()} views`,
                  String(name)
                ] as [string, string];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre total */}
        <div className={styles.centreLabel}>
          <span className={styles.centreNumber}>{total.toLocaleString()}</span>
          <span className={styles.centreText}>Views</span>
        </div>
      </div>
    </div>
  );
};

export default SearchTrafficCard;
