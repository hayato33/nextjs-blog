'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Post } from '@/app/_types/Post';

const AdminPostTopPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/posts');
      const { posts } = await res.json();
      setPosts(posts);
      setIsLoading(false);
    };

    fetcher();
  }, []);

  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>記事一覧</h2>
        <Link href='/admin/posts/new' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700'>
          新規作成
        </Link>
      </div>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : posts.length === 0 ? (
        <p>記事がありません。</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className='border-b p-4'>
              <Link href={`/admin/posts/${post.id}`}>
                <p className='font-bold'>{post.title}</p>
                <p className='text-sm text-gray-600'>
                  最終更新：<time dateTime={new Date(post.updatedAt).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(' ', 'T')}>{new Date(post.updatedAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default AdminPostTopPage;
