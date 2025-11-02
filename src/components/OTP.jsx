import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTP_LENGTH = 6;

export default function OTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const [loading, setLoading] = useState(false);
  const [lastTriedOtp, setLastTriedOtp] = useState('');

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef([]);

  const otpCode = useMemo(() => digits.join(''), [digits]);
  const isComplete = /^\d{6}$/.test(otpCode);

  // Focus first input on mount
  useEffect(() => inputsRef.current[0]?.focus(), []);

  // Auto verify when all 6 digits are entered
  useEffect(() => {
    if (isComplete && !loading && otpCode !== lastTriedOtp) {
      setLastTriedOtp(otpCode);
      handleVerify();
    }
  }, [isComplete, loading, otpCode, lastTriedOtp]);

  const handleChange = (index, value) => {
    const num = value.replace(/\D/g, '').slice(0, 1); // only digits
    setDigits((prev) => prev.map((d, i) => (i === index ? num : d)));

    if (num && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigits((prev) => prev.map((d, i) => (i === index ? '' : d)));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigits((prev) => prev.map((d, i) => (i === index - 1 ? '' : d)));
      }
    }
    if (e.key === 'ArrowLeft' && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1)
      inputsRef.current[index + 1]?.focus();
    if (e.key === 'Enter') handleVerify();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      e.preventDefault();
      setDigits(pasted.split(''));
      inputsRef.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!isComplete) return alert('Please enter the 6-digit code.');
    console.log('Verifying OTP:', otpCode);

    setLoading(true); // start loading
    fetch('https://13.229.232.223:5000/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: otpCode,
      }),
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) =>
        response.json().then((data) => ({ ok: response.ok, data }))
      )
      .then(({ ok, data }) => {
        if (!ok || data.success === false) {
          throw new Error(data.message || 'Invalid OTP, please try again.');
        }
        console.log('Login successful:', data);
        localStorage.setItem('id', data.data.id);
        localStorage.setItem('name', data.data.name);
        localStorage.setItem('email', data.data.email);
        navigate('/Dashboard', {
          replace: true,
        });
      })
      .catch((error) => {
        console.error('Fetch error:', error.message);
        alert(error.message);
      })
      .finally(() => setLoading(false)); // stop loading
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-100 text-gray-800">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
        <header className="mb-4">
          <h1 className="text-xl font-semibold mb-1">
            Two-Factor Authentication
          </h1>
          <p className="text-sm text-gray-500">
            Enter the 6-digit OTP sent to your email {email ? `(${email})` : ''}
            .
          </p>
        </header>

        <div
          className="grid justify-center gap-2.5 my-4"
          style={{
            gridTemplateColumns: `repeat(${OTP_LENGTH}, minmax(0, 48px))`,
          }}
          onPaste={handlePaste}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="w-12 h-12 text-center text-xl border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-300"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleVerify}
            disabled={!isComplete || loading}
            className={`h-10 px-4 rounded-lg font-semibold flex items-center justify-center gap-2
              ${
                !isComplete || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
