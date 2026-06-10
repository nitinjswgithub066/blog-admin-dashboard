import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { HiTrendingUp, HiLightBulb, HiStar } from 'react-icons/hi';
import { useDashboardStore } from '../../../store/dashboardStore';
import Skeleton from '../../ui/Skeleton/Skeleton';
import styles from './SearchTrafficCard.module.css';

const COLORS = [
  '#6D5DF6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#3B82F6', '#EC4899', '#14B8A6',
  '#F97316', '#94A3B8',
];

const CHART_SIZE = 220;

const formatShare = (score: number, total: number) => {
  if (total <= 0) return '0%';
  return `${((score / total) * 100).toFixed(1)}%`;
};

const colorClass = (index: number) => styles[`color${index % COLORS.length}` as keyof typeof styles] || '';

type TrendTooltipPayload = Array<{
  value?: number;
  name?: string;
  payload?: {
    totalScore?: number;
  };
}>;

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TrendTooltipPayload }) => {
  if (!active || !payload?.length) return null;

  const value = typeof payload[0]?.value === 'number' ? payload[0].value : 0;
  const totalValue = payload[0]?.payload?.totalScore || 0;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{payload[0]?.name}</div>
      <div className={styles.tooltipValue}>{formatShare(value, totalValue)} - Score: {value.toLocaleString()}</div>
    </div>
  );
};

const SearchTrafficCard = () => {
  const { data, isLoading, error } = useDashboardStore();

  const searchTrends = data?.searchTrends;
  const chartData = searchTrends?.chart || [];
  const total = chartData.reduce((s, d) => s + (d.score ?? 0), 0);
  const chartWithTotal = chartData.map((entry) => ({ ...entry, totalScore: total }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Google Daily Search Trends</h3>
        <p className={styles.subtitle}>
          Category-based search demand to guide your next post
        </p>
      </div>

      {isLoading && !data ? (
        <div className={styles.loadingState}>
          <Skeleton height="150px" width="150px" variant="circular" className={styles.skeletonCenter} />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="100%" />
        </div>
      ) : error ? (
        <div className={styles.messageState}>
          {error}
        </div>
      ) : !searchTrends || chartData.length === 0 ? (
        <div className={styles.emptyState}>
          No trend data yet.
        </div>
      ) : (
        <>
          <div className={styles.chartPanel}>
            <div className={styles.chartArea}>
              <PieChart width={CHART_SIZE} height={CHART_SIZE} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <Pie
                  data={chartWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="score"
                  nameKey="label"
                  stroke="var(--bg-primary)"
                  strokeWidth={2}
                  labelLine={false}
                  label={false}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${entry.category}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>

            <div className={styles.legend} aria-label="Search trend categories">
              {chartData.map((entry, i) => (
                <div key={entry.category} className={styles.legendItem} title={entry.category}>
                  <span className={`${styles.legendDot} ${colorClass(i)}`} />
                  <span className={styles.legendName}>{entry.label}</span>
                  <span className={styles.legendValue}>{formatShare(entry.score, total)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.insights}>
            <div className={styles.insight}>
              <HiStar className={`${styles.insightIcon} ${styles.topIcon}`} />
              <div>
                <div className={styles.insightLabel}>Top Category</div>
                <div className={styles.insightValue}>{searchTrends.topCategory?.category || '-'}</div>
              </div>
            </div>
            <div className={styles.insight}>
              <HiTrendingUp className={`${styles.insightIcon} ${styles.growthIcon}`} />
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
              <HiLightBulb className={`${styles.insightIcon} ${styles.ideaIcon}`} />
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
