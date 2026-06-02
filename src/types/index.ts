// Global Types for Blog Admin Dashboard

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

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

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: string; // e.g., "+12%", "-2%"
  isPositive: boolean;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: any; // Allow dynamic keys for multi-line charts
}

export interface AdminProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  role: string;
  profileImage?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultTheme: 'dark' | 'light' | 'system';
  featuredPostStrategy: 'latest' | 'most_viewed' | 'manual';
  showCategories: boolean;
  contactEmail: string;
}
