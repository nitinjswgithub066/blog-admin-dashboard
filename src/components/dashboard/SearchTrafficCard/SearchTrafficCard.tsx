import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { HiTrendingUp, HiLightBulb, HiStar } from 'react-icons/hi';
import { useMediaQuery } from '../../../hooks';
import { useDashboardStore } from '../../../store/dashboardStore';
import Skeleton from '../../ui/Skeleton/Skeleton';
import styles from './SearchTrafficCard.module.css';

const COLORS = [
  '#6D5DF6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#3B82F6', '#EC4899', '#14B8A6',
  '#F97316', '#94A3B8',
];

const RADIAN = Math.PI / 180;
const renderLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
  if ((percent ?? 0) < 0.07) return null;
  const r = (Number(innerRadius ?? 0) + Number(outerRadius ?? 0)) * 0.5;
  const x = Number(cx ?? 0) + r * Math.cos(-Number(midAngle ?? 0) * RADIAN);
  const y = Number(cy ?? 0) + r * Math.sin(-Number(midAngle ?? 0) * RADIAN);
  
  // Name is already formatted by backend (e.g. AI, Web Dev), but we can fallback just in case
  const short = String(name ?? '').slice(0, 15);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle"
      dominantBaseline="central" fontSize={10} fontWeight={600}>
      {short}
    </text>
  );
};

const SearchTrafficCard = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { data, isLoading, error } = useDashboardStore();

  const searchTrends = data?.searchTrends;
  const chartData = searchTrends?.chart || [];
  const total = chartData.reduce((s, d) => s + (d.score ?? 0), 0);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Google Daily Search Trends</h3>
        <p className={styles.subtitle}>
          Category-based search demand to guide your next post
        </p>
      </div>

      {isLoading && !data ? (
        <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <Skeleton height="150px" width="150px" variant="circular" className={styles.skeletonCenter} />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="100%" />
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          {error}
        </div>
      ) : !searchTrends || chartData.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', margin: 'auto' }}>
          No trend data yet.
        </div>
      ) : (
        <>
          {/* Donut chart */}
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="70%"
                  paddingAngle={2}
                  dataKey="score"
                  nameKey="label"
                  stroke="none"
                  labelLine={false}
                  label={!isMobile ? renderLabel : false}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary, #0d1f38)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value, name) => {
                    const v = typeof value === 'number' ? value : 0;
                    return [
                      `${((v / total) * 100).toFixed(1)}%  ·  Score: ${v.toLocaleString()}`,
                      String(name),
                    ] as [string, string];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mobile-only compact legend */}
          {isMobile && (
            <div className={styles.mobileLegend}>
              {chartData.map((entry, i) => (
                <div key={entry.category} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: COLORS[i % COLORS.length] }} />
                  <span className={styles.legendName}>{entry.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Insight strip */}
          <div className={styles.insights}>
            <div className={styles.insight}>
              <HiStar className={styles.insightIcon} style={{ color: '#F59E0B' }} />
              <div>
                <div className={styles.insightLabel}>Top Category</div>
                <div className={styles.insightValue}>{searchTrends.topCategory?.category || '-'}</div>
              </div>
            </div>
            <div className={styles.insight}>
              <HiTrendingUp className={styles.insightIcon} style={{ color: '#10B981' }} />
              <div>
                <div className={styles.insightLabel}>Fastest Growing</div>
                <div className={styles.insightValue}>
                  {searchTrends.fastestGrowing?.category || '-'}
                  {searchTrends.fastestGrowing && (
                    <span className={styles.pct}>+{searchTrends.fastestGrowing.growth.toFixed(0)}%</span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.insight}>
              <HiLightBulb className={styles.insightIcon} style={{ color: '#6D5DF6' }} />
              <div>
                <div className={styles.insightLabel}>Suggested Next</div>
                <div className={styles.insightValue} title={searchTrends.suggestedNext?.reason}>
                  {searchTrends.suggestedNext?.title || '-'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchTrafficCard;
