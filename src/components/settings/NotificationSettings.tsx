import React, { useState, useEffect } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './SettingsPanels.module.css';

const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings.notifications);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings.notifications);
    setHasChanges(isChanged);
  }, [localSettings, settings.notifications]);

  const handleToggle = (name: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    updateSettings({ notifications: localSettings });
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings.notifications);
    setHasChanges(false);
  };

  const toggleOptions = [
    { key: 'enabled', title: 'Enable Notifications', desc: 'Global toggle for dashboard notifications' },
    { key: 'newComments', title: 'New Comments', desc: 'Notify when a new comment is posted' },
    { key: 'highTrafficPosts', title: 'High Traffic', desc: 'Notify on high traffic milestones' },
    { key: 'draftReminders', title: 'Draft Reminders', desc: 'Remind about unpublished drafts' },
    { key: 'documentUploads', title: 'Document Uploads', desc: 'Notify when document conversion finishes' },
    { key: 'legalUpdates', title: 'Legal Updates', desc: 'Notify when legal pages are modified' },
  ] as const;

  return (
    <SettingsSectionCard
      title="Notification Settings"
      description="Control which alerts you receive in the dashboard."
      hasChanges={hasChanges}
      onSave={handleSave}
      onReset={handleReset}
    >
      {toggleOptions.map((opt) => (
        <div className={styles.toggleRow} key={opt.key}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>{opt.title}</span>
            <span className={styles.toggleDesc}>{opt.desc}</span>
          </div>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={localSettings[opt.key]} 
              onChange={() => handleToggle(opt.key)} 
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      ))}
      
      <div className={styles.buttonGroup} style={{ marginTop: '1rem' }}>
        <button className={styles.outlineBtn}>Mark all as read</button>
        <button className={styles.outlineBtn}>Clear history</button>
      </div>
    </SettingsSectionCard>
  );
};

export default NotificationSettings;
