// ActionSuccessModel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ActionSuccessModel({ message, setSuccessModel }) {
  const navigate = useNavigate();

  // 성공 / 실패 판단 (간단히 message 안에 failed 포함 여부 확인)
  const isSuccess = !message.toLowerCase().includes('fail');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded-xl shadow-2xl w-[70%] max-w-sm text-center">
        <div className="flex flex-col items-center">
          {isSuccess ? (
            <FaCheckCircle className="text-green-500 text-5xl mb-3" />
          ) : (
            <FaTimesCircle className="text-red-500 text-5xl mb-3" />
          )}
          <h3
            className={`text-lg font-semibold mb-2 ${
              isSuccess ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isSuccess ? 'Success' : 'Failed'}
          </h3>
          <p className="text-gray-700 mb-6">{message}</p>
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => {
            setSuccessModel(false);
            navigate('/borrowers', { state: { refresh: true } });
            window.location.reload();
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
