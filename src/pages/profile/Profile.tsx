import React from 'react';
import { motion } from 'framer-motion';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard/ProfileHeaderCard';
import ProfileForm from '../../components/profile/ProfileForm/ProfileForm';
import SocialLinksForm from '../../components/profile/SocialLinksForm/SocialLinksForm';
import AuthorPreviewCard from '../../components/profile/AuthorPreviewCard/AuthorPreviewCard';
import styles from './Profile.module.css';

const ProfilePage: React.FC = () => {
  return (
    <motion.div 
      className={styles.profilePage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageDescription}>
            Manage your personal information, role, and public author details.
          </p>
        </div>
      </header>

      <div className={styles.profileGrid}>
        {/* Left Column - Forms */}
        <div className={styles.leftColumn}>
          <ProfileHeaderCard />
          <ProfileForm />
          <SocialLinksForm />
        </div>

        {/* Right Column - Previews & Info */}
        <div className={styles.rightColumn}>
          <AuthorPreviewCard />
          
          <motion.div 
            className={styles.usageCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <h3 className={styles.usageTitle}>Profile Usage</h3>
            <p className={styles.usageText}>
              This profile is used in the dashboard topbar, post author cards, and the future public About page. Changes made here will reflect globally across the platform.
            </p>
            <div className={styles.usageMode}>
              Current mode: Single Admin
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
