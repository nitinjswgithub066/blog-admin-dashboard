export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  postCount: number;
};
