'use client';

import { useEffect, useState } from 'react';
import PostItem from '@/app/_components/elements/PostItem';
import { Post } from '@/app/_types/Post';

const TopPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/posts');
      const { posts } = await res.json();
      setPosts(posts);
      setIsLoading(false);
    };

    fetcher();
  }, []);

  return (
    <div className='max-w-3xl mt-8 mx-auto px-6'>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : posts.length === 0 ? (
        <p>記事がありません。</p>
      ) : (
        <ul className='grid gap-6'>
          {posts.map((post: Post) => (
            <PostItem key={post.id} {...post} />
          ))}
        </ul>
      )}
    </div>
  );
};
export default TopPage;
