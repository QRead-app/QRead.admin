// src/components/ResetPassword.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const secret = searchParams.get('secret');

  const handleUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    fetch('https://13.229.232.223:5000/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secret,
        password: newPassword,
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
        alert('Password successfully updated!');
        navigate('/'); // 로그인 페이지로 이동
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
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
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your new password and confirm it below.
        </p>

        {/* New password input */}
        <div className="w-full flex items-center bg-white border border-gray-300 p-2 rounded-lg gap-2 relative focus-within:ring-2 focus-within:ring-blue-300">
          <FaFingerprint className="text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800"
          />
          {showPassword ? (
            <FaRegEyeSlash
              className="absolute right-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FaRegEye
              className="absolute right-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>

        {/* Confirm password input */}
        <div className="w-full flex items-center bg-white border border-gray-300 p-2 rounded-lg gap-2 relative focus-within:ring-2 focus-within:ring-blue-300">
          <FaFingerprint className="text-gray-500" />
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800"
          />
          {showConfirm ? (
            <FaRegEyeSlash
              className="absolute right-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowConfirm(!showConfirm)}
            />
          ) : (
            <FaRegEye
              className="absolute right-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowConfirm(!showConfirm)}
            />
          )}
        </div>

        {/* Update button */}
        <button
          onClick={handleUpdate}
          disabled={!newPassword || !confirmPassword}
          className={`w-full p-2 rounded-xl mt-4 font-semibold text-sm md:text-base transition
            ${
              newPassword && confirmPassword
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Update Password
        </button>

        {/* Back to login */}
        <div className="text-sm text-gray-600 mt-2">
          Changed your mind?{' '}
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
