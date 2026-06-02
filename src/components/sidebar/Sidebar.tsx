import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiEdit3, 
  FiFileText, 
  FiPieChart, 
  FiSettings, 
  FiChevronLeft, 
  FiChevronRight,
  FiBox
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/posts/create', label: 'Create Post', icon: FiEdit3 },
  { path: '/posts', label: 'All Posts', icon: FiFileText },
  { path: '/stats', label: 'Statistics', icon: FiPieChart },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`
        ${styles.sidebar} 
        ${isCollapsed ? styles.collapsed : styles.expanded}
        ${isMobileOpen ? styles.mobileOpen : ''}
      `}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <FiBox className={styles.logoIcon} />
          {/* Use framer-motion to animate the text in/out smoothly */}
          <motion.span
            initial={false}
            animate={{ 
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              display: isCollapsed ? 'none' : 'block'
            }}
            transition={{ duration: 0.2 }}
          >
            BlogAdmin
          </motion.span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={styles.navIcon} />
            <motion.span
              className={styles.navText}
              initial={false}
              animate={{ 
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : 'auto',
                display: isCollapsed ? 'none' : 'block'
              }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button 
          className={styles.collapseBtn} 
          onClick={toggleCollapse}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
