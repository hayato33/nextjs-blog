'use client';

import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [messageErrorMessage, setMessageErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const messageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

  const validate = () => {
    clearErrorMessages();
    const nameError = name === '' ? 'お名前は必須です。' : name.length > 30 ? 'お名前は30文字以内で入力してください。' : '';
    setNameErrorMessage(nameError);
    const emailError = email === '' ? 'メールアドレスは必須です。' : !email.match(/.+@.+\..+/) ? 'メールアドレスの形式が正しくありません。' : '';
    setEmailErrorMessage(emailError);
    const messageError = message === '' ? '本文は必須です。' : message.length > 500 ? '本文は500文字以内で入力してください。' : '';
    setMessageErrorMessage(messageError);
    return !nameError && !emailError && !messageError;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // バリデーション
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const apiUrl = 'https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      };
      await fetch(apiUrl, requestOptions);
      alert('送信しました。');
      handleClear();
      setIsSubmitting(false);
    } catch (error) {
      alert('送信に失敗しました。');
      console.error(error);
    }
  };

  const handleClear = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  const clearErrorMessages = () => {
    setNameErrorMessage('');
    setEmailErrorMessage('');
    setMessageErrorMessage('');
  };

  return (
    <form className='max-w-3xl w-auto mt-12 mx-auto' onSubmit={handleSubmit}>
      <h2 className='text-xl font-bold mb-12'>問合わせフォーム</h2>
      <div className='mb-12 grid gap-6'>
        <div className='flex items-center'>
          <label htmlFor='name' className='w-3/12'>
            お名前
          </label>
          <div className='w-9/12'>
            <input type='text' id='name' name='name' className='w-full border border-gray-300 rounded-lg p-4' required value={name} onChange={nameChange} disabled={isSubmitting} />
            <p className='text-sm text-red-700'>{nameErrorMessage}</p>
          </div>
        </div>
        <div className='flex items-center'>
          <label htmlFor='email' className='w-3/12'>
            メールアドレス
          </label>
          <div className='w-9/12'>
            <input type='text' id='email' name='email' className='w-full border border-gray-300 rounded-lg p-4' required value={email} onChange={emailChange} disabled={isSubmitting} />
            <p className='text-sm text-red-700'>{emailErrorMessage}</p>
          </div>
        </div>
        <div className='flex items-center'>
          <label htmlFor='message' className='w-3/12'>
            本文
          </label>
          <div className='w-9/12'>
            <textarea rows={8} id='message' name='message' className='w-full border border-gray-300 rounded-lg p-4' required value={message} onChange={messageChange} disabled={isSubmitting}></textarea>
            <p className='text-sm text-red-700'>{messageErrorMessage}</p>
          </div>
        </div>
      </div>
      <div className='flex justify-center gap-4'>
        <button type='submit' className='px-4 py-2 rounded-lg font-bold text-white bg-black' disabled={isSubmitting}>
          送信
        </button>
        <button type='reset' className='px-4 py-2 rounded-lg font-bold text-black bg-gray-300' onClick={handleClear} disabled={isSubmitting}>
          クリア
        </button>
      </div>
    </form>
  );
};
export default ContactPage;
