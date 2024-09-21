import { Post } from '@prisma/client/edge';
import { ExtendedCategory } from './ExtendedCategory';

export type ExtendedPost = Post & {
  postCategories: ExtendedCategory[];
};
