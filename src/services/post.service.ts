import type { AdminPost, PostStatus } from '../types/post.types';

export type RecentPostFilter = 'all' | 'published' | 'draft' | 'scheduled' | 'archive';
export type PostsStatusFilter = 'all' | 'published' | 'draft' | 'scheduled' | 'archived';
export type PostsSort =
  | 'newest'
  | 'oldest'
  | 'most_views'
  | 'least_views'
  | 'title_az'
  | 'title_za'
  | 'updated_desc'
  | 'updated_asc';
export type ExportFormat = 'json' | 'html' | 'docx';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface ApiTag {
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
  categoryId?: string | null;
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
  optimizedCardUrl?: string | null;
  optimizedThumbnailUrl?: string | null;
  contentPreview?: string;
  contentHtml?: string;
  contentCss?: string | null;
  contentJson?: unknown;
  author?: ApiAuthor | string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  deletedAt?: string | null;
  sourceType?: 'TEXT_EDITOR' | 'DOC_UPLOAD' | 'HTML_UPLOAD';
  conversionStatus?: 'NONE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  originalDocumentUrl?: string | null;
  originalDocumentPublicId?: string | null;
}

export interface PostPayload {
  title: string;
  subtitle?: string;
  contentHtml: string;
  contentCss?: string;
  contentJson?: unknown;
  categoryId?: string | null;
  tags?: string[];
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  sourceType?: 'TEXT_EDITOR' | 'DOC_UPLOAD' | 'HTML_UPLOAD';
  conversionStatus?: 'NONE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  originalDocumentUrl?: string | null;
  originalDocumentPublicId?: string | null;
  scheduledAt?: string | null;
  status?: 'draft' | 'DRAFT';
}

export interface CoverUploadResponse {
  url: string;
  publicId: string;
  optimizedCoverUrl: string | null;
  optimizedCardUrl: string | null;
  optimizedThumbnailUrl: string | null;
}

export interface InlineUploadResponse {
  url: string;
  originalUrl: string;
  publicId: string;
}

export interface DocumentUploadResponse {
  fileName: string;
  title: string;
  contentHtml: string;
  contentCss: string;
  sourceType: 'DOC_UPLOAD';
  conversionStatus: 'COMPLETED';
  originalDocumentUrl?: string | null;
  originalDocumentPublicId?: string | null;
}

export interface PostPreviewResponse extends AdminPostApiResponse {
  author: ApiAuthor;
  contentHtml: string;
}

export interface PostSummaryResponse {
  totalPosts: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
}

export interface PostsQueryParams {
  status?: PostsStatusFilter;
  search?: string;
  categoryId?: string;
  sort?: PostsSort;
  page?: number;
  limit?: number;
}

export interface PostsListResponse {
  items: AdminPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BulkActionResponse {
  updated: number;
  failed: { id: string; reason: string }[];
}

export interface BulkExportResponse {
  format: ExportFormat;
  fileName: string;
  content: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BLOG_SITE_NAME = 'VEXIRAHUB';

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
    categoryId: post.categoryId || post.category?.id || null,
    categorySlug: post.categorySlug || post.category?.slug || 'uncategorized',
    tags: post.tags || [],
    contentType: post.sourceType === 'DOC_UPLOAD' ? 'document' : 'text',
    contentPreview: post.contentPreview || '',
    coverImage: post.optimizedThumbnailUrl || post.optimizedCoverUrl || post.coverImageUrl || undefined,
    coverImageUrl: post.coverImageUrl,
    coverImagePublicId: post.coverImagePublicId,
    optimizedCoverUrl: post.optimizedCoverUrl,
    optimizedThumbnailUrl: post.optimizedThumbnailUrl,
    author: BLOG_SITE_NAME,
    status: normalizeStatus(post.status),
    readingTime: post.readingTime,
    views: post.views,
    clicks: post.clicks,
    shares: post.shares || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt || undefined,
    scheduledAt: post.scheduledAt || null,
    deletedAt: post.deletedAt || null,
    contentHtml: post.contentHtml,
    contentCss: post.contentCss,
    contentJson: post.contentJson,
    sourceType: post.sourceType,
    conversionStatus: post.conversionStatus,
    originalDocumentUrl: post.originalDocumentUrl,
    originalDocumentPublicId: post.originalDocumentPublicId,
  };
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('API returned invalid response. Check backend URL.');
  }

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'API request failed');
  }

  return json.data as T;
};

