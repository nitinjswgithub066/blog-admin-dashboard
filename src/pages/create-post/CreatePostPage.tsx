import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiEdit3, FiUploadCloud, FiChevronRight } from 'react-icons/fi';
import TravelEditor from '../../components/create-post/TravelEditor/TravelEditor';
import DocumentUploadPanel from '../../components/create-post/DocumentUploadPanel/DocumentUploadPanel';
import PostDetailsPanel from '../../components/create-post/PostDetailsPanel/PostDetailsPanel';
import RecentPostsPanel from '../../components/create-post/RecentPostsPanel/RecentPostsPanel';
import type { AdminPost, PostStatus } from '../../types/post.types';
import type { AdminCategory } from '../../types/category.types';
import { postService, type DocumentUploadResponse, type PostPayload, type RecentPostFilter } from '../../services/post.service';
import { generateCategoryIcon } from '../../utils/generateCategoryIcon';
import styles from './CreatePostPage.module.css';

const postSchema = z.object({
  title: z.string().min(3, "Heading is required (min 3 chars)"),
  subtitle: z.string().max(450, "Subheading cannot exceed 450 characters."),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  coverImagePublicId: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

type StepState = 'recent' | 'content' | 'publish';
type ContentMethod = 'text' | 'document' | null;

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPostId = searchParams.get('edit') || undefined;
  const requestedMethod = searchParams.get('method');
  const createMethod: ContentMethod = requestedMethod === 'text' || requestedMethod === 'document' ? requestedMethod : null;
  const [currentStep, setCurrentStep] = useState<StepState>('recent');
  const [contentMethod, setContentMethod] = useState<ContentMethod>(null);
  const [content, setContent] = useState('');
  const [activePostId, setActivePostId] = useState<string | undefined>();
  const [contentCss, setContentCss] = useState('');
  const [contentJson, setContentJson] = useState<unknown>({});
  const [sourceType, setSourceType] = useState<'TEXT_EDITOR' | 'DOC_UPLOAD' | 'HTML_UPLOAD'>('TEXT_EDITOR');
  const [conversionStatus, setConversionStatus] = useState<'NONE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('NONE');
  const [originalDocumentUrl, setOriginalDocumentUrl] = useState<string | null>(null);
  const [originalDocumentPublicId, setOriginalDocumentPublicId] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [recentPosts, setRecentPosts] = useState<AdminPost[]>([]);
  const [recentFilter, setRecentFilter] = useState<RecentPostFilter>('all');
  const [isRecentLoading, setIsRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      tags: [],
      status: 'draft',
      title: '',
      subtitle: '',
      category: '',
    }
  });

  const titleWatch = watch('title');

  const loadCategories = useCallback(async () => {
    try {
      const data = await postService.getCategories();
      setCategories(data.map((category) => ({
        ...category,
        icon: generateCategoryIcon(category.name),
        postCount: category.postCount || 0,
      })));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to load categories.');
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadRecentPosts = useCallback(async () => {
    setIsRecentLoading(true);
    setRecentError('');

    try {
      const data = await postService.getRecentPosts(recentFilter);
      setRecentPosts(data);
    } catch (error) {
      setRecentError(error instanceof Error ? error.message : 'Failed to load recent posts.');
    } finally {
      setIsRecentLoading(false);
    }
  }, [recentFilter]);

  useEffect(() => {
    loadRecentPosts();
  }, [loadRecentPosts]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddCategory = async (name: string) => {
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const created = await postService.createCategory(name);
    const newCat: AdminCategory = {
      ...created,
      icon: generateCategoryIcon(name),
      postCount: 0
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    setValue('category', created.id);
  };

  const handleDeleteCategory = async (id: string) => {
    await postService.deleteCategory(id);
    setCategories((current) => current.filter((category) => category.id !== id));
    if (getValues('category') === id) setValue('category', '');
    showToast('Category deleted successfully.');
  };

  const buildPayload = (data: PostFormData): PostPayload => ({
    title: data.title || 'Untitled Blog Document',
    subtitle: data.subtitle || '',
    contentHtml: content,
    contentCss,
    contentJson,
    categoryId: data.category || null,
    tags: data.tags || [],
    coverImageUrl: data.coverImage || null,
    coverImagePublicId: data.coverImagePublicId || null,
    sourceType,
    conversionStatus,
    originalDocumentUrl,
    originalDocumentPublicId,
  });

  const ensureDraftExists = async (payload: PostPayload) => {
    if (activePostId) {
      const updated = await postService.updatePost(activePostId, payload);
      return updated.id;
    }
    const draft = await postService.createDraft(payload);
    setActivePostId(draft.id);
    return draft.id;
  };

  const handleSaveDraft = async () => {
    const data = getValues();
    if (!data.title) {
      alert("Post heading is required to save a draft.");
      return;
    }
    await savePost({ ...data, status: 'draft' } as PostFormData);
  };

  const handlePublish = async (data: PostFormData) => {
    if (!content.trim()) {
      alert("Content is required before publishing/scheduling.");
      return;
    }
    await savePost({ ...data });
  };

  const savePost = async (data: PostFormData) => {
    try {
      const payload = buildPayload(data);
      let saved: AdminPost;

      if (data.status === 'published') {
        const id = await ensureDraftExists(payload);
        saved = await postService.publishPost(id, payload);
      } else if (data.status === 'scheduled') {
        if (!data.scheduledDate || !data.scheduledTime) {
          throw new Error('Schedule time must be in future.');
        }
        const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
        const id = await ensureDraftExists(payload);
        saved = await postService.schedulePost(id, { ...payload, scheduledAt: scheduledAt.toISOString() });
      } else if (activePostId) {
        saved = await postService.updatePost(activePostId, { ...payload, status: 'draft' });
      } else {
        saved = await postService.createDraft(payload);
      }

      const actionMap: Partial<Record<PostStatus, string>> = {
        draft: 'saved as draft',
        published: 'published',
        scheduled: 'scheduled',
        archived: 'archived'
      };
      showToast(`Post ${actionMap[saved.status]} successfully.`);
      handleReset();
      await loadRecentPosts();
      setCurrentStep('recent');
      setContentMethod(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Save failed.');
    }
  };

  const handleReset = () => {
    setActivePostId(undefined);
    reset({
      title: '',
      subtitle: '',
      category: '',
      tags: [],
      coverImage: '',
      coverImagePublicId: '',
      status: 'draft',
      scheduledDate: '',
      scheduledTime: '',
    });
    setContent('');
    setContentCss('');
    setContentJson({});
    setSourceType('TEXT_EDITOR');
    setConversionStatus('NONE');
    setOriginalDocumentUrl(null);
    setOriginalDocumentPublicId(null);
  };

  const handleMethodSelect = (method: ContentMethod) => {
    setContentMethod(method);
  };

  const handleWritePost = () => {
    handleReset();
    setContentMethod(null);
    setCurrentStep('content');
  };

  const handleFilterChange = (filter: RecentPostFilter) => {
    setRecentFilter(filter);
  };

  const handleEditPost = async (id: string) => {
    try {
      const post = await postService.getPostById(id);
      const editableStatus = ['draft', 'published', 'scheduled'].includes(post.status) ? post.status : 'draft';

      setActivePostId(post.id);
      reset({
        title: post.title,
        subtitle: post.subtitle || '',
        category: post.categoryId || '',
        tags: post.tags || [],
        coverImage: post.coverImageUrl || post.optimizedCoverUrl || '',
        coverImagePublicId: post.coverImagePublicId || '',
        status: editableStatus as PostFormData['status'],
        scheduledDate: post.scheduledAt ? post.scheduledAt.slice(0, 10) : '',
        scheduledTime: post.scheduledAt ? post.scheduledAt.slice(11, 16) : '',
      });
      setContent(post.contentHtml || post.contentPreview || '');
      setContentCss(post.contentCss || '');
      setContentJson(post.contentJson || {});
      setSourceType(post.sourceType || 'TEXT_EDITOR');
      setConversionStatus(post.conversionStatus || 'NONE');
      setOriginalDocumentUrl(post.originalDocumentUrl || null);
      setOriginalDocumentPublicId(post.originalDocumentPublicId || null);
      setContentMethod('text');
      setCurrentStep('content');
      showToast('Post loaded in editor.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to load post.');
    }
  };

  const handlePreviewPost = (id: string) => {
    navigate(`/create-post/preview/${id}`);
  };

  useEffect(() => {
    if (editPostId || !createMethod) return;

    setActivePostId(undefined);
    reset({
      title: '',
      subtitle: '',
      category: '',
      tags: [],
      coverImage: '',
      coverImagePublicId: '',
      status: 'draft',
      scheduledDate: '',
      scheduledTime: '',
    });
    setContent('');
    setContentCss('');
    setContentJson({});
    setSourceType('TEXT_EDITOR');
    setConversionStatus('NONE');
    setOriginalDocumentUrl(null);
    setOriginalDocumentPublicId(null);
    setContentMethod(createMethod);
    setCurrentStep('content');
  }, [createMethod, editPostId, reset]);

  useEffect(() => {
    if (!editPostId) return;

    let isMounted = true;

    const loadPostForEditing = async () => {
      try {
        const post = await postService.getPostById(editPostId);
        const editableStatus = ['draft', 'published', 'scheduled'].includes(post.status) ? post.status : 'draft';

        if (!isMounted) return;

        setActivePostId(post.id);
        reset({
          title: post.title,
          subtitle: post.subtitle || '',
          category: post.categoryId || '',
          tags: post.tags || [],
          coverImage: post.coverImageUrl || post.optimizedCoverUrl || '',
          coverImagePublicId: post.coverImagePublicId || '',
          status: editableStatus as PostFormData['status'],
          scheduledDate: post.scheduledAt ? post.scheduledAt.slice(0, 10) : '',
          scheduledTime: post.scheduledAt ? post.scheduledAt.slice(11, 16) : '',
        });
        setContent(post.contentHtml || post.contentPreview || '');
        setContentCss(post.contentCss || '');
        setContentJson(post.contentJson || {});
        setSourceType(post.sourceType || 'TEXT_EDITOR');
        setConversionStatus(post.conversionStatus || 'NONE');
        setOriginalDocumentUrl(post.originalDocumentUrl || null);
        setOriginalDocumentPublicId(post.originalDocumentPublicId || null);
        setContentMethod('text');
        setCurrentStep('content');
        showToast('Post loaded in editor.');
      } catch (error) {
        if (isMounted) showToast(error instanceof Error ? error.message : 'Failed to load post.');
      }
    };

    loadPostForEditing();

    return () => {
      isMounted = false;
    };
  }, [editPostId, reset]);

  const handleDeletePost = async (id: string) => {
    const shouldDelete = window.confirm('Move this post to archive? It will be permanently removed after 14 days.');
    if (!shouldDelete) return;

    try {
      await postService.deletePost(id);
      setRecentPosts((current) => current.filter((post) => post.id !== id));
      showToast('Post moved to archive for 14 days.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete post.');
    }
  };

  const handleArchivePost = async (id: string) => {
    try {
      await postService.archivePost(id);
      setRecentPosts((current) => current.filter((post) => post.id !== id));
      showToast('Post archived successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to archive post.');
    }
  };

  const handleRestorePost = async (id: string) => {
    try {
      await postService.restorePost(id);
      setRecentPosts((current) => current.filter((post) => post.id !== id));
      showToast('Post restored as draft successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to restore post.');
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const upload = await postService.uploadCoverImage(file);
      setValue('coverImage', upload.url);
      setValue('coverImagePublicId', upload.publicId);
      showToast('Cover image uploaded successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Cover upload failed.');
    }
  };

  const handleInlineImageUpload = async (file: File) => {
    const upload = await postService.uploadInlineImage(file);
    return { url: upload.url, publicId: upload.publicId };
  };

  const handleDocumentConverted = (data: DocumentUploadResponse) => {
    setContent(data.contentHtml);
    setContentCss(data.contentCss || '');
    setSourceType(data.sourceType);
    setConversionStatus(data.conversionStatus);
    setOriginalDocumentUrl(data.originalDocumentUrl || null);
    setOriginalDocumentPublicId(data.originalDocumentPublicId || null);
    if (!getValues('title') && data.title) {
      setValue('title', data.title);
    }
    setContentMethod('text');
  };

  const goToStep = (step: StepState) => {
    setCurrentStep(step);
    if (step === 'recent') {
      setContentMethod(null); // reset method when going back to library
    }
  };

  const renderStepper = () => (
    <div className={styles.stepperContainer}>
      <div className={styles.stepperSteps}>
        <button
          type="button"
          className={`${styles.step} ${styles.stepButton} ${styles.stepButtonInteractive} ${currentStep === 'recent' ? styles.stepActive : ''}`}
          onClick={() => goToStep('recent')}
          aria-label="Go to recent posts step"
        >
          <span className={styles.stepNum}>1</span>
          <span className={styles.stepLabel}>Recent</span>
        </button>
        <FiChevronRight className={styles.stepDivider} />
        
        <button
          type="button"
          className={`${styles.step} ${styles.stepButton} ${currentStep === 'publish' ? styles.stepButtonInteractive : ''} ${currentStep === 'content' ? styles.stepActive : ''} ${currentStep === 'publish' ? styles.stepCompleted : ''}`}
          onClick={() => currentStep === 'publish' && goToStep('content')}
          aria-label="Go to content step"
        >
          <span className={styles.stepNum}>2</span>
          <span className={styles.stepLabel}>Content</span>
        </button>
        <FiChevronRight className={styles.stepDivider} />
        
        <button
          type="button"
          className={`${styles.step} ${styles.stepButton} ${currentStep === 'publish' ? styles.stepActive : ''}`}
          aria-label="Publish step"
          disabled
        >
          <span className={styles.stepNum}>3</span>
          <span className={styles.stepLabel}>Publish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.createPostPage}>
      {renderStepper()}

      <div className={styles.createPostContainer}>
        <AnimatePresence mode="wait">
          
          {/* STEP 1: RECENT POSTS */}
          {currentStep === 'recent' && (
            <motion.div 
              key="step-recent"
              className={styles.stepWrapper}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <RecentPostsPanel
                posts={recentPosts}
                activeFilter={recentFilter}
                isLoading={isRecentLoading}
                error={recentError}
                onWritePost={handleWritePost}
                onFilterChange={handleFilterChange}
                onEditPost={handleEditPost}
                onPreviewPost={handlePreviewPost}
                onDeletePost={handleDeletePost}
                onArchivePost={handleArchivePost}
                onRestorePost={handleRestorePost}
              />
            </motion.div>
          )}

          {/* STEP 2: CONTENT CREATION */}
          {currentStep === 'content' && (
            <motion.div 
              key="step-content"
              className={styles.stepWrapper}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {!contentMethod ? (
                <div className={styles.methodSelectContainer}>
                  <div className={styles.methodCard} onClick={() => handleMethodSelect('text')}>
                    <div className={styles.methodIcon}><FiEdit3 /></div>
                    <h3>Text Editor</h3>
                    <p>Write manually using a Word / Google Docs style editor.</p>
                  </div>
                  <div className={styles.methodCard} onClick={() => handleMethodSelect('document')}>
                    <div className={styles.methodIcon}><FiUploadCloud /></div>
                    <h3>Upload Document</h3>
                    <p>Upload Word / exported document and convert it into HTML.</p>
                  </div>
                </div>
              ) : (
                <div className={styles.editorContainer}>
                  {contentMethod === 'text' && (
                    <TravelEditor 
                      value={content} 
                      onChange={setContent}
                      title={titleWatch}
                      onTitleChange={(val) => setValue('title', val)}
                      onContinue={() => setCurrentStep('publish')}
                      onInlineImageUpload={handleInlineImageUpload}
                    />
                  )}
                  {contentMethod === 'document' && (
                    <DocumentUploadPanel 
                      onConverted={handleDocumentConverted}
                      onContinue={() => setCurrentStep('publish')}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: PUBLISH DETAILS */}
          {currentStep === 'publish' && (
            <motion.div 
              key="step-publish"
              className={styles.stepWrapper}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className={styles.detailsContainer}>
                <form onSubmit={handleSubmit(handlePublish)} className={styles.publishForm}>
                  <PostDetailsPanel 
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    categories={categories}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onUploadCoverImage={handleCoverUpload}
                    onSaveDraft={handleSaveDraft}
                    onReset={handleReset}
                    onBack={() => setCurrentStep('content')}
                  />
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
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
