import React, { useState, useEffect } from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './SettingsPanels.module.css';

const DocumentConversionSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings.documentConversion);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings.documentConversion);
    setHasChanges(isChanged);
  }, [localSettings, settings.documentConversion]);

  const handleToggle = (name: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    updateSettings({ documentConversion: localSettings });
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings.documentConversion);
    setHasChanges(false);
  };

  const toggleOptions = [
    { key: 'enableDocxUpload', title: 'Enable DOCX Upload', desc: 'Allow .docx files for posts/pages' },
    { key: 'enablePdfUpload', title: 'Enable PDF Upload', desc: 'Allow .pdf files for posts/pages' },
    { key: 'allowEmbeddedImages', title: 'Embedded Images', desc: 'Extract and save images from documents' },
    { key: 'preserveStyling', title: 'Preserve Styling', desc: 'Keep original fonts and colors' },
    { key: 'generateHtmlPreview', title: 'HTML Previews', desc: 'Generate HTML preview automatically' },
    { key: 'embedCssInStyleTag', title: 'Embed CSS', desc: 'Inject extracted styles into <style>' },
    { key: 'sanitizeUploadedHtml', title: 'Sanitize HTML', desc: 'Remove unsafe scripts and tags' },
  ] as const;

  return (
    <SettingsSectionCard
      title="Document Conversion"
      description="Configure how uploaded documents are processed and rendered."
      hasChanges={hasChanges}
      onSave={handleSave}
      onReset={handleReset}
    >
      <div className={styles.infoText} style={{ marginBottom: '0.5rem' }}>
        In the backend phase, documents uploaded from the admin panel will be automatically converted into HTML and CSS for blog and legal page rendering.
      </div>
      
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

export default DocumentConversionSettings;
