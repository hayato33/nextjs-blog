'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Post } from '@prisma/client';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ExtendedCategory = Category & {
  category: {
    id: number;
    name: string;
  };
};
type ExtendedPost = Post & {
  postCategories: ExtendedCategory[];
};

// 管理画面_投稿更新&削除ページ
const AdminPostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
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
    fetchPosts();
    fetchCategories();
  }, [id]);

  useEffect(() => {
    if (post) {
      setSelectedCategoryIds(post.postCategories.map((postCategory) => postCategory.category.id));
    }
  }, [post]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setIsSubmitting(true);

    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...post,
        categories: selectedCategoryIds.map((id) => ({ id })),
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      toast.success('記事が更新されました！');
      router.refresh();
    } else {
      toast.error('更新に失敗しました。');
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除してよろしいですか？')) {
      return;
    }
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('記事が削除されました！');
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1000);
    } else {
      toast.error('削除に失敗しました。');
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value, 10);
    setSelectedCategoryIds((prevIds) => (checked ? [...prevIds, categoryId] : prevIds.filter((id) => id !== categoryId)));
  };

  if (isLoading) return <div>読み込み中…</div>;
  if (!post) return <div>記事が存在しません。</div>;

  return (
    <>
      <ToastContainer />
      <h2 className='text-2xl font-bold mb-6'>記事編集</h2>
      <form onSubmit={handleUpdate}>
        <div className='mb-6 grid gap-6'>
          <div>
            <label htmlFor='title'>タイトル</label>
            <div className=''>
              <input
                type='text'
                id='title'
                name='title'
                value={post.title}
                onChange={(e) => {
                  setPost({ ...post, title: e.target.value });
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
                value={post.content}
                onChange={(e) => {
                  setPost({ ...post, content: e.target.value });
                }}
                className='w-full border border-gray-300 rounded-lg p-4'
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
          <div>
            <label htmlFor='title'>サムネイルURL</label>
            <div className=''>
              <input
                type='text'
                id='thumbnailUrl'
                name='thumbnailUrl'
                value={post.thumbnailUrl}
                onChange={(e) => {
                  setPost({ ...post, thumbnailUrl: e.target.value });
                }}
                className='w-full border border-gray-300 rounded-lg p-4'
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
        <div className='flex gap-3'>
          <button type='submit' className='text-white bg-blue-500 rounded-lg px-4 py-2 transition-colors hover:bg-blue-700' disabled={isSubmitting}>
            更新
          </button>
          <button type='button' onClick={handleDelete} className='text-white bg-red-500 rounded-lg px-4 py-2 transition-colors hover:bg-red-700' disabled={isSubmitting}>
            削除
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminPostDetailPage;
