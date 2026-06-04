import type { 
  StatisticsMetric, 
  CategoryPerformance, 
  TrafficTrendPoint, 
  PostStatistic 
} from '../types/statistics.types';

export const mockMetrics: Record<string, StatisticsMetric[]> = {
  daily: [
    { id: 'clicks', label: 'Daily Clicks', value: '12.4K', change: 18, color: 'purple' },
    { id: 'views', label: 'Views', value: '41.5K', change: 24, color: 'blue' },
    { id: 'time', label: 'Reading Time', value: '10 min', change: 8, color: 'green' },
    { id: 'shares', label: 'Shares', value: '2.1K', change: 12, color: 'orange' },
  ],
  weekly: [
    { id: 'clicks', label: 'Weekly Clicks', value: '84.2K', change: 14, color: 'purple' },
    { id: 'views', label: 'Views', value: '290.1K', change: 19, color: 'blue' },
    { id: 'time', label: 'Reading Time', value: '11 min', change: -2, color: 'green' },
    { id: 'shares', label: 'Shares', value: '14.5K', change: 22, color: 'orange' },
  ],
  monthly: [
    { id: 'clicks', label: 'Monthly Clicks', value: '345K', change: 32, color: 'purple' },
    { id: 'views', label: 'Views', value: '1.2M', change: 45, color: 'blue' },
    { id: 'time', label: 'Reading Time', value: '12 min', change: 5, color: 'green' },
    { id: 'shares', label: 'Shares', value: '62K', change: 28, color: 'orange' },
  ]
};

export const mockCategoryPerformance: CategoryPerformance[] = [
  { category: 'Technology', views: 85000, clicks: 24000 },
  { category: 'Programming', views: 72000, clicks: 18000 },
  { category: 'AI', views: 120000, clicks: 45000 },
  { category: 'Career', views: 45000, clicks: 12000 },
  { category: 'Startups', views: 65000, clicks: 15000 },
  { category: 'Thoughts', views: 32000, clicks: 8000 },
  { category: 'Reviews', views: 54000, clicks: 14000 },
  { category: 'Web Dev', views: 92000, clicks: 28000 },
];

export const generateTrafficTrend = (period: 'daily' | 'weekly' | 'monthly'): TrafficTrendPoint[] => {
  const labels = period === 'daily' 
    ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
    : period === 'weekly'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  const multiplier = period === 'daily' ? 1 : period === 'weekly' ? 5 : 15;

  return labels.map((label) => ({
    label,
    views: Math.floor(Math.random() * 5000 * multiplier) + (1000 * multiplier),
    clicks: Math.floor(Math.random() * 1000 * multiplier) + (200 * multiplier),
  }));
};

export const mockTopPosts: PostStatistic[] = Array.from({ length: 50 }, (_, i) => {
  const categories = ['AI', 'Technology', 'Programming', 'Career', 'Web Dev'];
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  
  return {
    id: `post-${i + 1}`,
    title: i === 0 ? 'GPT-5 vs Claude 4 vs Gemini 2' : `Awesome Blog Post Topic ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: 'published' as const,
    views: Math.floor(Math.random() * 100000) + 1000,
    clicks: Math.floor(Math.random() * 20000) + 100,
    readingTime: Math.floor(Math.random() * 15) + 3,
    shares: Math.floor(Math.random() * 5000) + 50,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    trend: trends[Math.floor(Math.random() * trends.length)],
  };
}).sort((a, b) => b.views - a.views); // Sort by highest views
