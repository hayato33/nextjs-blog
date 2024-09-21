import { Category } from './Category';

export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: string;
  updatedAt: string;
  postCategories: Category[];
}
