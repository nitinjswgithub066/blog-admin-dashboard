import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import CreatePostOptions from '../../components/create-post/CreatePostOptions/CreatePostOptions';
import TravelEditor from '../../components/create-post/TravelEditor/TravelEditor';
import DocumentUploadPanel from '../../components/create-post/DocumentUploadPanel/DocumentUploadPanel';
import PostDetailsPanel from '../../components/create-post/PostDetailsPanel/PostDetailsPanel';
import RecentPostGrid from '../../components/create-post/RecentPostGrid/RecentPostGrid';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import type { AdminPost, PostStatus } from '../../types/post.types';
import type { AdminCategory } from '../../types/category.types';
import { slugify } from '../../utils/slugify';
import { calculateReadingTime } from '../../utils/calculateReadingTime';
import { generateCategoryIcon } from '../../utils/generateCategoryIcon';
import styles from './CreatePostPage.module.css';

// Form validation schema
const postSchema = z.object({
  title: z.string().min(3, "Heading is required (min 3 chars)"),
  subtitle: z.string().min(10, "Subheading is required (min 10 chars)"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
});

type PostFormData = z.infer<typeof postSchema>;

const initialCategories: AdminCategory[] = [
  { id: '1', name: 'Technology', slug: 'technology', icon: 'TE', postCount: 12 },
  { id: '2', name: 'Programming', slug: 'programming', icon: 'PR', postCount: 8 },
  { id: '3', name: 'Web Development', slug: 'web-development', icon: 'WD', postCount: 15 },
];

const CreatePostPage: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'document' | null>(null);
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      tags: [],
      status: 'draft',
    }
  });

  useEffect(() => {
    // Load categories
    const storedCats = localStorage.getItem(STORAGE_KEYS.ADMIN_CATEGORIES);
    if (storedCats) {
      setCategories(JSON.parse(storedCats));
    } else {
      setCategories(initialCategories);
      localStorage.setItem(STORAGE_KEYS.ADMIN_CATEGORIES, JSON.stringify(initialCategories));
    }

    // Load posts
    const storedPosts = localStorage.getItem(STORAGE_KEYS.ADMIN_POSTS);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddCategory = (name: string) => {
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const newCat: AdminCategory = {
      id: Date.now().toString(),
      name,
      slug: slugify(name),
      icon: generateCategoryIcon(name),
      postCount: 0
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem(STORAGE_KEYS.ADMIN_CATEGORIES, JSON.stringify(updated));
    setValue('category', name);
  };

  const handleSaveDraft = () => {
    const data = watch();
    if (!data.title) {
      alert("Post heading is required to save a draft.");
      return;
    }
    savePost({ ...data, status: 'draft' } as PostFormData);
  };

  const handlePublish = (data: PostFormData) => {
    if (!content.trim()) {
      alert("Content is required before publishing.");
      return;
    }
    savePost({ ...data, status: 'published' });
  };

  const savePost = (data: PostFormData) => {
    const selectedCategory = categories.find(c => c.name === data.category);
    
    const newPost: AdminPost = {
      id: Date.now().toString(),
      title: data.title,
      subtitle: data.subtitle || '',
      slug: slugify(data.title),
      category: data.category || 'Uncategorized',
      categorySlug: selectedCategory?.slug || 'uncategorized',
      tags: data.tags || [],
      contentType: mode || 'text',
      contentPreview: content.substring(0, 150) + '...',
      coverImage: data.coverImage,
      status: data.status as PostStatus,
      readingTime: calculateReadingTime(content),
      views: 0,
      clicks: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem(STORAGE_KEYS.ADMIN_POSTS, JSON.stringify(updatedPosts));
    
    showToast(`Post ${data.status === 'published' ? 'published' : 'saved as draft'} successfully.`);
    handleReset();
  };

  const handleReset = () => {
    reset({
      title: '',
      subtitle: '',
      category: '',
      tags: [],
      coverImage: '',
      status: 'draft'
    });
    setContent('');
    setMode(null);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Create New Post</h1>
        {mode && (
          <button className={styles.backBtn} onClick={handleReset}>
            Cancel & Go Back
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!mode ? (
          <CreatePostOptions key="options" onSelectOption={setMode} />
        ) : (
          <motion.div 
            key="editorLayout"
            className={styles.editorLayout}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mainContent}>
              {mode === 'text' ? (
                <TravelEditor value={content} onChange={setContent} />
              ) : (
                <DocumentUploadPanel onConverted={setContent} />
              )}
            </div>

            <form onSubmit={handleSubmit(handlePublish)}>
              <PostDetailsPanel 
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                categories={categories}
                onAddCategory={handleAddCategory}
                onSaveDraft={handleSaveDraft}
                onReset={handleReset}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <RecentPostGrid posts={posts} />

      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            className={styles.toast}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FiCheckCircle size={20} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePostPage;
