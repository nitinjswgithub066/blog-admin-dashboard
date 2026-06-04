import React from 'react';
import { motion } from 'framer-motion';
import SiteIdentitySettings from '../../components/settings/SiteIdentitySettings';
import FrontendAppearanceSettings from '../../components/settings/FrontendAppearanceSettings';
import ContentPreferencesSettings from '../../components/settings/ContentPreferencesSettings';
import LegalPagesSettings from '../../components/settings/LegalPagesSettings';
import DocumentConversionSettings from '../../components/settings/DocumentConversionSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import DataBackupSettings from '../../components/settings/DataBackupSettings';
import AdvancedSettings from '../../components/settings/AdvancedSettings';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageDescription}>
            Manage your account preferences, blog settings, and security.
          </p>
        </div>
      </header>

      <div className={styles.settingsGrid}>
        <SiteIdentitySettings />
        <FrontendAppearanceSettings />
        <ContentPreferencesSettings />
        <LegalPagesSettings />
        <DocumentConversionSettings />
        <NotificationSettings />
        <SecuritySettings />
        <DataBackupSettings />
        <AdvancedSettings />
      </div>
    </motion.div>
  );
};

export default SettingsPage;
