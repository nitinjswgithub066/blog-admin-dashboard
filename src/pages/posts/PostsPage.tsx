import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';
import styles from './PostsPage.module.css';

// Data & Types
import { adminMockPosts } from '../../data/posts.mock';
import type { AdminPost } from '../../types/post.types';

// Components
import PostsStats from '../../components/posts/PostsStats/PostsStats';
import EmptyPostsState from '../../components/posts/EmptyPostsState/EmptyPostsState';
import PostsFilters from '../../components/posts/PostsFilters/PostsFilters';
import PostsTable from '../../components/posts/PostsTable/PostsTable';
import BulkActionsBar from '../../components/posts/BulkActionsBar/BulkActionsBar';

const PostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AdminPost[]>(adminMockPosts);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Selection State
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      drafts: posts.filter(p => p.status === 'draft').length,
      scheduled: posts.filter(p => p.status === 'scheduled').length,
    };
  }, [posts]);

  // Derived Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter.toLowerCase());
    }

    // Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortOrder === 'views') {
        return b.views - a.views;
      }
      return 0;
    });

    return result;
  }, [posts, statusFilter, categoryFilter, searchQuery, sortOrder]);

  // Handlers
  const handleSelectPost = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, id]);
    } else {
      setSelectedPosts(prev => prev.filter(postId => postId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map(p => p.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      setPosts(prev => prev.filter(p => !selectedPosts.includes(p.id)));
    } else if (action === 'publish' || action === 'draft' || action === 'archive') {
      setPosts(prev => prev.map(p => {
        if (selectedPosts.includes(p.id)) {
          return { ...p, status: action as AdminPost['status'] };
        }
        return p;
      }));
    }
    // 'export' is a mock action
    setSelectedPosts([]);
  };

  const handleRowAction = (action: string, postId: string) => {
    if (action === 'delete') {
      setPosts(prev => prev.filter(p => p.id !== postId));
    } else if (action === 'duplicate') {
      const postToClone = posts.find(p => p.id === postId);
      if (postToClone) {
        const newPost = { 
          ...postToClone, 
          id: `post-${Date.now()}`, 
          title: `${postToClone.title} (Copy)`,
          status: 'draft' as AdminPost['status']
        };
        setPosts(prev => [newPost, ...prev]);
      }
    } else if (action === 'archive') {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'archived' } : p));
    } else if (action === 'edit') {
      navigate('/posts/create'); // mock edit route
    } else if (action === 'preview') {
      // mock preview
      alert('Preview mock triggered');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Posts</h1>
          <p className={styles.pageDescription}>
            Manage travel blogs, destination guides, packages, and draft content.
          </p>
        </div>
        <button className={styles.primaryBtn} onClick={() => navigate('/posts/create')}>
          <FiEdit3 /> Create New Post
        </button>
      </header>

      {posts.length === 0 ? (
        <EmptyPostsState onImportWord={() => navigate('/posts/create')} />
      ) : (
        <div className={styles.contentShell}>
          <PostsStats {...stats} />
          
          <PostsFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />

          <PostsTable 
            posts={filteredPosts}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={handleSelectAll}
            onAction={handleRowAction}
          />
        </div>
      )}

      <BulkActionsBar 
        selectedCount={selectedPosts.length}
        onClearSelection={() => setSelectedPosts([])}
        onBulkAction={handleBulkAction}
      />
    </motion.div>
  );
};

export default PostsPage;
