'use client';

import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { Post } from '@/types/Post';
import Image from 'next/image';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      const res: Response = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
      const { post }: { post: Post } = await res.json();
      setPost(post);
      setIsLoading(false);
    };

    fetcher();
  }, [id]);

  if (isLoading) return <div>読み込み中…</div>;
  if (!post) return <div>記事が存在しません。</div>;
  const { title, thumbnailUrl, createdAt, categories, content } = post;
  const date = new Date(createdAt);

  return (
    <>
      <article className='max-w-3xl mx-auto mt-16'>
        <Image width={800} height={400} src={thumbnailUrl} alt='アイキャッチ画像' className='w-full h-auto' />

        <div className='p-4'>
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
          <div>{parse(content)}</div>
        </div>
      </article>
    </>
  );
};
export default PostPage;
