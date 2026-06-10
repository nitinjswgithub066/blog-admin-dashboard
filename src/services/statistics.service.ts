import type {
  CategoryPerformance,
  StatisticsExportPayload,
  StatisticsOverview,
  StatisticsRange,
  StatisticsResponse,
  StatisticsSort,
  TopPostPerformanceResponse,
  TrafficTrendResponse,
} from '../types/statistics.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface StatisticsQueryParams {
  range: StatisticsRange;
  categoryId?: string;
  sort?: StatisticsSort;
  page?: number;
  limit?: number;
}

const buildQuery = (params: StatisticsQueryParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Statistics API returned invalid response. Check backend URL.');
  }

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Statistics request failed.');
  }

  return json.data as T;
};

const fetchStatisticsJson = async <T>(endpoint: string, params: StatisticsQueryParams) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}${buildQuery(params)}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  return parseJsonResponse<T>(response);
};

export const statisticsService = {
  getStatistics: (params: StatisticsQueryParams) =>
    fetchStatisticsJson<StatisticsResponse>('/admin/statistics', params),

  getStatisticsOverview: (params: StatisticsQueryParams) =>
    fetchStatisticsJson<StatisticsOverview>('/admin/statistics/overview', params),

  getTrafficTrend: (params: StatisticsQueryParams) =>
    fetchStatisticsJson<TrafficTrendResponse>('/admin/statistics/traffic-trend', params),

  getCategoryPerformance: (params: StatisticsQueryParams) =>
    fetchStatisticsJson<CategoryPerformance[]>('/admin/statistics/category-performance', params),

  getTopPostPerformance: (params: StatisticsQueryParams) =>
    fetchStatisticsJson<TopPostPerformanceResponse>('/admin/statistics/top-posts', params),

  exportStatisticsReport: (payload: StatisticsExportPayload) =>
    fetch(`${API_BASE_URL}/admin/statistics/export`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/csv, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
};
