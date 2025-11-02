// src/components/LibrarianSuccessModal.jsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function LibrarianSuccessModal({ header, message, onClose }) {
  const isSuccess = !message.toLowerCase().includes('Failed');

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
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
