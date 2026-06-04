import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiEdit3, FiUploadCloud } from 'react-icons/fi';
import TravelEditor from '../../components/create-post/TravelEditor/TravelEditor';
import DocumentUploadPanel from '../../components/create-post/DocumentUploadPanel/DocumentUploadPanel';
import PostDetailsPanel from '../../components/create-post/PostDetailsPanel/PostDetailsPanel';
import RecentPostsPanel from '../../components/create-post/RecentPostsPanel/RecentPostsPanel';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import type { AdminPost, PostStatus } from '../../types/post.types';
import type { AdminCategory } from '../../types/category.types';
import { slugify } from '../../utils/slugify';
import { calculateReadingTime } from '../../utils/calculateReadingTime';
import { generateCategoryIcon } from '../../utils/generateCategoryIcon';
import styles from './CreatePostPage.module.css';

const postSchema = z.object({
  title: z.string().min(3, "Heading is required (min 3 chars)"),
  subtitle: z.string().min(10, "Subheading is required (min 10 chars)"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
});

type PostFormData = z.infer<typeof postSchema>;

type ViewState = 'library' | 'select-method' | 'text-editor' | 'upload-document';

const initialCategories: AdminCategory[] = [
  { id: '1', name: 'Technology', slug: 'technology', icon: 'TE', postCount: 12 },
  { id: '2', name: 'Programming', slug: 'programming', icon: 'PR', postCount: 8 },
  { id: '3', name: 'Web Development', slug: 'web-development', icon: 'WD', postCount: 15 },
];

const CreatePostPage: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('library');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      tags: [],
      status: 'draft',
      title: '',
    }
  });

  const titleWatch = watch('title');

  useEffect(() => {
    const storedCats = localStorage.getItem(STORAGE_KEYS.ADMIN_CATEGORIES);
    if (storedCats) {
      setCategories(JSON.parse(storedCats));
    } else {
      setCategories(initialCategories);
      localStorage.setItem(STORAGE_KEYS.ADMIN_CATEGORIES, JSON.stringify(initialCategories));
    }

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
    const data = getValues();
    if (!data.title) {
      alert("Post heading is required to save a draft.");
      return;
    }
    savePost({ ...data, status: 'draft' } as PostFormData);
  };

  const handlePublish = (data: PostFormData) => {
    if (!content.trim()) {
      alert("Content is required before publishing/scheduling.");
      return;
    }
    savePost({ ...data });
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
      contentType: 'text',
      contentPreview: content.substring(0, 150) + '...',
      coverImage: data.coverImage,
      author: 'Current User',
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
    
    const actionMap: Record<PostStatus, string> = { draft: 'saved as draft', published: 'published', scheduled: 'scheduled', archived: 'archived' };
    showToast(`Post ${actionMap[data.status as PostStatus]} successfully.`);
    handleReset();
    setViewState('library');
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
  };

  const handleMethodSelect = (method: 'text-editor' | 'upload-document') => {
    setViewState(method);
  };

  const isCreationView = viewState !== 'library';

  return (
    <div className={styles.createPostPage}>
      <div className={styles.createPostLayout}>
        
        {/* Panel 1: Library (Hidden on mobile if creating) */}
        <div className={`${styles.panelWrapper} ${isCreationView ? styles.hideOnMobile : ''}`}>
          <RecentPostsPanel posts={posts} onWritePost={() => setViewState('select-method')} />
        </div>

        {/* Panel 2 & 3: Workspace & Details (Shown if creating, or always on desktop) */}
        <div className={`${styles.workspaceWrapper} ${!isCreationView ? styles.hideOnMobile : ''}`}>
          
          {/* Panel 2: Central Creation Area */}
          <div className={styles.centralPanel}>
            <AnimatePresence mode="wait">
              
              {viewState === 'select-method' && (
                <motion.div 
                  key="method-select"
                  className={styles.methodSelectContainer}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <div className={styles.methodCard} onClick={() => handleMethodSelect('text-editor')}>
                    <div className={styles.methodIcon}><FiEdit3 /></div>
                    <h3>Text Editor</h3>
                    <p>Start with a blank canvas and write directly in the browser.</p>
                  </div>
                  <div className={styles.methodCard} onClick={() => handleMethodSelect('upload-document')}>
                    <div className={styles.methodIcon}><FiUploadCloud /></div>
                    <h3>Upload Document</h3>
                    <p>Import from a Word document or Google Docs export.</p>
                  </div>
                </motion.div>
              )}

              {viewState === 'text-editor' && (
                <motion.div 
                  key="text-editor"
                  className={styles.editorContainer}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <TravelEditor 
                    value={content} 
                    onChange={setContent}
                    title={titleWatch}
                    onTitleChange={(val) => setValue('title', val)}
                  />
                </motion.div>
              )}

              {viewState === 'upload-document' && (
                <motion.div 
                  key="upload-document"
                  className={styles.editorContainer}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <DocumentUploadPanel 
                    onConverted={(html) => {
                      setContent(prev => prev + html);
                    }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panel 3: Post Details */}
          {(viewState === 'text-editor' || viewState === 'upload-document') && (
            <div className={styles.detailsPanel}>
              <form onSubmit={handleSubmit(handlePublish)} style={{ height: '100%' }}>
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
            </div>
          )}
          
        </div>
      </div>

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
