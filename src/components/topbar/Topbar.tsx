import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiSearch, FiX } from 'react-icons/fi';
import ProfileDropdown from '../dropdown/ProfileDropdown';
import styles from './Topbar.module.css';

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={styles.topbar}>
      {/* Hamburger — mobile/tablet only (hidden on desktop via CSS) */}
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open Menu">
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
      </button>

      {/* Search — desktop always visible, mobile via toggle */}
      <div className={`${styles.searchContainer} ${searchOpen ? styles.searchOpen : ''}`}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search posts, users, or settings..."
          className={styles.searchInput}
        />
        {searchOpen && (
          <button className={styles.searchClose} onClick={() => setSearchOpen(false)} aria-label="Close search">
            <FiX />
          </button>
        )}
      </div>

      {/* Right section */}
      <div className={styles.rightSection}>
        {/* Mobile: search icon toggle */}
        <button
          className={`${styles.iconBtn} ${styles.mobileSearchTrigger}`}
          onClick={() => setSearchOpen(s => !s)}
          aria-label="Search"
        >
          <FiSearch />
        </button>

        {/* Notifications */}
        <motion.button
          className={styles.iconBtn}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Notifications"
        >
          <FiBell />
          <span className={styles.badge} />
        </motion.button>

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
