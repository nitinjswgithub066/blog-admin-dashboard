import React from 'react';
import { cn } from '../../../utils';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, initials = '?', size = 'md', className }) => {
  return (
    <div className={cn(styles.avatar, styles[size], className)}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;
