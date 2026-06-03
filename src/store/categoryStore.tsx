/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockCategories } from '../data/categoriesData';
import type { Category } from '../types';
import { slugify } from '../utils';

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug: slugify(name),
      postCount: 0
    };
    setCategories(prev => [...prev, newCategory]);
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryStore() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategoryStore must be used within CategoryProvider');
  return context;
}
