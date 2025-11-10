// src/components/LibrarianInfo.jsx
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function LibrarianInfo() {
  const { search, state } = useLocation();
  const navigate = useNavigate();

  // 초대 링크에서 넘어온 토큰/이메일을 쿼리스트링으로 받는다고 가정
  const token = useMemo(() => {
    const sp = new URLSearchParams(search);
    return sp.get('token') || sp.get('secret') || ''; // 초대 토큰(백엔드 검증용)
  }, [search]);

  const invitedEmail = useMemo(() => {
    const sp = new URLSearchParams(search);
    return sp.get('email') || ''; // 초대 메일 주소 (링크에 포함되었다고 가정)
  }, [search]);

  // 관리자에서 state로 넘겨줄 수도 있음(옵션)
  const fallbackEmail = state?.email || '';
  const email = invitedEmail || fallbackEmail;

  // 폼 상태
  const [values, setValues] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState({ username: false, password: false });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const errors = {
    username:
      touched.username && values.username.trim().length === 0
        ? 'Username is required.'
        : '',
    password:
      touched.password && values.password.length < 6
        ? 'Password must be at least 6 characters.'
        : '',
  };
  const hasErrors = Boolean(errors.username || errors.password);

  const onChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (hasErrors) return;

    try {
      setSaving(true);

      // TODO: 실제 백엔드 활성화 API 호출
      let res = await fetch('https://13.229.232.223:5000/new-librarian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: token,
          name: values.username.trim(),
          password: values.password,
        }),
        mode: 'cors',
        credentials: 'include',
      });
      console.log(
        JSON.stringify({
          secret: token,
          name: values.username.trim(),
          password: values.password,
        })
      );
      if (!res.ok) throw new Error();

      await res.json();

      //Should go to Aziz Login part
      window.location.href = 'https://13.229.232.223:5173/';
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-100 text-gray-800">
      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]"
      >
        <header className="mb-4">
          <h1 className="text-xl font-semibold mb-1">Complete Your Account</h1>
          <p className="text-sm text-gray-500">
            {email
              ? `For email: ${email}`
              : 'Please set your username & password.'}
          </p>
        </header>

        {/* Username */}
        <div className="my-3.5">
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-1.5"
          >
            Enter your new username:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="e.g. alice"
            value={values.username}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={Boolean(errors.username)}
            className={`w-full h-10 px-3 rounded-lg bg-white text-gray-800 outline-none transition
              focus:border-blue-600 focus:ring-4 focus:ring-[rgba(37,99,235,0.35)]
              ${
                errors.username
                  ? 'border border-red-500'
                  : 'border border-gray-300'
              }`}
          />
          {errors.username && (
            <div className="mt-1.5 text-xs text-red-500">{errors.username}</div>
          )}
        </div>

        {/* Password */}
        <div className="my-3.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1.5"
          >
            Enter your new password:
          </label>

          {/* 비밀번호 입력 박스 (아이콘 포함) */}
          <div className="w-full flex items-center bg-white border border-gray-300 rounded-lg gap-2 relative focus-within:ring-2 focus-within:ring-blue-300">
            {/* 왼쪽 지문 아이콘 */}
            <FaFingerprint className="text-gray-500 ml-3" />

            {/* 비밀번호 입력 필드 */}
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={values.password}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 p-2"
            />

            {/* 오른쪽 눈 아이콘 (보이기/숨기기) */}
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

          {/* 에러 메시지 */}
          {errors.password && (
            <div className="mt-1.5 text-xs text-red-500">{errors.password}</div>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-center items-center mt-4">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
