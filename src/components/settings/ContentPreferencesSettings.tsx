import React, { useState } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './SettingsPanels.module.css';

const ContentPreferencesSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings.contentPreferences);
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings.contentPreferences);

  const handleToggle = (name: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    updateSettings({ contentPreferences: localSettings });
  };

  const handleReset = () => {
    setLocalSettings(settings.contentPreferences);
  };

  const toggleOptions = [
    { key: 'showTrending', title: 'Trending Section', desc: 'Display trending posts on homepage' },
    { key: 'showLatest', title: 'Latest Articles', desc: 'Display latest articles feed' },
    { key: 'showThoughts', title: 'Thoughts Section', desc: 'Display short-form thoughts stream' },
    { key: 'showExploreTopics', title: 'Explore Topics', desc: 'Show topic tags in the sidebar' },
    { key: 'showReadingTime', title: 'Reading Time', desc: 'Show estimated reading time on posts' },
    { key: 'showViewCount', title: 'View Count', desc: 'Display public view counts on posts' },
    { key: 'showShareButtons', title: 'Share Buttons', desc: 'Enable social sharing on articles' },
    { key: 'enableComments', title: 'Comments UI', desc: 'Allow users to comment on posts' },
  ] as const;

  return (
    <SettingsSectionCard
      title="Content Preferences"
      description="Control which sections and features appear on your blog."
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
    </SettingsSectionCard>
  );
};

export default ContentPreferencesSettings;
