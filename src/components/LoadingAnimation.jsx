// src/components/LoadingAnimation.jsx
import React from 'react';

export default function LoadingAnimation() {
  return (
    // <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      {/* 회전하는 원형 로딩 스피너 */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      {/* 로딩 텍스트 */}
      <p className="text-white text-sm font-medium mt-2 animate-pulse">
        Loading borrowers...
      </p>
    </div>
    // </div>
  );
}
