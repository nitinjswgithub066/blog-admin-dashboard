import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';
import styles from './ProfileDropdown.module.css';

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile } = useProfileStore();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NJ';
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    // Simulate logout logic here
    navigate('/auth/login');
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <motion.button 
        className={`${styles.profileTrigger} ${isOpen ? styles.active : ''}`}
        onClick={toggleDropdown}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
      >
        <div className={styles.avatar}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            getInitials(profile.fullName)
          )}
        </div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>{profile.fullName}</span>
          <span className={styles.profileRole} style={{ textTransform: 'capitalize' }}>{profile.role}</span>
        </div>
        <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.menuHeader}>
              <span className={styles.menuHeaderName}>{profile.fullName}</span>
              <span className={styles.menuHeaderEmail}>{profile.email}</span>
            </div>

            <button className={styles.menuItem} onClick={() => handleNavigate('/profile')}>
              <FiUser className={styles.menuIcon} />
              My Profile
            </button>
            <button className={styles.menuItem} onClick={() => handleNavigate('/settings')}>
              <FiSettings className={styles.menuIcon} />
              Account Settings
            </button>
            
            <div className={styles.menuDivider}></div>
            
            <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
              <FiLogOut className={styles.menuIcon} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
