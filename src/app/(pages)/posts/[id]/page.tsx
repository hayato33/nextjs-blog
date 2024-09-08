'use client';

import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { Post } from '@prisma/client';
import { Category } from '@prisma/client';
import Image from 'next/image';

type ExtendedCategory = Category & {
  category: {
    id: number;
    name: string;
  };
};
type ExtendedPost = Post & {
  postCategories: ExtendedCategory[];
};

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const { post } = await res.json();
        setPost(post);
      }
      setIsLoading(false);
    };

    fetcher();
  }, [id]);

  if (isLoading) return <div>読み込み中…</div>;
  if (!post) return <div>記事が存在しません。</div>;
  const { title, thumbnailUrl, createdAt, postCategories, content } = post;
  const date = new Date(createdAt);

  return (
    <article className='max-w-3xl mx-auto mt-16 px-6'>
      <Image width={800} height={400} src={thumbnailUrl} alt='アイキャッチ画像' className='w-full h-auto aspect-video object-cover' />
      <div className='p-4'>
        <div className='flex justify-between mb-2'>
          <time dateTime={date.toLocaleDateString('sv-SE')} className='text-sm text-gray-400'>
            {date.toLocaleDateString()}
          </time>
          <ul className='flex'>
            {postCategories.map((postCategory) => (
              <li key={postCategory.category.id} className='text-blue-600 border border-blue-600 ml-2 p-1 text-sm rounded'>
                {postCategory.category.name}
              </li>
            ))}
          </ul>
        </div>
        <h2 className='text-2xl mb-4'>{title}</h2>
        <div>{parse(content)}</div>
      </div>
    </article>
  );
};
export default PostPage;
