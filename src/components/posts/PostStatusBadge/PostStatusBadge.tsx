import React from 'react';
import type { PostStatus } from '../../../types/post.types';

interface PostStatusBadgeProps {
  status: PostStatus;
}

const PostStatusBadge: React.FC<PostStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'published':
        return {
          background: 'rgba(16, 185, 129, 0.15)', // success
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        };
      case 'draft':
        return {
          background: 'rgba(245, 158, 11, 0.15)', // warning/amber
          color: '#F59E0B',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        };
      case 'scheduled':
        return {
          background: 'rgba(56, 189, 248, 0.15)', // info/blue
          color: '#38BDF8',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        };
      case 'archived':
        return {
          background: 'rgba(156, 163, 175, 0.15)', // muted/gray
          color: '#9CA3AF',
          border: '1px solid rgba(156, 163, 175, 0.3)'
        };
      case 'deleted':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.28)'
        };
      default:
        return {};
    }
  };

  return (
    <span style={{
      ...getBadgeStyle(),
      padding: '0.25rem 0.6rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'capitalize',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
};

export default PostStatusBadge;
