import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMapPin, FiLink, FiCheckCircle } from 'react-icons/fi';
import { useProfileStore } from '../../../store/profileStore';
import styles from './ProfileForm.module.css';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  username: z.string().min(1, 'Username is required').regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores allowed'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['owner', 'admin', 'publisher', 'author']),
  bio: z.string().max(250, 'Bio cannot exceed 250 characters'),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { profile, updateProfile } = useProfileStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      bio: profile.bio,
      location: profile.location || '',
      website: profile.website || '',
    }
  });

  const bioValue = watch('bio') || '';

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
    reset(data); // reset isDirty
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleReset = () => {
    reset();
    setIsSuccess(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    e.target.value = formatted;
  };

  return (
    <motion.div 
      className={styles.formCard}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h3 className={styles.sectionTitle}>
        <FiUser /> Personal Information
      </h3>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FiCheckCircle /> Profile updated successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name *</label>
            <input 
              {...register('fullName')} 
              className={styles.input} 
              placeholder="e.g. Nitin Jaiswal" 
            />
            {errors.fullName && <span className={styles.errorText}>{errors.fullName.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Username *</label>
            <input 
              {...register('username')} 
              onChange={(e) => {
                handleUsernameChange(e);
                register('username').onChange(e);
              }}
              className={styles.input} 
              placeholder="e.g. nitin_jaiswal" 
            />
            {errors.username && <span className={styles.errorText}>{errors.username.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address *</label>
            <input 
              {...register('email')} 
              type="email"
              className={styles.input} 
            />
            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select {...register('role')} className={styles.select}>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="publisher">Publisher</option>
              <option value="author">Author</option>
            </select>
            {errors.role && <span className={styles.errorText}>{errors.role.message}</span>}
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Bio</label>
            <textarea 
              {...register('bio')} 
              className={styles.textarea} 
              placeholder="Tell your readers about yourself..."
            />
            <div className={styles.charCount}>
              {bioValue.length} / 250
            </div>
            {errors.bio && <span className={styles.errorText}>{errors.bio.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FiMapPin style={{ display: 'inline', marginRight: 4 }}/> Location</label>
            <input 
              {...register('location')} 
              className={styles.input} 
              placeholder="e.g. Lucknow, India" 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}><FiLink style={{ display: 'inline', marginRight: 4 }}/> Website URL</label>
            <input 
              {...register('website')} 
              className={styles.input} 
              placeholder="https://example.com" 
            />
            {errors.website && <span className={styles.errorText}>{errors.website.message}</span>}
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.saveBtn} disabled={!isDirty}>
            Save Profile
          </button>
          <button type="button" onClick={handleReset} className={styles.resetBtn} disabled={!isDirty}>
            Reset Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileForm;
