'use client';

import { useState } from 'react';

// 管理画面_カテゴリー新規作成ページ

const AdminCategoryDetailPage: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!res.ok) {
        throw new Error('カテゴリーの作成に失敗しました。');
      }

      setSuccessMessage(`カテゴリー「${categoryName}」を作成しました。`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '不明なエラーが発生しました。');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setCategoryName('');
    }
  };

  return (
    <>
      <h2 className='text-2xl font-bold mb-6'>カテゴリー作成</h2>
      {successMessage && <p className='text-sm text-green-700 mb-4'>{successMessage}</p>}
      {errorMessage && <p className='text-sm text-red-700 mb-4'>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className='mb-6 grid gap-6'>
          <div>
            <label htmlFor='name'>カテゴリー名</label>
            <div className=''>
              <input type='text' id='name' name='name' className='w-full border border-gray-300 rounded-lg p-4' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} disabled={isSubmitting} />
            </div>
          </div>
        </div>
        <button type='submit' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700' disabled={!categoryName || isSubmitting}>
          {isSubmitting ? '送信中…' : '作成'}
        </button>
      </form>
    </>
  );
};

export default AdminCategoryDetailPage;
