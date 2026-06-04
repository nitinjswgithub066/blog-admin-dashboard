export type MetricColor = 'purple' | 'blue' | 'green' | 'orange';

export interface StatisticsMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  color: MetricColor;
}

export interface CategoryPerformance {
  category: string;
  views: number;
  clicks: number;
}

export interface TrafficTrendPoint {
  label: string;
  views: number;
  clicks: number;
}

export type PostTrend = 'up' | 'down' | 'stable';

export interface PostStatistic {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  views: number;
  clicks: number;
  readingTime: number;
  shares: number;
  date: string;
  trend: PostTrend;
}

export type StatsFilterPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type StatsFilterCategory = 'all' | 'technology' | 'programming' | 'career';
