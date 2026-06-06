export interface DashboardSearchTrendsResponse {
  source: string;
  lastUpdated: string;
  chart: {
    category: string;
    label: string;
    score: number;
    growth: number;
  }[];
  topCategory?: {
    category: string;
    score: number;
  };
  fastestGrowing?: {
    category: string;
    growth: number;
  };
  suggestedNext?: {
    title: string;
    reason: string;
  };
}

export interface TopPerformingPost {
  rank: number;
  id: string;
  title: string;
  slug: string;
  category: string;
  views: number;
  clicks: number;
  shares: number;
  growth: number;
  isTrending: boolean;
}

export interface DashboardFirstStageResponse {
  searchTrends: DashboardSearchTrendsResponse | null;
  topPosts: TopPerformingPost[];
}

export const dashboardService = {
  getSearchTrends: async () => {
    const response = await fetch('/api/dashboard/search-trends');
    if (!response.ok) throw new Error('Failed to fetch search trends');
    const json = await response.json();
    return json.data as DashboardSearchTrendsResponse | null;
  },

  getTopPerformingPosts: async () => {
    const response = await fetch('/api/dashboard/top-performing-posts');
    if (!response.ok) throw new Error('Failed to fetch top performing posts');
    const json = await response.json();
    return json.data as TopPerformingPost[];
  },

  getFirstStage: async () => {
    const response = await fetch('/api/dashboard/first-stage');
    if (!response.ok) throw new Error('Failed to fetch first stage dashboard');
    const json = await response.json();
    return json.data as DashboardFirstStageResponse;
  }
};
