import type { AdminPost, PostStatus } from '../types/post.types';

export type RecentPostFilter = 'all' | 'published' | 'draft' | 'scheduled';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiAuthor {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
  optimizedAvatarUrl?: string | null;
}

export interface AdminPostApiResponse {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  category?: ApiCategory | null;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  status: PostStatus | Uppercase<PostStatus>;
  views: number;
  clicks: number;
  shares?: number;
  readingTime: number;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  optimizedCoverUrl?: string | null;
  contentPreview?: string;
  contentHtml?: string;
  contentCss?: string | null;
  contentJson?: unknown;
  author?: ApiAuthor | string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
}

export interface PostPreviewResponse extends AdminPostApiResponse {
  author: ApiAuthor;
  contentHtml: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const normalizeStatus = (status: AdminPostApiResponse['status']): PostStatus =>
  status.toString().toLowerCase() as PostStatus;

const normalizePost = (post: AdminPostApiResponse): AdminPost => {
  const categoryName = post.categoryName || post.category?.name || 'Uncategorized';

  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle || '',
    slug: post.slug,
    category: categoryName,
    categorySlug: post.categorySlug || post.category?.slug || 'uncategorized',
    tags: post.tags || [],
    contentType: 'text',
    contentPreview: post.contentPreview || '',
    coverImage: post.optimizedCoverUrl || post.coverImageUrl || undefined,
    coverImageUrl: post.coverImageUrl,
    coverImagePublicId: post.coverImagePublicId,
    optimizedCoverUrl: post.optimizedCoverUrl,
    author: typeof post.author === 'string' ? post.author : post.author?.name || 'Admin',
    status: normalizeStatus(post.status),
    readingTime: post.readingTime,
    views: post.views,
    clicks: post.clicks,
    shares: post.shares || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt || undefined,
    scheduledAt: post.scheduledAt || null,
    contentHtml: post.contentHtml,
    contentCss: post.contentCss,
    contentJson: post.contentJson,
  };
};

const fetchPostData = async <T>(endpoint: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Posts API returned invalid response. Check backend URL.');
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Posts API request failed');
  }

  return json.data as T;
};

export const postService = {
  getRecentPosts: async (status: RecentPostFilter = 'all') => {
    const params = new URLSearchParams({ status });
    const data = await fetchPostData<AdminPostApiResponse[]>(`/admin/posts/recent?${params.toString()}`);
    return data.map(normalizePost);
  },

  getPostById: async (id: string) => {
    const data = await fetchPostData<AdminPostApiResponse>(`/admin/posts/${id}`);
    return normalizePost(data);
  },

  getPostPreview: async (id: string) => {
    return fetchPostData<PostPreviewResponse>(`/admin/posts/${id}/preview`);
  },

  deletePost: async (id: string) => {
    return fetchPostData<{ id: string; status: PostStatus; deletedAt: string }>(`/admin/posts/${id}`, {
      method: 'DELETE',
    });
  },
};
