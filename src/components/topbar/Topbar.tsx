import React from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
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

        {/* Profile Dropdown Trigger Placeholder */}
        <motion.button 
          className={styles.profileTrigger}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.avatar}>
            AD
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Admin User</span>
            <span className={styles.profileRole}>Super Admin</span>
          </div>
        </motion.button>
      </div>
    </header>
  );
};

export default Topbar;
