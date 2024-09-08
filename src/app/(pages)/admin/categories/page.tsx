'use client';

import { Category } from '@/app/_types/Category';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const AdminPostTopPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories');
      const { categories } = await res.json();
      setCategories(categories);
      setIsLoading(false);
    };

    fetcher();
  }, []);

  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>カテゴリー一覧</h2>
        <Link href='/admin/categories/new' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700'>
          新規作成
        </Link>
      </div>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : categories.length === 0 ? (
        <p>カテゴリーがありません。</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id} className='border-b p-4'>
              <Link href={`/admin/categories/${category.id}`}>
                <p className='font-bold'>{category.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default AdminPostTopPage;
