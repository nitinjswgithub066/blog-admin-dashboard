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
