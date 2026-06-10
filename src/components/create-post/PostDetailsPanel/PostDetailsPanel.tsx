import React, { useState, useRef } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FiImage, FiX, FiClock, FiCalendar, FiTrash2 } from 'react-icons/fi';
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
  onAddCategory: (name: string) => Promise<void> | void;
  onDeleteCategory?: (id: string) => Promise<void> | void;
  onUploadCoverImage: (file: File) => Promise<void>;
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
  onDeleteCategory,
  onUploadCoverImage,
  onSaveDraft,
  onReset,
  onBack
}) => {
  const [newCat, setNewCat] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  
  const heading = watch('title');
  const selectedCategoryId = watch('category');
  const tags = watch('tags') || [];
  const coverImage = watch('coverImage');
  const status = watch('status') || 'draft';
  const subtitle = watch('subtitle') || '';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const slugPreview = heading ? slugify(heading) : 'auto-generated-slug';

  const handleAddCategory = async () => {
    if (newCat.trim()) {
      setCategoryMessage('');
      await onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  const handleDeleteSelectedCategory = async () => {
    if (!selectedCategory || !onDeleteCategory) return;
    const confirmed = window.confirm(`Delete category "${selectedCategory.name}"?`);
    if (!confirmed) return;

    setCategoryMessage('');
    try {
      await onDeleteCategory(selectedCategory.id);
      setCategoryMessage('Category deleted successfully.');
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : 'Failed to delete category.');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (tags.length >= 10) {
        return;
      }
      if (val && !tags.some((tag: string) => tag.toLowerCase() === val.toLowerCase())) {
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
      onUploadCoverImage(file);
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
        <div className={styles.panelContent}>
          
          {/* 1. Post Basics (Visible) */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Post Details</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="post-heading">Post Heading</label>
              <input 
                id="post-heading"
                className={styles.input} 
                placeholder="Enter blog post heading..." 
                {...register('title')} 
              />
              {errors.title && <span className={styles.errorText}>{errors.title.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>SEO Slug Preview</label>
              <div className={styles.slugPreview}>
                /{selectedCategory?.slug || 'category'}/{slugPreview}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="post-subheading">Post Subheading</label>
              <textarea 
                id="post-subheading"
                className={styles.textarea} 
                placeholder="Write a short summary for this post..." 
                maxLength={450}
                {...register('subtitle')} 
              />
              <span className={styles.charCount}>{subtitle.length}/450</span>
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
                aria-label="Upload cover image"
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
              <label className={styles.label} htmlFor="post-category">Category</label>
              <div className={styles.selectActionRow}>
                <select id="post-category" className={styles.select} {...register('category')}>
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {selectedCategory && onDeleteCategory && (
                  <button
                    type="button"
                    className={styles.deleteCategoryIconBtn}
                    title={`Delete ${selectedCategory.name}`}
                    aria-label={`Delete category ${selectedCategory.name}`}
                    onClick={handleDeleteSelectedCategory}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              {categoryMessage && (
                <span className={`${styles.categoryMessage} ${categoryMessage.includes('used by posts') ? styles.categoryError : ''}`}>
                  {categoryMessage}
                </span>
              )}
              {errors.category && <span className={styles.errorText}>{errors.category.message as string}</span>}
            </div>
            
            <div className={styles.addCategoryRow}>
              <input 
                id="new-category"
                aria-label="Add new category"
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
              <label className={styles.label} htmlFor="post-tags">Tags ({tags.length}/10)</label>
              <input 
                id="post-tags"
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
                      <button
                        type="button"
                        className={styles.removeTagBtn}
                        title={`Remove tag ${tag}`}
                        aria-label={`Remove tag ${tag}`}
                        onClick={() => removeTag(tag)}
                      >
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
              <label className={styles.label} htmlFor="post-status">Status</label>
              <select id="post-status" className={styles.select} {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {status === 'scheduled' && (
              <div className={styles.scheduleGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="scheduled-date"><FiCalendar className={styles.labelIcon} /> Date</label>
                  <input id="scheduled-date" type="date" className={styles.input} {...register('scheduledDate')} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="scheduled-time"><FiClock className={styles.labelIcon} /> Time</label>
                  <input id="scheduled-time" type="time" className={styles.input} {...register('scheduledTime')} />
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
