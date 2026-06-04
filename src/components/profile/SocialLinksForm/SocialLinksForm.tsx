import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTwitter, FiGithub, FiLinkedin, FiInstagram, FiYoutube, FiGlobe, FiShare2, FiCheckCircle } from 'react-icons/fi';
import { useProfileStore } from '../../../store/profileStore';
import styles from './SocialLinksForm.module.css';

const socialSchema = z.object({
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type SocialFormValues = z.infer<typeof socialSchema>;

const SocialLinksForm: React.FC = () => {
  const { profile, updateProfile } = useProfileStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SocialFormValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      twitter: profile.socialLinks.twitter || '',
      github: profile.socialLinks.github || '',
      linkedin: profile.socialLinks.linkedin || '',
      instagram: profile.socialLinks.instagram || '',
      youtube: profile.socialLinks.youtube || '',
      portfolio: profile.socialLinks.portfolio || '',
    }
  });

  const onSubmit = (data: SocialFormValues) => {
    updateProfile({ socialLinks: data });
    reset(data);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <motion.div 
      className={styles.formCard}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
    >
      <h3 className={styles.sectionTitle}>
        <FiShare2 /> Social Profiles
      </h3>
      <p className={styles.sectionSubtitle}>Add links to your social profiles to display them on your public author page.</p>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FiCheckCircle /> Social links updated.
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGrid}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Twitter / X</label>
            <div className={styles.inputGroup}>
              <div className={styles.iconWrapper}><FiTwitter /></div>
              <input {...register('twitter')} className={styles.input} placeholder="https://twitter.com/..." />
            </div>
            {errors.twitter && <span className={styles.errorText}>{errors.twitter.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>LinkedIn</label>
            <div className={styles.inputGroup}>
              <div className={styles.iconWrapper}><FiLinkedin /></div>
              <input {...register('linkedin')} className={styles.input} placeholder="https://linkedin.com/in/..." />
            </div>
            {errors.linkedin && <span className={styles.errorText}>{errors.linkedin.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GitHub</label>
            <div className={styles.inputGroup}>
              <div className={styles.iconWrapper}><FiGithub /></div>
              <input {...register('github')} className={styles.input} placeholder="https://github.com/..." />
            </div>
            {errors.github && <span className={styles.errorText}>{errors.github.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Instagram</label>
            <div className={styles.inputGroup}>
              <div className={styles.iconWrapper}><FiInstagram /></div>
              <input {...register('instagram')} className={styles.input} placeholder="https://instagram.com/..." />
            </div>
            {errors.instagram && <span className={styles.errorText}>{errors.instagram.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>YouTube</label>
            <div className={styles.inputGroup}>
              <div className={styles.iconWrapper}><FiYoutube /></div>
              <input {...register('youtube')} className={styles.input} placeholder="https://youtube.com/c/..." />
            </div>
            {errors.youtube && <span className={styles.errorText}>{errors.youtube.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Portfolio / Other</label>
            <div className={styles.inputGroup}>
              <div className={styles.iconWrapper}><FiGlobe /></div>
              <input {...register('portfolio')} className={styles.input} placeholder="https://..." />
            </div>
            {errors.portfolio && <span className={styles.errorText}>{errors.portfolio.message}</span>}
          </div>

        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.saveBtn} disabled={!isDirty}>
            Save Social Links
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SocialLinksForm;
