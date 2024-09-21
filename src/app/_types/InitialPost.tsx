import { Category } from './Category';

export interface InitialPost {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
}
