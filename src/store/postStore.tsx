/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockPosts } from '../data/postsData';
import type { Post } from '../types';

interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  deletePost: (id: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = (post: Post) => setPosts(prev => [post, ...prev]);
  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostStore() {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePostStore must be used within PostProvider');
  return context;
}
