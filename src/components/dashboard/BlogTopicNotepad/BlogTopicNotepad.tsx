/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiCheck, FiBookOpen } from 'react-icons/fi';
import { dashboardService } from '../../../services/dashboard.service';
import type { BlogTopicIdea } from '../../../services/dashboard.service';
import styles from './BlogTopicNotepad.module.css';

const DEFAULT_CATEGORIES = [
  'Technology', 'Programming', 'AI', 'Career', 'Startups', 'Thoughts'
];

const BlogTopicNotepad: React.FC = () => {
  const [topics, setTopics] = useState<BlogTopicIdea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCount = topics.filter(t => !t.isCompleted).length;

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getTopicNotes();
      setTopics(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || activeCount >= 5) return;

    setError(null);
    try {
      const newTopic = await dashboardService.createTopicNote(newTitle.trim(), newCategory || undefined);
      setTopics([newTopic, ...topics]);
      setNewTitle('');
      setNewCategory('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dashboardService.deleteTopicNote(id);
      setTopics(topics.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleCompleted = async (topic: BlogTopicIdea) => {
    try {
      const updated = await dashboardService.updateTopicNote(topic.id, !topic.isCompleted);
      setTopics(topics.map(t => t.id === topic.id ? updated : t));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Blog Topic Notepad</h3>
        <p className={styles.subtitle}>Save up to 5 next post ideas</p>
      </div>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Write next blog topic..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={activeCount >= 5}
            maxLength={100}
          />
        </div>
        
        <div className={styles.actionsRow}>
          <select
            className={styles.select}
            aria-label="Topic category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            disabled={activeCount >= 5}
          >
            <option className={styles.option} value="">Category</option>
            {DEFAULT_CATEGORIES.map(cat => (
              <option className={styles.option} key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <div className={styles.actionsRight}>
            <AnimatePresence>
              {(activeCount >= 5 || error) && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`${styles.limitMsg} ${error ? styles.errorMsg : ''}`}
                >
                  {error || "Maximum 5 active blog ideas allowed."}
                </motion.span>
              )}
            </AnimatePresence>
            
            <button 
              type="submit" 
              className={styles.addBtn}
              disabled={!newTitle.trim() || activeCount >= 5}
            >
              <FiPlus /> Add Topic
            </button>
          </div>
        </div>
      </form>

      <div className={styles.topicList}>
        <AnimatePresence initial={false}>
          {topics.map(topic => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`${styles.topicItem} ${topic.isCompleted ? styles.completed : ''}`}
            >
              <div className={styles.itemMain}>
                <button 
                  className={styles.checkBtn}
                  onClick={() => toggleCompleted(topic)}
                  aria-label="Mark complete"
                >
                  <div className={styles.checkbox}>
                    {topic.isCompleted && <FiCheck size={12} />}
                  </div>
                </button>
                
                <div className={styles.itemInfo}>
                  <span className={styles.topicTitle}>{topic.title}</span>
                  <div className={styles.itemMeta}>
                    {topic.category && (
                      <span className={styles.badge}>{typeof topic.category === 'string' ? topic.category : topic.category.name}</span>
                    )}
                    {topic.category && <span className={styles.dot}>·</span>}
                    <span className={styles.date}>{new Date(topic.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button 
                className={styles.deleteBtn}
                onClick={() => handleDelete(topic.id)}
                aria-label="Delete idea"
              >
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading ? (
          <div className={styles.loadingState}>Loading topics...</div>
        ) : topics.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyState}
          >
            <div className={styles.emptyIcon}>
              <FiBookOpen />
            </div>
            <p className={styles.emptyTitle}>No ideas saved yet</p>
            <p className={styles.emptyHint}>Write a topic above and save it before you forget.</p>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default BlogTopicNotepad;
