'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import request from '@/app/_utils/api';
import PostForm from '@/app/_components/elements/PostForm';
import { ExtendedPost } from '@/app/_types/ExtendedPost';
import { InitialPost } from '@/app/_types/InitialPost';

// 管理画面_投稿更新&削除ページ
const AdminPostDetailPage: React.FC = () => {
  const { token } = useSupabaseSession();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<ExtendedPost | InitialPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    if (!token) return;
    const fetchPosts = async () => {
      try {
        const res = await request(`/api/admin/posts/${id}`, 'GET', undefined, token);
        if (res.ok) {
          const { post } = await res.json();
          setPost(post);
        }
      } catch (error) {
        console.error('投稿の取得に失敗しました。', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [id, token]);

  useEffect(() => {
    if (post && 'postCategories' in post) setSelectedCategoryIds(post.postCategories.map((postCategory) => postCategory.category.id));
  }, [post]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !post) return;
    setIsSubmitting(true);
    const res = await request(
      `/api/admin/posts/${id}`,
      'PUT',
      JSON.stringify({
        ...post,
        categories: selectedCategoryIds.map((id) => ({ id })),
      }),
      token
    );
    setIsSubmitting(false);

    if (res.ok) {
      toast.success('記事が更新されました！');
      router.refresh();
    } else {
      toast.error('更新に失敗しました。');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm('本当に削除してよろしいですか？')) {
      return;
    }
    const res = await request(`/api/admin/posts/${id}`, 'DELETE', undefined, token);

    if (res.ok) {
      toast.success('記事が削除されました！');
      router.push('/admin/posts');
    } else {
      toast.error('削除に失敗しました。');
    }
  };

  if (!post) return <div>記事が存在しません。</div>;

  return (
    <>
      <h2 className='text-2xl font-bold mb-6'>記事編集</h2>
      <PostForm post={post} setPost={setPost} selectedCategoryIds={selectedCategoryIds} setSelectedCategoryIds={setSelectedCategoryIds} onSubmit={handleUpdate} handleDelete={handleDelete} isCreatePage={false} isLoading={isLoading} setIsLoading={setIsLoading} isSubmitting={isSubmitting} token={token} />
    </>
  );
};

export default AdminPostDetailPage;
