import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';
import { useNotificationsStore } from '../../../store/notificationsStore';
import NotificationPanel from '../NotificationPanel/NotificationPanel';
import styles from './NotificationButton.module.css';

const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotificationsStore();
  const location = useLocation();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const isActive = isOpen || location.pathname === '/notifications';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <motion.button
        className={`${styles.iconBtn} ${isActive ? styles.active : ''}`}
        onClick={toggleDropdown}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default NotificationButton;
