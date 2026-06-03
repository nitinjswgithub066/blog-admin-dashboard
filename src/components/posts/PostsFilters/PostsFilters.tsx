import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import DropdownSelect from '../../ui/DropdownSelect/DropdownSelect';
import styles from './PostsFilters.module.css';

interface PostsFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  sortOrder: string;
  onSortChange: (val: string) => void;
}

const PostsFilters: React.FC<PostsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange
}) => {
  const tabs = ['All', 'Published', 'Drafts', 'Scheduled', 'Archived'];

  return (
    <div className={styles.filtersWrapper}>
      {/* Quick Status Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${statusFilter.toLowerCase() === tab.toLowerCase() ? styles.activeTab : ''}`}
            onClick={() => onStatusChange(tab)}
          >
            {tab}
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
              { label: 'All Categories', value: 'All' },
              { label: 'Asia', value: 'Asia' },
              { label: 'Europe', value: 'Europe' },
              { label: 'Luxury', value: 'Luxury' },
              { label: 'Food', value: 'Food' },
              { label: 'Africa', value: 'Africa' },
            ]}
          />

          <DropdownSelect 
            value={sortOrder}
            onChange={onSortChange}
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
              { label: 'Most Viewed', value: 'views' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PostsFilters;
