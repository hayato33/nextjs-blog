'use client';

import { v4 as uuidv4 } from 'uuid'; // 固有IDを生成するライブラリ
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import { ChangeEvent, FormEventHandler, useEffect, useState } from 'react';
import request from '@/app/_utils/api';
import { Category } from '@prisma/client/edge';
import { ExtendedPost } from '@/app/_types/ExtendedPost';
import { InitialPost } from '@/app/_types/InitialPost';

interface Props {
  post: ExtendedPost | InitialPost | null;
  setPost: React.Dispatch<React.SetStateAction<ExtendedPost | InitialPost | null>>;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<number[]>>;
  isCreatePage: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  handleDelete: FormEventHandler<HTMLButtonElement> | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  token: string | null;
}

const PostForm: React.FC<Props> = ({ post, setPost, selectedCategoryIds, setSelectedCategoryIds, isCreatePage, onSubmit, handleDelete, isLoading, setIsLoading, isSubmitting, token }) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!token) return;
    const fetchCategories = async () => {
      try {
        const res = await request('/api/admin/categories', 'GET', undefined, token);
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

  useEffect(() => {
    if (!post || !post.thumbnailImageKey) return; // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from('post_thumbnail').getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [post]);

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
    if (post) setPost({ ...post, thumbnailImageKey: data.path });
  };

  return (
    <>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <form onSubmit={onSubmit}>
          <div className='mb-6 grid gap-6'>
            <div>
              <label htmlFor='title'>タイトル</label>
              <div className=''>
                <input
                  type='text'
                  id='title'
                  name='title'
                  value={post?.title}
                  onChange={(e) => {
                    if (post) setPost({ ...post, title: e.target.value });
                  }}
                  className='w-full border border-gray-300 rounded-lg p-4'
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
                  value={post?.content}
                  onChange={(e) => {
                    if (post) setPost({ ...post, content: e.target.value });
                  }}
                  className='w-full border border-gray-300 rounded-lg p-4'
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
          {isCreatePage ? (
            <button type='submit' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700' disabled={isSubmitting}>
              {isSubmitting ? '作成中...' : '作成'}
            </button>
          ) : (
            <div className='flex gap-3'>
              <button type='submit' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700' disabled={isSubmitting}>
                {isSubmitting ? '更新中...' : '更新'}
              </button>
              <button type='button' onClick={handleDelete || undefined} className='text-white bg-red-500 rounded-lg px-4 py-2 transition-colors hover:bg-red-700' disabled={isSubmitting}>
                削除
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
};
export default PostForm;
