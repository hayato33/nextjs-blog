'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/app/_types/Category';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 管理画面_新規投稿ページ
const AdminPostCreatePage: React.FC = () => {
  const initialPostState = {
    title: '',
    content: '',
    thumbnailUrl: '',
    categories: [],
  };

  const [post, setPost] = useState(initialPostState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/categories`);
        if (res.ok) {
          const { categories } = await res.json();
          const sortedCategories = categories.sort((a: Category, b: Category) => a.id - b.id);
          setAllCategories(sortedCategories);
        }
      } catch (error) {
        console.error('カテゴリーの取得に失敗しました。', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          categories: selectedCategoryIds.map((id) => ({ id })),
        }),
      });

      if (!res.ok) {
        throw new Error('投稿作成に失敗しました。');
      }
      toast.success('投稿が作成されました！');
      setPost(initialPostState);
      setSelectedCategoryIds([]);
    } catch (error) {
      toast.error('投稿作成に失敗しました。');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value, 10);
    setSelectedCategoryIds((prevIds) => (checked ? [...prevIds, categoryId] : prevIds.filter((id) => id !== categoryId)));
  };

  return (
    <>
      <ToastContainer />
      <h2 className='text-2xl font-bold mb-6'>記事作成</h2>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='mb-6 grid gap-6'>
            <div>
              <label htmlFor='title'>タイトル</label>
              <div className=''>
                <input
                  type='text'
                  id='title'
                  name='title'
                  className='w-full border border-gray-300 rounded-lg p-4'
                  value={post.title}
                  onChange={(e) => {
                    setPost({ ...post, title: e.target.value });
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label htmlFor='content'>内容</label>
              <div className=''>
                <textarea
                  id='content'
                  name='content'
                  className='w-full border border-gray-300 rounded-lg p-4'
                  value={post.content}
                  onChange={(e) => {
                    setPost({ ...post, content: e.target.value });
                  }}
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>
            <div>
              <label htmlFor='thumbnailUrl'>サムネイルURL</label>
              <div className=''>
                <input
                  type='text'
                  id='thumbnailUrl'
                  name='thumbnailUrl'
                  className='w-full border border-gray-300 rounded-lg p-4'
                  value={post.thumbnailUrl}
                  onChange={(e) => {
                    setPost({ ...post, thumbnailUrl: e.target.value });
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label>カテゴリー</label>
              <div className='flex gap-x-6 gap-y-3 flex-wrap'>
                {allCategories.map((category) => (
                  <div key={category.id} className='flex items-center'>
                    <input type='checkbox' id={`category-${category.id}`} name='categories' value={category.id} checked={selectedCategoryIds.includes(category.id)} onChange={handleCategoryChange} disabled={isSubmitting} />
                    <label htmlFor={`category-${category.id}`} className='ml-2'>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button type='submit' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700' disabled={isSubmitting}>
            {isSubmitting ? '作成中...' : '作成'}
          </button>
          {errorMessage && <p className='text-sm text-red-700'>{errorMessage}</p>}
          {successMessage && <p className='text-sm text-green-700'>{successMessage}</p>}
        </form>
      )}
    </>
  );
};

export default AdminPostCreatePage;
