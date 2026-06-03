import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiCheck, FiBookOpen } from 'react-icons/fi';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { BlogTopicIdea } from '../../../types';
import styles from './BlogTopicNotepad.module.css';

const DEFAULT_CATEGORIES = [
  'Technology', 'Programming', 'AI', 'Career', 'Startups', 'Thoughts'
];

const BlogTopicNotepad: React.FC = () => {
  const [topics, setTopics] = useState<BlogTopicIdea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_TOPIC_IDEAS);
    if (saved) {
      try {
        setTopics(JSON.parse(saved));
      } catch (e) {
        setTopics([]);
      }
    } else {
      setTopics([]);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.BLOG_TOPIC_IDEAS, JSON.stringify(topics));
    }
  }, [topics, isLoaded]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || topics.length >= 5) return;

    const newTopic: BlogTopicIdea = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      category: newCategory || undefined,
      createdAt: new Date().toISOString(),
      completed: false
    };

    setTopics([newTopic, ...topics]);
    setNewTitle('');
    setNewCategory('');
  };

  const handleDelete = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setTopics(topics.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
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
            disabled={topics.length >= 5}
            maxLength={100}
          />
        </div>
        
        <div className={styles.actionsRow}>
          <select
            className={styles.select}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            disabled={topics.length >= 5}
          >
            <option value="">Category</option>
            {DEFAULT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            type="submit" 
            className={styles.addBtn}
            disabled={!newTitle.trim() || topics.length >= 5}
          >
            <FiPlus /> Add Topic
          </button>
          
          <AnimatePresence>
            {topics.length >= 5 && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={styles.limitMsg}
              >
                Maximum 5 blog ideas allowed.
              </motion.span>
            )}
          </AnimatePresence>
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
              className={`${styles.topicItem} ${topic.completed ? styles.completed : ''}`}
            >
              <div className={styles.itemMain}>
                <button 
                  className={styles.checkBtn}
                  onClick={() => toggleCompleted(topic.id)}
                  aria-label="Mark complete"
                >
                  <div className={styles.checkbox}>
                    {topic.completed && <FiCheck size={12} />}
                  </div>
                </button>
                
                <div className={styles.itemInfo}>
                  <span className={styles.topicTitle}>{topic.title}</span>
                  <div className={styles.itemMeta}>
                    {topic.category && (
                      <span className={styles.badge}>{topic.category}</span>
                    )}
                    {topic.category && <span className={styles.dot}>·</span>}
                    <span className={styles.date}>Today</span>
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
        
        {topics.length === 0 && (
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
        )}
      </div>
    </div>
  );
};

export default BlogTopicNotepad;
