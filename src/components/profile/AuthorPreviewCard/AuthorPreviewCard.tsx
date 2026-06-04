import React from 'react';
import { motion } from 'framer-motion';
import { FiTwitter, FiGithub, FiLinkedin, FiInstagram, FiYoutube, FiGlobe } from 'react-icons/fi';
import { useProfileStore } from '../../../store/profileStore';
import styles from './AuthorPreviewCard.module.css';

const AuthorPreviewCard: React.FC = () => {
  const { profile } = useProfileStore();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NJ';
  };

  const { socialLinks } = profile;

  return (
    <motion.div 
      className={styles.previewCard}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
    >
      <div className={styles.previewHeader}>
        <div className={styles.avatar}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.fullName} className={styles.avatarImage} />
          ) : (
            getInitials(profile.fullName)
          )}
        </div>
        <div className={styles.authorInfo}>
          <h3 className={styles.name}>{profile.fullName || 'Author Name'}</h3>
          <span className={styles.username}>@{profile.username || 'username'}</span>
        </div>
      </div>

      <div className={styles.bio}>
        {profile.bio || 'No bio provided. Write a short bio to let your readers know more about you.'}
      </div>

      <div className={styles.socialRow}>
        {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className={styles.socialIcon}><FiTwitter /></a>}
        {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className={styles.socialIcon}><FiGithub /></a>}
        {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon}><FiLinkedin /></a>}
        {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className={styles.socialIcon}><FiInstagram /></a>}
        {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className={styles.socialIcon}><FiYoutube /></a>}
        {socialLinks.portfolio && <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className={styles.socialIcon}><FiGlobe /></a>}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>24</span>
          <span className={styles.statLabel}>Articles</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>41.5K</span>
          <span className={styles.statLabel}>Views</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>12</span>
          <span className={styles.statLabel}>Topics</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthorPreviewCard;
