import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLogOut, FiChevronDown, FiMoon, FiSun, FiLayout } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';
import { useThemeStore } from '../../store/themeStore';
import styles from './ProfileDropdown.module.css';

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const { theme, setTheme } = useThemeStore();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NJ';
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsThemeMenuOpen(false);
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
    setIsThemeMenuOpen(false);
    navigate(path);
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
    setIsOpen(false);
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
            
            <div 
              className={styles.themeMenuContainer}
              onMouseEnter={() => setIsThemeMenuOpen(true)}
              onMouseLeave={() => setIsThemeMenuOpen(false)}
            >
              <button 
                className={styles.menuItem} 
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                aria-expanded={isThemeMenuOpen}
              >
                <FiLayout className={styles.menuIcon} />
                Theme Change
              </button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div 
                    className={styles.themePanel}
                    initial={{ opacity: 0, x: 8, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                  >
                    <button 
                      className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      Dark Mode
                      <FiMoon className={styles.themeOptionIcon} />
                    </button>
                    <button 
                      className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                      onClick={() => handleThemeChange('light')}
                    >
                      Light Mode
                      <FiSun className={styles.themeOptionIcon} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
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
