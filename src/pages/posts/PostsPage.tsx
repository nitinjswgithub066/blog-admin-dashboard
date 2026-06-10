import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiRefreshCw, FiX } from 'react-icons/fi';
import styles from './PostsPage.module.css';

import type { AdminPost } from '../../types/post.types';
import {
  postService,
  type ApiCategory,
  type ExportFormat,
  type PostSummaryResponse,
  type PostsSort,
  type PostsStatusFilter,
} from '../../services/post.service';

import PostsStats from '../../components/posts/PostsStats/PostsStats';
import EmptyPostsState from '../../components/posts/EmptyPostsState/EmptyPostsState';
import PostsFilters from '../../components/posts/PostsFilters/PostsFilters';
import PostsTable from '../../components/posts/PostsTable/PostsTable';
import BulkActionsBar from '../../components/posts/BulkActionsBar/BulkActionsBar';

const defaultSummary: PostSummaryResponse = {
  totalPosts: 0,
  published: 0,
  drafts: 0,
  scheduled: 0,
  archived: 0,
};

const PostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [summary, setSummary] = useState<PostSummaryResponse>(defaultSummary);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostsStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<PostsSort>('updated_desc');

  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [isExporting, setIsExporting] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    window.setTimeout(() => setToastMsg(''), 3200);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const fetchSummary = useCallback(async () => {
    const data = await postService.getPostSummary();
    setSummary(data);
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await postService.getPosts({
        status: statusFilter,
        search: debouncedSearch,
        categoryId: categoryFilter,
        sort: sortOrder,
        page: 1,
        limit: 100,
      });
      setPosts(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts.');
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, debouncedSearch, sortOrder, statusFilter]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchSummary(), fetchPosts()]);
  }, [fetchPosts, fetchSummary]);

  useEffect(() => {
    postService.getCategories()
      .then(setCategories)
      .catch((err) => showToast(err instanceof Error ? err.message : 'Failed to load categories.'));
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      refreshAll().catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load posts.');
        setIsLoading(false);
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refreshAll]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      refreshAll().catch(() => undefined);
    }, 30000);

    return () => window.clearInterval(interval);
  }, [refreshAll]);

  const refetchAfterAction = async (message: string, clearSelection = false) => {
    await refreshAll();
    if (clearSelection) setSelectedPosts([]);
    showToast(message);
  };

  const handleStatusChange = (value: PostsStatusFilter) => {
    setStatusFilter(value);
    setSelectedPosts([]);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setSelectedPosts([]);
  };

  const handleSortChange = (value: PostsSort) => {
    setSortOrder(value);
    setSelectedPosts([]);
  };

  const handleSelectPost = (id: string, checked: boolean) => {
    setSelectedPosts((current) => (
      checked ? [...current, id] : current.filter((postId) => postId !== id)
    ));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedPosts(checked ? posts.map((post) => post.id) : []);
  };

  const handleRowAction = async (action: string, postId: string) => {
    try {
      if (action === 'edit') {
        navigate(`/create-post?edit=${postId}`);
        return;
      }

      if (action === 'preview') {
        navigate(`/create-post/preview/${postId}`);
        return;
      }

      if (action === 'duplicate') {
        await postService.duplicatePost(postId);
        await refetchAfterAction('Post duplicated as draft successfully.');
        return;
      }

      if (action === 'archive') {
        await postService.archivePost(postId);
        await refetchAfterAction('Post archived successfully.');
        return;
      }

      if (action === 'restore') {
        await postService.restorePost(postId);
        await refetchAfterAction('Post restored as draft successfully.');
        return;
      }

      if (action === 'delete') {
        const shouldDelete = window.confirm('Move this post to archive? It will be permanently removed after 14 days.');
        if (!shouldDelete) return;
        await postService.deletePost(postId);
        await refetchAfterAction('Post moved to archive for 14 days.');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed.');
    }
  };

  const runBulkAction = async (action: string) => {
    if (selectedPosts.length === 0) return;

    try {
      if (action === 'export') {
        setIsExportOpen(true);
        return;
      }

      if (action === 'delete') {
        const shouldDelete = window.confirm('Move selected posts to archive? They will be permanently removed after 14 days.');
        if (!shouldDelete) return;
        const result = await postService.bulkDeletePosts(selectedPosts);
        await refetchAfterAction(`${result.updated} posts moved to archive for 14 days.`, true);
        return;
      }

      if (action === 'publish') {
        const result = await postService.bulkPublishPosts(selectedPosts);
        const suffix = result.failed.length > 0 ? ` ${result.failed.length} failed validation.` : '';
        await refetchAfterAction(`${result.updated} posts published.${suffix}`, true);
        return;
      }

      if (action === 'draft') {
        const result = await postService.bulkMoveToDraft(selectedPosts);
        await refetchAfterAction(`${result.updated} posts moved to draft.`, true);
        return;
      }

      if (action === 'archive') {
        const result = await postService.bulkArchivePosts(selectedPosts);
        await refetchAfterAction(`${result.updated} posts archived.`, true);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Bulk action failed.');
    }
  };

  const downloadFile = (fileName: string, content: unknown, format: ExportFormat) => {
    const body = format === 'json'
      ? JSON.stringify(content, null, 2)
      : String(content);
    const mimeType = format === 'json' ? 'application/json' : 'text/html';
    const blob = new Blob([body], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await postService.bulkExportPosts(selectedPosts, exportFormat);
      downloadFile(data.fileName, data.content, data.format);
      setIsExportOpen(false);
      setSelectedPosts([]);
      showToast('Posts exported successfully.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setIsExporting(false);
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
        <button className={styles.primaryBtn} onClick={() => navigate('/create-post?method=text')}>
          <FiEdit3 /> Create New Post
        </button>
      </header>

      <div className={styles.contentShell}>
        <PostsStats
          total={summary.totalPosts}
          published={summary.published}
          drafts={summary.drafts}
          scheduled={summary.scheduled}
          archived={summary.archived}
        />

        <PostsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          categories={categories}
        />

        {isLoading ? (
          <div className={styles.statePanel}>
            <FiRefreshCw className={styles.spinIcon} />
            Loading posts...
          </div>
        ) : error ? (
          <div className={styles.statePanel}>{error}</div>
        ) : posts.length === 0 ? (
          <EmptyPostsState onImportWord={() => navigate('/create-post?method=document')} />
        ) : (
          <PostsTable
            posts={posts}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={handleSelectAll}
            onAction={handleRowAction}
          />
        )}
      </div>

      <BulkActionsBar
        selectedCount={selectedPosts.length}
        onClearSelection={() => setSelectedPosts([])}
        onBulkAction={runBulkAction}
      />

      {isExportOpen && (
        <div className={styles.dialogBackdrop} role="presentation">
          <div className={styles.exportDialog} role="dialog" aria-modal="true" aria-labelledby="export-posts-title">
            <div className={styles.dialogHeader}>
              <h2 id="export-posts-title">Export Posts</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setIsExportOpen(false)} aria-label="Close export dialog">
                <FiX />
              </button>
            </div>

            <div className={styles.exportOptions}>
              {(['json', 'html', 'docx'] as ExportFormat[]).map((format) => (
                <label key={format} className={`${styles.exportOption} ${exportFormat === format ? styles.exportOptionActive : ''}`}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format}
                    checked={exportFormat === format}
                    onChange={() => setExportFormat(format)}
                  />
                  <span>{format === 'docx' ? 'DOCX / Word' : format.toUpperCase()}</span>
                  {format === 'docx' && (
                    <small>DOCX export will be available after Word export package is configured.</small>
                  )}
                </label>
              ))}
            </div>

            <div className={styles.dialogActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setIsExportOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleExport} disabled={isExporting}>
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className={styles.toast} role="status">
          {toastMsg}
        </div>
      )}
    </motion.div>
  );
};

export default PostsPage;
