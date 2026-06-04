import React, { useState } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './SettingsPanels.module.css';

const SiteIdentitySettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings.siteIdentity);
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings.siteIdentity);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings({ siteIdentity: localSettings });
  };

  const handleReset = () => {
    setLocalSettings(settings.siteIdentity);
  };

  return (
    <SettingsSectionCard
      title="Site Identity"
      description="Manage your blog's core branding and identity."
      hasChanges={hasChanges}
      onSave={handleSave}
      onReset={handleReset}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>Site Name</label>
        <input 
          type="text" 
          name="siteName" 
          value={localSettings.siteName} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Site Tagline</label>
        <input 
          type="text" 
          name="siteTagline" 
          value={localSettings.siteTagline} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Short Headline</label>
        <input 
          type="text" 
          name="shortHeadline" 
          value={localSettings.shortHeadline} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Default Author Display</label>
        <input 
          type="text" 
          name="defaultAuthorDisplay" 
          value={localSettings.defaultAuthorDisplay} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>
      <div className={styles.uploadGroup}>
        <div className={styles.uploadBox}>
          <span className={styles.uploadLabel}>Upload Logo</span>
          <button className={styles.uploadBtn}>Choose File</button>
        </div>
        <div className={styles.uploadBox}>
          <span className={styles.uploadLabel}>Upload Favicon</span>
          <button className={styles.uploadBtn}>Choose File</button>
        </div>
      </div>
    </SettingsSectionCard>
  );
};

export default SiteIdentitySettings;
