export type AdminRole = 'owner' | 'admin' | 'publisher' | 'author';

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  portfolio?: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: AdminRole;
  bio: string;
  location?: string;
  website?: string;
  avatar?: string;
  socialLinks: SocialLinks;
  updatedAt: string;
}

export const DEFAULT_PROFILE: AdminProfile = {
  id: 'admin-001',
  fullName: 'Nitin Jaiswal',
  username: 'nitin_jaiswal',
  email: 'admin@example.com',
  role: 'owner',
  bio: 'Fullstack Blog and News Platform Creator',
  location: 'Lucknow, India',
  socialLinks: {},
  updatedAt: new Date().toISOString(),
};
