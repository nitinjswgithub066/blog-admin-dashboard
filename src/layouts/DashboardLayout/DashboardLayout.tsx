import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import styles from './DashboardLayout.module.css';

const DashboardLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isMobileOpen} onMobileClose={closeMobileSidebar} />

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Topbar Component */}
        <Topbar onMenuClick={toggleMobileSidebar} />

        {/* The current routed page will render here */}
        <main className={styles.pageContainer}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay for closing sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