const fetchJson = async <T>(endpoint: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  return parseJsonResponse<T>(response);
};

const buildPostsQuery = (params: PostsQueryParams = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const uploadFile = async <T>(endpoint: string, fieldName: string, file: File): Promise<T> => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    headers: { Accept: 'application/json' },
  });

  return parseJsonResponse<T>(response);
};

export const postService = {
  getPostSummary: () => fetchJson<PostSummaryResponse>('/admin/posts/summary'),

  getPosts: async (params: PostsQueryParams = {}): Promise<PostsListResponse> => {
    const data = await fetchJson<{
      items: AdminPostApiResponse[];
      pagination: PostsListResponse['pagination'];
    }>(`/admin/posts${buildPostsQuery(params)}`);

    return {
      items: data.items.map(normalizePost),
      pagination: data.pagination,
    };
  },

  getRecentPosts: async (status: RecentPostFilter = 'all') => {
    const params = new URLSearchParams({ status });
    const data = await fetchJson<AdminPostApiResponse[]>(`/admin/posts/recent?${params.toString()}`);
    return data.map(normalizePost);
  },

  getPostById: async (id: string) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}`);
    return normalizePost(data);
  },

  getPostPreview: async (id: string) => {
    return fetchJson<PostPreviewResponse>(`/admin/posts/${id}/preview`);
  },

  createDraft: async (payload: PostPayload) => {
    const data = await fetchJson<AdminPostApiResponse>('/admin/posts/draft', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizePost(data);
  },

  updatePost: async (id: string, payload: PostPayload) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizePost(data);
  },

  publishPost: async (id: string, payload: PostPayload) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizePost(data);
  },

  duplicatePost: async (id: string) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}/duplicate`, { method: 'POST' });
    return normalizePost(data);
  },

  movePostToDraft: async (id: string) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}/move-to-draft`, { method: 'POST' });
    return normalizePost(data);
  },

  schedulePost: async (id: string, payload: PostPayload) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizePost(data);
  },

  deletePost: async (id: string) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}`, {
      method: 'DELETE',
    });
    return normalizePost(data);
  },

  restorePost: async (id: string) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}/restore`, { method: 'POST' });
    return normalizePost(data);
  },

  archivePost: async (id: string) => {
    const data = await fetchJson<AdminPostApiResponse>(`/admin/posts/${id}/archive`, { method: 'POST' });
    return normalizePost(data);
  },

  bulkPublishPosts: (ids: string[]) =>
    fetchJson<BulkActionResponse>('/admin/posts/bulk/publish', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  bulkMoveToDraft: (ids: string[]) =>
    fetchJson<BulkActionResponse>('/admin/posts/bulk/move-to-draft', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  bulkArchivePosts: (ids: string[]) =>
    fetchJson<BulkActionResponse>('/admin/posts/bulk/archive', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  bulkDeletePosts: (ids: string[]) =>
    fetchJson<BulkActionResponse>('/admin/posts/bulk/delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  bulkExportPosts: (ids: string[], format: ExportFormat) =>
    fetchJson<BulkExportResponse>('/admin/posts/bulk/export', {
      method: 'POST',
      body: JSON.stringify({ ids, format }),
    }),

  uploadCoverImage: (file: File) => uploadFile<CoverUploadResponse>('/admin/posts/upload-cover', 'image', file),

  uploadInlineImage: (file: File) =>
    uploadFile<InlineUploadResponse>('/admin/posts/upload-inline-image', 'image', file),

  uploadDocument: (file: File) => uploadFile<DocumentUploadResponse>('/admin/posts/upload-document', 'document', file),

  getCategories: () => fetchJson<ApiCategory[]>('/admin/categories'),

  createCategory: (name: string) =>
    fetchJson<ApiCategory>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  deleteCategory: (id: string) =>
    fetchJson<void>(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),

  getTags: () => fetchJson<ApiTag[]>('/admin/tags'),

  createTag: (name: string) =>
    fetchJson<ApiTag>('/admin/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
};
