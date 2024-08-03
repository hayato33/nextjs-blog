'use client';

import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className='p-6 flex justify-between bg-gray-900 text-white font-bold'>
      <h1>
        <Link href='/'>Blog</Link>
      </h1>
      <Link href='/contact'>お問い合わせ</Link>
    </header>
  );
};
export default Header;
