import React, { useState, useRef } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FiImage, FiX, FiClock, FiCalendar } from 'react-icons/fi';
import { slugify } from '../../../utils/slugify';
import type { AdminCategory } from '../../../types/category.types';
import type { PostFormData } from '../../../pages/create-post/CreatePostPage';
import styles from './PostDetailsPanel.module.css';

interface PostDetailsPanelProps {
  register: UseFormRegister<PostFormData>;
  errors: FieldErrors<PostFormData>;
  watch: UseFormWatch<PostFormData>;
  setValue: UseFormSetValue<PostFormData>;
  categories: AdminCategory[];
  onAddCategory: (name: string) => void;
  onSaveDraft: () => void;
  onReset: () => void;
  onBack?: () => void;
}

const PostDetailsPanel: React.FC<PostDetailsPanelProps> = ({
  register,
  errors,
  watch,
  setValue,
  categories,
  onAddCategory,
  onSaveDraft,
  onReset,
  onBack
}) => {
  const [newCat, setNewCat] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const heading = watch('title');
  const tags = watch('tags') || [];
  const coverImage = watch('coverImage');
  const status = watch('status') || 'draft';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugPreview = heading ? slugify(heading) : 'auto-generated-slug';

  const handleAddCategory = () => {
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setValue('tags', [...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((t: string) => t !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue('coverImage', url);
    }
  };

  const getPublishButtonText = () => {
    if (status === 'published') return 'Publish';
    if (status === 'scheduled') return 'Schedule Post';
    return 'Save Draft';
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelScroll}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 1. Post Basics (Visible) */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Post Details</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Post Heading</label>
              <input 
                className={styles.input} 
                placeholder="Enter blog post heading..." 
                {...register('title')} 
              />
              {errors.title && <span className={styles.errorText}>{errors.title.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>SEO Slug Preview</label>
              <div className={styles.slugPreview}>
                /category/{slugPreview}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Post Subheading</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Write a short summary for this post..." 
                {...register('subtitle')} 
              />
              {errors.subtitle && <span className={styles.errorText}>{errors.subtitle.message as string}</span>}
            </div>
          </div>

          {/* 2. Cover Image (Visible) */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Cover Image</h3>
            <div 
              className={styles.imageUpload} 
              onClick={() => fileInputRef.current?.click()}
            >
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className={styles.uploadImagePreview} />
              ) : (
                <div className={styles.uploadImageText}>
                  <FiImage size={24} />
                  <span>Click to upload 16:9 image</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className={styles.hiddenInput} 
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            {coverImage && (
              <button 
                type="button" 
                className={styles.removeImageBtn} 
                onClick={(e) => { e.stopPropagation(); setValue('coverImage', ''); }}
              >
                Remove Image
              </button>
            )}
          </div>

          {/* 3. Taxonomy (Visible) */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Organization</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} {...register('category')}>
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.category && <span className={styles.errorText}>{errors.category.message as string}</span>}
            </div>
            
            <div className={styles.addCategoryRow}>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Add new category" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <button type="button" className={styles.addCategoryBtn} onClick={handleAddCategory}>Add</button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tags</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Type tag and press Enter" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {tags.length > 0 && (
                <div className={styles.tagsContainer}>
                  {tags.map((tag: string) => (
                    <span key={tag} className={styles.tagChip}>
                      {tag}
                      <button type="button" className={styles.removeTagBtn} onClick={() => removeTag(tag)}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Publishing & Schedule Options */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Publishing Options</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {status === 'scheduled' && (
              <div className={styles.scheduleGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}><FiCalendar style={{ display: 'inline' }} /> Date</label>
                  <input type="date" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}><FiClock style={{ display: 'inline' }} /> Time</label>
                  <input type="time" className={styles.input} />
                </div>
              </div>
            )}
            
            <button type="button" className={styles.resetBtn} onClick={onReset}>Reset Form</button>
          </div>
        </div>
      </div>

      {/* Footer aligned to absolute bottom of editor */}
      <div className={styles.panelFooter}>
        <div className={styles.actions}>
          <div className={styles.btnRow}>
            {onBack && (
              <button type="button" className={styles.backBtn} onClick={onBack}>Back</button>
            )}
            {status !== 'draft' && (
              <button type="button" className={styles.draftBtn} onClick={onSaveDraft}>Save Draft</button>
            )}
            <button type="submit" className={styles.publishBtn}>{getPublishButtonText()}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPanel;
