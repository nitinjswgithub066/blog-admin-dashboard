import React from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
import ProfileDropdown from '../dropdown/ProfileDropdown';
import styles from './Topbar.module.css';

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button 
          className={styles.menuBtn} 
          onClick={onMenuClick}
          aria-label="Open Menu"
        >
          <FiMenu />
        </button>
        
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search posts, users, or settings..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <motion.button 
          className={styles.iconBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
        >
          <FiBell />
          <span className={styles.badge}></span>
        </motion.button>

        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
