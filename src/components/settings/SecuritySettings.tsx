import React, { useState, useEffect } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './SettingsPanels.module.css';

const SecuritySettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings.security);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings.security) || 
                      passwords.current !== '' || passwords.new !== '' || passwords.confirm !== '';
    setHasChanges(isChanged);
  }, [localSettings, settings.security, passwords]);

  const handleToggle = (name: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateSettings({ security: localSettings });
    if (passwords.new && passwords.new === passwords.confirm) {
      alert("Password settings updated successfully.");
      setPasswords({ current: '', new: '', confirm: '' });
    } else if (passwords.new) {
      alert("Passwords do not match.");
      return;
    }
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings.security);
    setPasswords({ current: '', new: '', confirm: '' });
    setHasChanges(false);
  };

  return (
    <SettingsSectionCard
      title="Security Settings"
      description="Update your password and secure your account."
      hasChanges={hasChanges}
      onSave={handleSave}
      onReset={handleReset}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>Current Password</label>
        <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>New Password</label>
        <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Confirm New Password</label>
        <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className={styles.input} />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Require Strong Password</span>
            <span className={styles.toggleDesc}>Enforce minimum complexity</span>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={localSettings.strongPassword} onChange={() => handleToggle('strongPassword')} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Auto Logout</span>
            <span className={styles.toggleDesc}>Logout after 30 mins of inactivity</span>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={localSettings.autoLogout} onChange={() => handleToggle('autoLogout')} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Login Reminder</span>
            <span className={styles.toggleDesc}>Email on new device login</span>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={localSettings.loginReminder} onChange={() => handleToggle('loginReminder')} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </SettingsSectionCard>
  );
};

export default SecuritySettings;
