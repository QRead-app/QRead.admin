// src/components/AccountSetting.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ActionSuccessModel2 from './ActionSuccessModel2';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function AccountSetting() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Modal States
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Error states
  const [emailError, setEmailError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  // Form States
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const logout = () => navigate('/', { replace: true });

  const adminName = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const [emptyFieldError, setEmptyFieldError] = useState('');

  const handleOTPverification = () => {
    fetch(`https://13.229.232.223:5000/admin/email?otp=${otp}`, {
      method: 'PUT',
      mode: 'cors', // Enables CORS request
      credentials: 'include', // Include cookies for session management
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            setEmailError('Server error');
          }
          throw new Error('Update failed');
        }
        return response.json();
      })
      .then(() => {
        localStorage.setItem('email', newEmail);
        setOtp('');
        setNewEmail('');
        setConfirmEmail('');
        setResultMessage(`Email updated successfully.`);
        setShowResultModal(true);
        setShowResultModal(true);
        setShowOtpModal(false);
      })
      .catch((error) => console.error('Fetch error:', error.message));
  };
  const handleEmailUpdate = () => {
    fetch(
      `https://13.229.232.223:5000/admin/user?id=${localStorage.getItem(
        'id'
      )}&email=${newEmail}`,
      {
        method: 'PUT',
        mode: 'cors', // Enables CORS request
        credentials: 'include', // Include cookies for session management
      }
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            setEmailError('Server error');
          }
          throw new Error('Update failed');
        }
        return response.json();
      })
      .then(() => {
        setResultMessage(`OTP sent.`);
        setShowResultModal(true);
        setShowOtpModal(true);
        setShowEmailModal(false);
      })
      .catch((error) => console.error('Fetch error:', error.message));
  };
  const handleUpdateAccount = (key, value) => {
    const id = localStorage.getItem('id');
    let para = '';

    if (typeof key === 'object') {
      for (let i = 0; i < key.length; i++) {
        para += `&${encodeURIComponent(key[i])}=${encodeURIComponent(
          value[i]
        )}`;
      }
    } else {
      para += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    fetch(`https://13.229.232.223:5000/admin/user?id=${id}${para}`, {
      method: 'PUT',
      mode: 'cors', // Enables CORS request
      credentials: 'include', // Include cookies for session management
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            setOldPasswordError('Old password is incorrect.');
          }
          throw new Error('Update failed');
        }
        return response.json();
      })
      .then(() => {
        if (!(key instanceof Array)) localStorage.setItem(key, value);
        if (key instanceof Array)
          setResultMessage(`${key[0]} updated successfully.`);
        else setResultMessage(`${key} updated successfully.`);
        setShowResultModal(true);

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setNewUsername('');

        setShowPasswordModal(false);
        setShowUsernameModal(false);
      })
      .catch((error) => console.error('Fetch error:', error.message));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <h1 className="text-lg font-semibold">Account Settings</h1>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Main */}
        <main className="p-6 flex-1 flex justify-center items-center">
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Administrator Info</h2>

            {/* Info + Buttons Row */}
            <div className="flex justify-between items-start gap-6">
              {/* Info Section */}
              <div className="flex-1 space-y-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Username</div>
                  <div className="font-medium">{adminName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium">{email}</div>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex flex-col gap-3 w-40">
                <button
                  onClick={() => setShowUsernameModal(true)}
                  className="h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Change Username
                </button>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Change Email
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Change Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Change Username</h2>
            <p className="text-sm text-gray-600 mb-2">
              Old Username: {adminName}
            </p>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full h-10 border rounded-md px-3 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowUsernameModal(false);
                  setNewUsername('');
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateAccount('name', newUsername);
                  setShowUsernameModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Change Email</h2>
            <p className="text-sm text-gray-600 mb-2">Old Email: {email}</p>
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError('');
              }}
              className="w-full h-10 border rounded-md px-3 mb-3"
            />
            <input
              type="email"
              placeholder="Confirm New Email"
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
                setEmailError('');
              }}
              className="w-full h-10 border rounded-md px-3 mb-4"
            />

            {/*email error not matching*/}
            {emailError && (
              <p className="text-red-500 text-sm relative -top-2">
                {emailError}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setNewEmail('');
                  setConfirmEmail('');
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  //if doesn't match, then show the red sentence
                  if (newEmail !== confirmEmail) {
                    setEmailError(
                      'New Email and Confirm New Email do not match.'
                    );
                    return;
                  }
                  //if match, then open the otp modal window
                  handleEmailUpdate();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Send OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Change Email</h2>
            <p className="text-sm text-gray-600 mb-2">
              Enter the OTP sent to your new email
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-10 border rounded-md px-3 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleOTPverification();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            {/*OLD PASSWORD*/}
            <div className="relative mb-3">
              <input
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setOldPasswordError('');
                  setEmptyFieldError('');
                }}
                className="w-full h-10 border rounded-md px-3 pr-10"
              />
              {/* 비밀번호 표시/숨기기 토글 */}
              {showOldPassword ? (
                <FaRegEyeSlash
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                />
              ) : (
                <FaRegEye
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                />
              )}
            </div>
            {/*show the error of old password*/}
            {oldPasswordError && (
              <p className="text-red-500 text-sm relative -top-2">
                {oldPasswordError}
              </p>
            )}

            {/* NEW PASSWORD */}
            <div className="relative mb-3">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordMatchError('');
                  setEmptyFieldError('');
                }}
                className="w-full h-10 border rounded-md px-3 pr-10"
              />
              {/* 비밀번호 표시/숨기기 토글 */}
              {showNewPassword ? (
                <FaRegEyeSlash
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                />
              ) : (
                <FaRegEye
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                />
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordMatchError('');
                  setEmptyFieldError('');
                }}
                className="w-full h-10 border rounded-md px-3 pr-10"
              />
              {/* 비밀번호 표시/숨기기 토글 */}
              {showConfirmPassword ? (
                <FaRegEyeSlash
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <FaRegEye
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
            {passwordMatchError && (
              <p className="text-red-500 text-sm relative -top-2">
                {passwordMatchError}
              </p>
            )}

            {emptyFieldError && (
              <p className="text-red-500 text-sm relative -top-2">
                {emptyFieldError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!oldPassword || !newPassword || !confirmPassword) {
                    setEmptyFieldError('Please fill in all fields.');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordMatchError(
                      'New Password and Confirm password do not match.'
                    );
                    return;
                  }
                  handleUpdateAccount(
                    ['password', 'newpassword'],
                    [oldPassword, newPassword]
                  );
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Confirm modal*/}
      {showResultModal && (
        <ActionSuccessModel2
          message={resultMessage}
          setSuccessModel={setShowResultModal}
        />
      )}
    </div>
  );
}
