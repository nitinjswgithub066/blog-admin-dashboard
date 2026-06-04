import React, { useState } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import styles from './SettingsPanels.module.css';

const AdvancedSettings: React.FC = () => {
  const [localSettings, setLocalSettings] = useState({
    devMode: false,
    debugLogs: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (name: keyof typeof localSettings) => {
    setLocalSettings((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = () => {
    // UI only
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings({ devMode: false, debugLogs: false });
    setHasChanges(false);
  };

  return (
    <SettingsSectionCard
      title="Advanced Settings"
      description="Advanced settings are for development and testing only."
      hasChanges={hasChanges}
      onSave={handleSave}
      onReset={handleReset}
    >
      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleTitle}>Enable Developer Mode</span>
          <span className={styles.toggleDesc}>Show hidden experimental features</span>
        </div>
        <label className={styles.switch}>
          <input type="checkbox" checked={localSettings.devMode} onChange={() => handleToggle('devMode')} />
          <span className={styles.slider}></span>
        </label>
      </div>
      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleTitle}>Enable Debug Logs</span>
          <span className={styles.toggleDesc}>Print verbose logs to console</span>
        </div>
        <label className={styles.switch}>
          <input type="checkbox" checked={localSettings.debugLogs} onChange={() => handleToggle('debugLogs')} />
          <span className={styles.slider}></span>
        </label>
      </div>
      
      <div className={styles.buttonGroup} style={{ marginTop: '0.5rem', flexDirection: 'column' }}>
        <button className={styles.outlineBtn} onClick={() => alert("Theme cache cleared.")}>Reset Theme</button>
        <button className={styles.outlineBtn} onClick={() => alert("Sidebar state reset.")}>Reset Sidebar State</button>
        <button className={styles.dangerBtn} onClick={() => alert("Cache cleared.")}>Clear Cache</button>
      </div>
    </SettingsSectionCard>
  );
};

export default AdvancedSettings;
