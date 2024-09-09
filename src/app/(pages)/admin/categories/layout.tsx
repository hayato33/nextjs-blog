import Link from 'next/link';

export default function AdminCategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen'>
      <aside className='w-3/12 bg-gray-100 min-h-full'>
        <nav className=''>
          <ul className=''>
            <li className='transition-colors hover:bg-blue-100'>
              <Link href='/admin/posts' className='inline-block w-full h-full p-4'>
                記事一覧
              </Link>
            </li>
            <li className='bg-blue-100'>
              <Link href='/admin/categories' className='inline-block w-full h-full p-4'>
                カテゴリー一覧
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className='w-9/12 p-8'>{children}</main>
    </div>
  );
}
