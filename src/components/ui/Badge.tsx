import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantClass = styles[variant] || styles.default;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
