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
