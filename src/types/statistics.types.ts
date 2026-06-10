export type MetricColor = 'purple' | 'blue' | 'green' | 'orange';
export type StatisticsRange = 'daily' | 'weekly' | 'monthly';
export type StatisticsSort = 'most_viewed' | 'most_shared';
export type StatisticsExportFormat = 'csv' | 'excel' | 'google_sheet' | 'pdf';
export type PostTrend = 'up' | 'down' | 'stable';

export interface StatisticsMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  color: MetricColor;
  trend?: PostTrend;
}

export interface CategoryPerformance {
  categoryId?: string;
  category: string;
  views: number;
  clicks: number;
  shares?: number;
  growth?: number;
  trend?: PostTrend;
}

export interface TrafficTrendPoint {
  label: string;
  views: number;
  clicks: number;
}

export interface PostStatistic {
  rank?: number;
  id: string;
  title: string;
  slug?: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED' | 'DELETED' | 'published' | 'draft' | 'scheduled' | 'archived';
  views: number;
  clicks: number;
  readingTime: number;
  shares: number;
  growth?: number;
  date?: string;
  trend: PostTrend;
}

export interface StatisticsOverviewMetric {
  value: number;
  label: string;
  growth: number;
  trend: PostTrend;
  unit?: string;
}

export interface StatisticsOverview {
  clicks: StatisticsOverviewMetric;
  views: StatisticsOverviewMetric;
  readingTime: StatisticsOverviewMetric;
  shares: StatisticsOverviewMetric;
}

export interface TrafficTrendResponse {
  range: StatisticsRange;
  series: TrafficTrendPoint[];
}

export interface TopPostPerformanceResponse {
  items: PostStatistic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface StatisticsResponse {
  overview: StatisticsOverview;
  trafficTrend: TrafficTrendResponse;
  categoryPerformance: CategoryPerformance[];
  topPosts: TopPostPerformanceResponse;
}

export interface StatisticsExportSections {
  overview: boolean;
  trafficTrend: boolean;
  categoryPerformance: boolean;
  topPosts: boolean;
  charts: boolean;
}

export interface StatisticsExportPayload {
  range: StatisticsRange;
  categoryId: string;
  sort: StatisticsSort;
  format: StatisticsExportFormat;
  sections: StatisticsExportSections;
}

export type StatsFilterPeriod = StatisticsRange;
export type StatsFilterCategory = 'all' | 'technology' | 'programming' | 'career';
