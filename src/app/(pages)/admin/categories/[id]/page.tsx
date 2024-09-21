'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Category } from '@/app/_types/Category';
import { toast } from 'react-toastify';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import request from '@/app/_utils/api';

// 管理画面_カテゴリー更新&削除ページ
const AdminCategoryDetailPage: React.FC = () => {
  const { token } = useSupabaseSession();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<Category>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) return;
    const fetchCategory = async () => {
      const res = await request(`/api/admin/categories/${id}`, 'GET', undefined, token);
      if (res.ok) {
        const { category } = await res.json();
        setCategory(category);
      }
      setIsLoading(false);
    };

    fetchCategory();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const res = await request(`/api/admin/categories/${id}`, 'PUT', JSON.stringify({ ...category }), token);

    if (res.ok) {
      toast.success('カテゴリーが更新されました！');
      router.refresh();
    } else {
      toast.error('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm('本当に削除してよろしいですか？')) {
      return;
    }
    const res = await request(`/api/admin/categories/${id}`, 'DELETE', undefined, token);

    if (res.ok) {
      toast.success('カテゴリーが削除されました！');
      router.push('/admin/categories');
    } else {
      toast.error('削除に失敗しました。');
    }
  };

  if (isLoading) return <div>読み込み中…</div>;
  if (!category) return <div>カテゴリーが存在しません。</div>;

  return (
    <>
      <h2 className='text-2xl font-bold mb-6'>カテゴリー編集</h2>
      <form onSubmit={handleUpdate}>
        <div className='mb-6 grid gap-6'>
          <div>
            <label htmlFor='name'>カテゴリー名</label>
            <div className=''>
              <input
                type='text'
                id='name'
                name='name'
                value={category?.name || ''}
                onChange={(e) => {
                  setCategory({
                    ...category,
                    name: e.target.value,
                  });
                }}
                className='w-full border border-gray-300 rounded-lg p-4'
              />
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <button type='submit' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700'>
            更新
          </button>
          <button type='button' onClick={handleDelete} className='text-white bg-red-500 rounded-lg px-4 py-2 transition-colors hover:bg-red-700'>
            削除
          </button>
        </div>
      </form>
    </>
  );
};
export default AdminCategoryDetailPage;
