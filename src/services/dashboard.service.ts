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

export interface BlogTopicIdea {
  id: string;
  title: string;
  category?: { name: string } | null;
  categoryId?: string | null;
  isCompleted: boolean;
  createdAt: string;
}

export interface BlogPerformanceResponse {
  range: string;
  source: string;
  currentLabel: string;
  navigation: {
    previousDate: string;
    nextDate: string | null;
  };
  series: {
    label: string;
    clicks: number;
    traffic: number;
  }[];
  summary: {
    totalClicks: number;
    totalTraffic: number;
    averageReadingTime: number;
    growth: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const fetchDashboardData = async <T>(endpoint: string): Promise<T> => {
  const url = API_BASE_URL + endpoint;
  
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Dashboard API returned invalid response. Check backend URL.');
  }

  if (!response.ok) {
    let errorMsg = 'Failed to fetch dashboard data';
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errorMsg;
    } catch (e) {
      // Ignore JSON parse error on error response
    }
    throw new Error(errorMsg);
  }

  const json = await response.json();
  return json.data as T;
};

export const dashboardService = {
  getSearchTrends: async () => {
    return fetchDashboardData<DashboardSearchTrendsResponse | null>('/dashboard/search-trends');
  },

  getTopPerformingPosts: async () => {
    return fetchDashboardData<TopPerformingPost[]>('/dashboard/top-performing-posts');
  },

  getFirstStage: async () => {
    return fetchDashboardData<DashboardFirstStageResponse>('/dashboard/first-stage');
  },

  // Stage 2
  getBlogPerformance: async (range: string, date?: string) => {
    const params = new URLSearchParams({ range });
    if (date) params.append('date', date);
    return fetchDashboardData<BlogPerformanceResponse>('/dashboard/blog-performance?' + params.toString());
  },

  getTopicNotes: async () => {
    return fetchDashboardData<BlogTopicIdea[]>('/dashboard/topic-notes');
  },

  createTopicNote: async (title: string, categoryId?: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/topic-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, categoryId }),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to create note');
    return json.data as BlogTopicIdea;
  },

  updateTopicNote: async (id: string, isCompleted: boolean) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/topic-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isCompleted }),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to update note');
    return json.data as BlogTopicIdea;
  },

  deleteTopicNote: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/topic-notes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to delete note');
    return true;
  }
};
