import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import DropdownSelect from '../../ui/DropdownSelect/DropdownSelect';
import type { ApiCategory, PostsSort, PostsStatusFilter } from '../../../services/post.service';
import styles from './PostsFilters.module.css';

interface PostsFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: PostsStatusFilter;
  onStatusChange: (val: PostsStatusFilter) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  sortOrder: PostsSort;
  onSortChange: (val: PostsSort) => void;
  categories: ApiCategory[];
}

const PostsFilters: React.FC<PostsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
  categories
}) => {
  const tabs: { label: string; value: PostsStatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className={styles.filtersWrapper}>
      {/* Quick Status Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`${styles.tabBtn} ${statusFilter === tab.value ? styles.activeTab : ''}`}
            onClick={() => onStatusChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Dropdowns */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title, author, or tag..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className={styles.dropdowns}>
          <DropdownSelect 
            value={categoryFilter}
            onChange={onCategoryChange}
            icon={<FiFilter />}
            options={[
              { label: 'All Categories', value: 'all' },
              ...categories.map((category) => ({ label: category.name, value: category.id })),
            ]}
          />

          <DropdownSelect 
            value={sortOrder}
            onChange={(value) => onSortChange(value as PostsSort)}
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
              { label: 'Most Views', value: 'most_views' },
              { label: 'Least Views', value: 'least_views' },
              { label: 'Title A-Z', value: 'title_az' },
              { label: 'Title Z-A', value: 'title_za' },
              { label: 'Recently Updated', value: 'updated_desc' },
              { label: 'Oldest Updated', value: 'updated_asc' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PostsFilters;
