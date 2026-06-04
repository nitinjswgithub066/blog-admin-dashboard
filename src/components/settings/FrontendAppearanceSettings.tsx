import React, { useState } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './SettingsPanels.module.css';

const FrontendAppearanceSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings.appearance);
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings.appearance);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    updateSettings({ appearance: localSettings });
  };

  const handleReset = () => {
    setLocalSettings(settings.appearance);
  };

  return (
    <SettingsSectionCard
      title="Frontend Appearance"
      description="Customize how the public blog frontend looks."
      hasChanges={hasChanges}
      onSave={handleSave}
      onReset={handleReset}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>Default Theme</label>
        <select name="defaultTheme" value={localSettings.defaultTheme} onChange={handleChange} className={styles.select}>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Accent Color</label>
        <select name="accentColor" value={localSettings.accentColor} onChange={handleChange} className={styles.select}>
          <option value="Purple">Purple</option>
          <option value="Blue">Blue</option>
          <option value="Pink">Pink</option>
          <option value="Cyan">Cyan</option>
          <option value="Brown">Brown</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Homepage Hero Style</label>
        <select name="heroStyle" value={localSettings.heroStyle} onChange={handleChange} className={styles.select}>
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Card Style</label>
        <select name="cardStyle" value={localSettings.cardStyle} onChange={handleChange} className={styles.select}>
          <option value="glass">Glassmorphism</option>
          <option value="flat">Flat Design</option>
          <option value="bordered">Bordered</option>
        </select>
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleTitle}>Glassmorphism Effects</span>
          <span className={styles.toggleDesc}>Enable background blur elements globally</span>
        </div>
        <label className={styles.switch}>
          <input type="checkbox" checked={localSettings.glassmorphism} onChange={() => handleToggle('glassmorphism')} />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleTitle}>Animations</span>
          <span className={styles.toggleDesc}>Enable micro-interactions and transitions</span>
        </div>
        <label className={styles.switch}>
          <input type="checkbox" checked={localSettings.animations} onChange={() => handleToggle('animations')} />
          <span className={styles.slider}></span>
        </label>
      </div>
    </SettingsSectionCard>
  );
};

export default FrontendAppearanceSettings;
