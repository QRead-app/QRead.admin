import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAlternateEmail } from 'react-icons/md';
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); //로딩 상태 추가
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // 로그인 시작 → 로딩 true
    setErrorMessage('');
    try {
      const res = await fetch('https://13.229.232.223:5000/admin/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMessage('The password you entered is incorrect.');
        } else {
          setErrorMessage('Login failed. Please try again.');
        }
        throw new Error('Login failed');
      }

      await res.json();

      navigate('/OTP', {
        state: { adminName: 'Hyeri', email },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); //로그인 끝 → 로딩 false
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-white flex-col flex items-center gap-4 rounded-xl border border-gray-200 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-20 md:w-24 rounded-xl" />
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Welcome to QRead Administrator portal
        </h1>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          noValidate={false}
        >
          {/* Email input */}
          <div className="w-full flex items-center bg-white border border-gray-300 p-2 rounded-lg gap-2 focus-within:ring-2 focus-within:ring-blue-300">
            <MdAlternateEmail className="text-gray-500" />
            <input
              type="email"
              placeholder="Email account"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800"
            />
          </div>

          {/* Password input */}
          <div className="w-full flex items-center bg-white border border-gray-300 p-2 rounded-lg gap-2 relative focus-within:ring-2 focus-within:ring-blue-300">
            <FaFingerprint className="text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          {/* Reset password link */}
          <div className="w-full text-left text-sm">
            <span className="text-gray-600">Reset Password </span>
            <button
              type="button"
              onClick={() => navigate('/enter-email')}
              className="text-blue-600 hover:underline hover:text-blue-800 cursor-pointer"
            >
              Click here...
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-left mt-1">
              {errorMessage}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={!email || !password || loading}
            className={`w-full p-2 rounded-xl mt-4 font-semibold text-sm md:text-base transition
              ${
                !email || !password || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
