import { Category } from '@prisma/client/edge';

export type ExtendedCategory = Category & {
  category: {
    id: number;
    name: string;
  };
};
