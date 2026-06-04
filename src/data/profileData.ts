import type { AdminProfile } from '../types';

export const mockAdminProfile: AdminProfile = {
  id: 'admin-001',
  fullName: 'Nitin Jaiswal',
  username: 'nitin_jaiswal',
  email: 'admin@example.com',
  bio: 'Fullstack Blog and News Platform Creator',
  role: 'owner',
  location: 'Lucknow, India',
  socialLinks: {
    linkedin: '',
    github: '',
    instagram: '',
    twitter: '',
    youtube: '',
    portfolio: '',
  },
  updatedAt: new Date().toISOString(),
};
