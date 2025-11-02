import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const adminName = localStorage.getItem('name') || 'Administrator';
  const email = localStorage.getItem('email');
  const initials = adminName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800">
      <div className="p-5 flex justify-center">
        <img
          src="/logo.png"
          alt="QRead Logo"
          className="h-[60px] w-auto object-contain rounded"
        />
      </div>

      <div className="flex items-center gap-3 px-5 mb-5">
        <div className="w-12 h-12 rounded-full bg-indigo-700 text-white grid place-items-center font-extrabold">
          {initials}
        </div>
        <div className="leading-tight">
          <div className="font-bold text-white">{adminName}</div>
          {email && <div className="text-xs text-slate-400">{email}</div>}
        </div>
      </div>

      <nav className="grid gap-2 px-5">
        {[
          'Librarian Management',
          'Borrower Management',
          'System Management',
          'Account Settings',
        ].map((item) => {
          const handleClick = () => {
            if (item === 'Librarian Management') {
              navigate('/librarians', { state: { adminName, email } });
            } else if (item === 'Borrower Management') {
              navigate('/borrowers', { state: { adminName, email } });
            } else if (item === 'System Management') {
              navigate('/system', { state: { adminName, email } });
            } else if (item === 'Account Settings') {
              navigate('/account', { state: { adminName, email } });
            }
          };

          return (
            <button
              key={item}
              onClick={handleClick}
              className="text-left bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-2.5 hover:bg-slate-700 hover:border-slate-600 transition"
            >
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
