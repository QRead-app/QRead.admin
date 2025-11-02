import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const logout = () => navigate('/', { replace: true });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      {/* 오른쪽 영역 */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <div className="flex items-center"></div>
          <button
            onClick={logout}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Main */}
        <main className="p-6 flex-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to QRead Admin Portal
            </h2>
            <p className="text-gray-700">
              Select a section from the left menu to get started.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
