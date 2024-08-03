'use client';

import parse from 'html-react-parser';
import { Post } from '@/types/Post';
import Link from 'next/link';

const PostItem: React.FC<Post> = ({ id, title, createdAt, categories, content }) => {
  const date: Date = new Date(createdAt);
  return (
    <li className='border border-gray-400'>
      <Link href={`/posts/${id}`} className='block p-4 pr-12'>
        <div className='flex justify-between mb-2'>
          <time dateTime={date.toLocaleDateString('sv-SE')} className='text-sm text-gray-400'>
            {date.toLocaleDateString()}
          </time>
          <ul className='flex'>
            {categories.map((category: string) => {
              return (
                <li key={category} className='text-blue-600 border border-blue-600 ml-2 p-1 text-sm rounded'>
                  {category}
                </li>
              );
            })}
          </ul>
        </div>
        <h2 className='text-2xl mb-4'>{title}</h2>
        <div className='line-clamp-2'>{parse(content)}</div>
      </Link>
    </li>
  );
};
export default PostItem;
