export type PostStatus = 'Published' | 'Draft';

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: PostStatus;
  views: number;
  clicks: number;
  readingTimeMin: number;
  shares: number;
  date: string;
  coverImage?: string;
  rank?: number; // Used for top posts
}
