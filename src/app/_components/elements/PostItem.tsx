'use client';

import parse from 'html-react-parser';
import { Post } from '@/app/_types/Post';
import Link from 'next/link';

const PostItem: React.FC<Post> = ({ id, title, createdAt, postCategories, content }) => {
  const date: Date = new Date(createdAt);
  return (
    <li className='border border-gray-400'>
      <Link href={`/posts/${id}`} className='block p-4 pr-12'>
        <div className='flex justify-between mb-2'>
          <time dateTime={date.toLocaleDateString('sv-SE')} className='text-sm text-gray-400'>
            {date.toLocaleDateString()}
          </time>
          <ul className='flex'>
            {postCategories.map((postCategory) => {
              return (
                <li key={postCategory.category.id} className='text-blue-600 border border-blue-600 ml-2 p-1 text-sm rounded'>
                  {postCategory.category.name}
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
