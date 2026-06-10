import type { IconType } from 'react-icons';
import { 
  FiHome, 
  FiEdit3, 
  FiFileText, 
  FiPieChart, 
  FiSettings 
} from 'react-icons/fi';

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { id: 'create-post', label: 'Create Post', icon: FiEdit3, path: '/posts/create' },
  { id: 'all-posts', label: 'All Posts', icon: FiFileText, path: '/posts' },
  { id: 'stats', label: 'Statistics', icon: FiPieChart, path: '/statistics' },
  { id: 'settings', label: 'Settings', icon: FiSettings, path: '/settings' },
];
