import React from 'react';
import SettingsSectionCard from './SettingsSectionCard/SettingsSectionCard';
import styles from './SettingsPanels.module.css';

const LegalPagesSettings: React.FC = () => {
  // Mock data for UI only
  const legalPages = [
    { name: 'Privacy Policy', status: 'Published', date: 'Oct 12, 2025' },
    { name: 'Terms of Use', status: 'Published', date: 'Sep 05, 2025' },
    { name: 'Cookies Policy', status: 'Needs Review', date: 'Jan 10, 2026' },
    { name: 'Disclaimer', status: 'Draft', date: 'Never' },
    { name: 'About Page', status: 'Published', date: 'Nov 22, 2025' },
    { name: 'Contact Page', status: 'Published', date: 'Nov 22, 2025' },
  ];

  return (
    <SettingsSectionCard
      title="Legal Pages"
      description="Manage the content of your site's legal documents."
      hasChanges={false} // Currently UI only, no local state changes tracked here
      onSave={() => {}}
      onReset={() => {}}
    >
      <div className={styles.infoText}>
        In the backend phase, uploaded documents (.docx, .pdf) will be converted into clean HTML with embedded CSS for frontend rendering.
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {legalPages.map((page) => (
          <div key={page.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{page.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Status: <span style={{ color: page.status === 'Published' ? 'var(--success)' : page.status === 'Needs Review' ? 'var(--warning)' : 'var(--text-muted)' }}>{page.status}</span> • Updated: {page.date}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={styles.uploadBtn}>Upload .docx</button>
              <button className={styles.uploadBtn}>Edit HTML</button>
            </div>
          </div>
        ))}
      </div>
    </SettingsSectionCard>
  );
};

export default LegalPagesSettings;
