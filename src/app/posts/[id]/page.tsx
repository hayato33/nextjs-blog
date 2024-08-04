'use client';

import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { MicroCmsPost } from '@/app/_types/MicroCmsPost';
import Image from 'next/image';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`https://gv8pgp0hs9.microcms.io/api/v1/posts/${id}`, {
        headers: {
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
      setIsLoading(false);
    };

    fetcher();
  }, [id]);

  if (isLoading) return <div>読み込み中…</div>;
  if (!post) return <div>記事が存在しません。</div>;
  const { title, thumbnail, createdAt, categories, content } = post;
  const date = new Date(createdAt);

  return (
    <article className='max-w-3xl mx-auto mt-16'>
      <Image width={800} height={400} src={thumbnail.url} alt='アイキャッチ画像' className='w-full h-auto' />
      <div className='p-4'>
        <div className='flex justify-between mb-2'>
          <time dateTime={date.toLocaleDateString('sv-SE')} className='text-sm text-gray-400'>
            {date.toLocaleDateString()}
          </time>
          <ul className='flex'>
            {categories.map((category) => {
              return (
                <li key={category.id} className='text-blue-600 border border-blue-600 ml-2 p-1 text-sm rounded'>
                  {category.name}
                </li>
              );
            })}
          </ul>
        </div>
        <h2 className='text-2xl mb-4'>{title}</h2>
        <div>{parse(content)}</div>
      </div>
    </article>
  );
};
export default PostPage;
