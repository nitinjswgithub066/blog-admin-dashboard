import type { IconType } from 'react-icons';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: IconType;
}
