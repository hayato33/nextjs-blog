'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import request from '@/app/_utils/api';
import PostForm from '@/app/_components/elements/PostForm';
import { ExtendedPost } from '@/app/_types/ExtendedPost';
import { InitialPost } from '@/app/_types/InitialPost';

// 管理画面_新規投稿ページ
const AdminPostCreatePage: React.FC = () => {
  const { token } = useSupabaseSession();
  const initialPostState = {
    title: '',
    content: '',
    thumbnailImageKey: '',
    categories: [],
  };
  const router = useRouter();
  const [post, setPost] = useState<ExtendedPost | InitialPost | null>(initialPostState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);

    try {
      const res = await request(
        '/api/admin/posts',
        'POST',
        JSON.stringify({
          ...post,
          categories: selectedCategoryIds.map((id) => ({ id })),
        }),
        token
      );

      if (!res.ok) {
        throw new Error('投稿作成に失敗しました。');
      }
      toast.success(`投稿「${post?.title}」を作成しました。`);
      router.push('/admin/posts');
    } catch (error) {
      toast.error('投稿作成に失敗しました。');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className='text-2xl font-bold mb-6'>記事作成</h2>
      <PostForm post={post} setPost={setPost} selectedCategoryIds={selectedCategoryIds} setSelectedCategoryIds={setSelectedCategoryIds} onSubmit={handleSubmit} handleDelete={null} isCreatePage={true} isLoading={isLoading} setIsLoading={setIsLoading} isSubmitting={isSubmitting} token={token} />
    </>
  );
};

export default AdminPostCreatePage;
