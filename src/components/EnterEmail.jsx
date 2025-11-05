// src/components/EnterEmail.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAlternateEmail } from 'react-icons/md';

export default function EnterEmail() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
  const navigate = useNavigate();

  const handleReset = () => {
    setLoading(true); // ✅ 버튼 클릭 시 로딩 시작
    fetch('https://13.229.232.223:5000/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redirect: 'http://13.229.232.223:5174/ResetPassword',
        email: email,
      }),
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(() => {
        alert(`Password reset link sent to ${email}`);
        navigate('/'); // 완료 후 로그인 페이지로 이동
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        alert('Failed to send reset link. Please try again.');
      })
      .finally(() => setLoading(false)); // 요청 완료 후 로딩 종료
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-white flex-col flex items-center gap-4 rounded-xl border border-gray-200 shadow-lg">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="logo"
          onClick={() => navigate('/')}
          className="w-20 md:w-24 rounded-xl cursor-pointer hover:scale-105 transition"
        />

        {/* Heading */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your registered email and we’ll send you a reset link.
        </p>

        {/* Email input */}
        <div className="w-full flex items-center bg-white border border-gray-300 p-2 rounded-lg gap-2 focus-within:ring-2 focus-within:ring-blue-300">
          <MdAlternateEmail className="text-gray-500" />
          <input
            type="email"
            placeholder="Email account"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800"
          />
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          disabled={!email || loading} //이메일 없거나 로딩 중이면 비활성화
          className={`w-full p-2 rounded-xl mt-4 font-semibold text-sm md:text-base transition
            ${
              !email || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {loading ? ( //로딩 중일 때 텍스트/스피너 표시
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        {/* Back to login */}
        <div className="text-sm text-gray-600 mt-2">
          Remembered your password?{' '}
          <span
            className="text-blue-600 hover:underline hover:text-blue-800 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Go back to Login
          </span>
        </div>
      </div>
    </div>
  );
}
