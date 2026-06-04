import React from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import styles from './SettingsPanels.module.css';
import { useSettingsStore } from '../../store/settingsStore';

const DataBackupSettings: React.FC = () => {
  const { settings, resetSettings } = useSettingsStore();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "blog_admin_settings_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to completely reset all dashboard settings to their defaults? This cannot be undone.")) {
      resetSettings();
    }
  };

  return (
    <SettingsSectionCard
      title="Data & Backup"
      description="Export your configuration or reset the dashboard."
      hasChanges={false}
      onSave={() => {}}
      onReset={() => {}}
    >
      <div className={styles.buttonGroup} style={{ flexDirection: 'column' }}>
        <button className={styles.outlineBtn} onClick={handleExport}>
          Export Mock Data (JSON)
        </button>
        <button className={styles.outlineBtn} onClick={() => alert("File picker would open here.")}>
          Import Settings Backup
        </button>
        <button className={styles.dangerBtn} onClick={() => alert("Local dashboard data cleared.")}>
          Clear Local Dashboard Data
        </button>
        <button className={styles.dangerBtn} onClick={handleReset}>
          Reset Dashboard Settings
        </button>
      </div>
    </SettingsSectionCard>
  );
};

export default DataBackupSettings;
