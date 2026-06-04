import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../dropdown/ProfileDropdown';
import NotificationButton from '../notifications/NotificationButton/NotificationButton';
import styles from './Topbar.module.css';

interface TopbarProps {
  onMenuClick?: () => void;
}

const MOCK_SUGGESTIONS = [
  { label: 'Create Post', type: 'Quick Search', path: '/posts/create' },
  { label: 'All Posts', type: 'Quick Search', path: '/posts' },
  { label: 'Blog Statistics', type: 'Quick Search', path: '/statistics' },
  { label: 'Theme Settings', type: 'Settings', path: '/settings' },
  { label: 'Legal Pages', type: 'Settings', path: '/settings' },
  { label: 'Privacy Policy', type: 'Settings', path: '/settings' },
  { label: 'Technology', type: 'Categories', path: '/posts' },
  { label: 'AI', type: 'Categories', path: '/posts' },
  { label: 'Programming', type: 'Categories', path: '/posts' },
];

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      setSearchQuery('');
    } else if (e.key === 'Enter') {
      const filtered = MOCK_SUGGESTIONS.filter(s => 
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        navigate(filtered[0].path);
        setIsFocused(false);
        setSearchOpen(false);
      }
    }
  };

  const handleSuggestionClick = (path: string) => {
    navigate(path);
    setIsFocused(false);
    setSearchOpen(false);
  };

  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group suggestions
  const groupedSuggestions = filteredSuggestions.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, typeof MOCK_SUGGESTIONS>);

  const showDropdown = isFocused && (searchQuery.length > 0 || isFocused);

  return (
    <header className={styles.topbar}>
      {/* Hamburger — mobile/tablet only (hidden on desktop via CSS) */}
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open Menu">
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
      </button>

      {/* Search — desktop always visible, mobile via toggle */}
      <div 
        ref={dropdownRef}
        className={`${styles.searchContainer} ${searchOpen ? styles.searchOpen : ''}`}
      >
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search posts, categories, settings..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search dashboard"
        />
        {searchOpen && (
          <button className={styles.searchClose} onClick={() => setSearchOpen(false)} aria-label="Close search">
            <FiX />
          </button>
        )}

        {/* Search Dropdown */}
        {showDropdown && (
          <div className={styles.searchDropdown}>
            {Object.keys(groupedSuggestions).length > 0 ? (
              Object.entries(groupedSuggestions).map(([type, items]) => (
                <div key={type} className={styles.suggestionGroup}>
                  <div className={styles.suggestionHeader}>{type}</div>
                  {items.map((item, idx) => (
                    <button 
                      key={idx} 
                      className={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className={styles.rightSection}>
        {/* Mobile: search icon toggle */}
        <button
          className={`${styles.iconBtn} ${styles.mobileSearchTrigger}`}
          onClick={() => {
            setSearchOpen(s => !s);
            if (!searchOpen) setTimeout(() => setIsFocused(true), 100);
          }}
          aria-label="Search"
        >
          <FiSearch />
        </button>

        {/* Notifications */}
        <NotificationButton />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
