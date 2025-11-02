// src/components/ActionSuccessModel2.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ActionSuccessModel2({ message, setSuccessModel }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-5 rounded-xl shadow-2xl w-[75%] max-w-sm text-center">
        <div className="flex flex-col items-center">
          {/* Success icon */}
          <FaCheckCircle className="text-green-500 text-5xl mb-3" />

          <h3 className="text-lg font-semibold mb-2 text-green-600">Success</h3>

          <p className="text-gray-700 mb-6">{message}</p>
        </div>

        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => {
            setSuccessModel(false);
            navigate('/account', { replace: true });
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
