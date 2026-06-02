import type { AdminProfile, SiteSettings } from '../types';

export const mockAdminProfile: AdminProfile = {
  id: 'admin-001',
  fullName: 'Admin User',
  username: 'admin',
  email: 'admin@vexirahub.com',
  bio: 'Lead Developer and Founder of VEXIRAHUB. Passionate about AI, web development, and building tools for creators.',
  role: 'Super Admin',
  socialLinks: {
    twitter: 'https://twitter.com/vexirahub',
    github: 'https://github.com/vexirahub',
    linkedin: 'https://linkedin.com/company/vexirahub',
    website: 'https://vexirahub.com',
  },
};

export const mockSiteSettings: SiteSettings = {
  siteName: 'VEXIRAHUB',
  tagline: 'The future of modern technology blogs.',
  defaultTheme: 'dark',
  featuredPostStrategy: 'latest',
  showCategories: true,
  contactEmail: 'contact@vexirahub.com',
};
