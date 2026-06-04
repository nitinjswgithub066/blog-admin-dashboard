import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiMapPin, FiLink, FiCalendar } from 'react-icons/fi';
import { useProfileStore } from '../../../store/profileStore';
import styles from './ProfileHeaderCard.module.css';

const ProfileHeaderCard: React.FC = () => {
  const { profile, updateProfile } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NJ';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = () => {
    const fields = [
      profile.fullName,
      profile.username,
      profile.email,
      profile.bio,
      profile.location,
      profile.website,
      profile.avatar,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} className={styles.avatarImage} />
            ) : (
              getInitials(profile.fullName)
            )}
          </div>
          <button 
            className={styles.editAvatarBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Upload Profile Image"
          >
            <FiCamera size={14} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{profile.fullName}</h2>
            <span className={styles.roleBadge}>{profile.role}</span>
          </div>
          <div className={styles.username}>@{profile.username}</div>
          
          <div className={styles.statsRow}>
            {profile.location && (
              <span className={styles.stat}>
                <FiMapPin className={styles.statIcon} />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <span className={styles.stat}>
                <FiLink className={styles.statIcon} />
                <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
            <span className={styles.stat}>
              <FiCalendar className={styles.statIcon} />
              Updated {new Date(profile.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.completionContainer}>
        <div className={styles.completionHeader}>
          <span>Profile Completion</span>
          <span>{calculateCompletion()}%</span>
        </div>
        <div className={styles.completionBarBg}>
          <motion.div 
            className={styles.completionBarFill}
            initial={{ width: 0 }}
            animate={{ width: `${calculateCompletion()}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeaderCard;
