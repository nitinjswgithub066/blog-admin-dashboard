export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type AdminPost = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  categorySlug: string;
  tags: string[];
  contentType: 'text' | 'document';
  contentPreview: string;
  excerpt?: string;
  coverImage?: string;
  author: string;
  status: PostStatus;
  readingTime: number;
  views: number;
  clicks: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
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
