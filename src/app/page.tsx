'use client';

import { useEffect, useState } from 'react';
import PostItem from '@/app/_components/elements/PostItem';
import { MicroCmsPost } from '@/app/_types/MicroCmsPost';

const TopPage: React.FC = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('https://gv8pgp0hs9.microcms.io/api/v1/posts', {
        headers: {
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const { contents } = await res.json();
      setPosts(contents);
    };

    fetcher();
  }, []);

  return (
    <ul className='grid gap-6 max-w-3xl mt-8 mx-auto'>
      {posts.map((post: MicroCmsPost) => (
        <PostItem key={post.id} {...post} />
      ))}
    </ul>
  );
};
export default TopPage;
