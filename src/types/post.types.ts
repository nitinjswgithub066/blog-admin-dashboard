export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived' | 'deleted';

export type AdminPost = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  categoryId?: string | null;
  categorySlug: string;
  tags: string[];
  contentType: 'text' | 'document';
  contentPreview: string;
  excerpt?: string;
  coverImage?: string;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  optimizedCoverUrl?: string | null;
  optimizedThumbnailUrl?: string | null;
  author: string;
  status: PostStatus;
  readingTime: number;
  views: number;
  clicks: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string | null;
  deletedAt?: string | null;
  contentHtml?: string;
  contentCss?: string | null;
  contentJson?: unknown;
  sourceType?: 'TEXT_EDITOR' | 'DOC_UPLOAD' | 'HTML_UPLOAD';
  conversionStatus?: 'NONE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  originalDocumentUrl?: string | null;
  originalDocumentPublicId?: string | null;
};

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'Published' | 'Draft' | 'Scheduled'; // kept for backward compatibility if used elsewhere
  views: number;
  clicks: number;
  readingTimeMin: number;
  shares: number;
  date: string;
  coverImage?: string;
  rank?: number; // Used for top posts
}
