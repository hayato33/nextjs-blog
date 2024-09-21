'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Category } from '@/app/_types/Category';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid'; // 固有IDを生成するライブラリ
import Image from 'next/image';

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
  const [post, setPost] = useState(initialPostState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/categories`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
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
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          ...post,
          thumbnailImageKey,
          categories: selectedCategoryIds.map((id) => ({ id })),
        }),
      });

      if (!res.ok) {
        throw new Error('投稿作成に失敗しました。');
      }
      toast.success(`投稿「${post.title}」を作成しました。`);
      router.push('/admin/posts');
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

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得

    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
  };

  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

  useEffect(() => {
    if (!thumbnailImageKey) return; // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from('post_thumbnail').getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  return (
    <>
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
              <div>
                <label htmlFor='thumbnailImageKey' className='block text-sm font-medium text-gray-700'>
                  サムネイルURL
                </label>
                <input type='file' id='thumbnailImageKey' onChange={handleImageChange} accept='image/*' disabled={isSubmitting} />
              </div>
              {thumbnailImageUrl && (
                <div className='mt-2'>
                  <Image src={thumbnailImageUrl} alt='thumbnail' width={400} height={400} />
                </div>
              )}
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
