import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiBell, FiSearch, FiX } from 'react-icons/fi';
import ProfileDropdown from '../dropdown/ProfileDropdown';
import styles from './Topbar.module.css';

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={styles.topbar}>
      {/* Left: hamburger + (desktop) search */}
      <div className={styles.leftSection}>
        <button
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Open Menu"
        >
          <FiMenu />
        </button>

        {/* Desktop search — always visible ≥768px */}
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search posts, users, or settings..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Right: mobile search toggle + notifications + profile */}
      <div className={styles.rightSection}>
        {/* Mobile search icon — toggles overlay search */}
        <button
          className={`${styles.iconBtn} ${styles.mobileSearchBtn}`}
          onClick={() => setSearchOpen(s => !s)}
          aria-label="Toggle search"
        >
          {searchOpen ? <FiX /> : <FiSearch />}
        </button>

        <motion.button
          className={styles.iconBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
        >
          <FiBell />
          <span className={styles.badge} />
        </motion.button>

        <ProfileDropdown />
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className={styles.mobileSearch}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <FiSearch className={styles.mobileSearchIcon} />
            <input
              autoFocus
              type="text"
              placeholder="Search posts, users, or settings..."
              className={styles.mobileSearchInput}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Topbar;
