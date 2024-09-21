'use client';

import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { Post } from '@prisma/client/edge';
import { Category } from '@prisma/client/edge';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';

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
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

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

  useEffect(() => {
    if (!post || !post.thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from('post_thumbnail').getPublicUrl(post.thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [post]);

  if (isLoading) return <div>読み込み中…</div>;
  if (!post) return <div>記事が存在しません。</div>;

  return (
    <article className='max-w-3xl mx-auto mt-16 px-6'>
      {thumbnailImageUrl && <Image width={800} height={400} src={thumbnailImageUrl} alt='アイキャッチ画像' className='w-full h-auto aspect-video object-cover' />}

      <div className='p-4'>
        <div className='flex justify-between mb-2'>
          <time dateTime={new Date(post.createdAt).toLocaleDateString('sv-SE')} className='text-sm text-gray-400'>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <ul className='flex'>
            {post.postCategories.map((postCategory) => (
              <li key={postCategory.category.id} className='text-blue-600 border border-blue-600 ml-2 p-1 text-sm rounded'>
                {postCategory.category.name}
              </li>
            ))}
          </ul>
        </div>
        <h2 className='text-2xl mb-4'>{post.title}</h2>
        <div>{parse(post.content)}</div>
      </div>
    </article>
  );
};
export default PostPage;
