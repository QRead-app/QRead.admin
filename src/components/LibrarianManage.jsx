// LibrarianManage.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoadingAnimation from './LoadingAnimation';
import LibrarianSuccessModal from './LibrarianSuccessModal';

export default function LibrarianManage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const logout = () => navigate('/', { replace: true });

  // ------- UI State -------
  const [searchBy, setSearchBy] = useState('id');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('id-asc');

  // ------- List Data -------
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //-------add: modal state & message------
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);

  useEffect(() => {
    const fetchLibrarian = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          'https://13.229.232.223:5000/admin/users?type=LIBRARIAN',
          {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          }
        );

        if (!res.ok) throw new Error();

        const data = (await res.json()).data;

        const librarians = data.filter((item) => {
          if (item.user.account_state === 'DELETED') return false;
          return true;
        });
        let users = [];
        for (const item of librarians) {
          const user = item.user;
          users.push({
            id: user.id,
            username: user.name,
            email: user.email,
            status: user.account_state,
            type: user.account_type,
          });
        }
        setRows(users);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLibrarian();
  }, [state?.refresh]); //Now re-fetch when state.refresh changes

  // ====== ADD MODAL STATES (Inline Add Flow) ======
  const [addOpen, setAddOpen] = useState(false);
  // const [form, setForm] = useState({ username: '', email: '' }); // REMOVED: username 필드 제거
  const [form, setForm] = useState({ email: '' }); // CHANGED: Email만 사용
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // const valid = form.username.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()); // REMOVED
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()); // CHANGED: 이메일만 검증

  const onChangeForm = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ====== SEARCH + SORT ======
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = rows.filter((r) => {
      if (!q) return true;
      if (searchBy === 'id') return String(r.id).includes(q);
      if (searchBy === 'username') return r.username.toLowerCase().includes(q);
      return r.email.toLowerCase().includes(q);
    });

    const [key, dir] = sortBy.split('-');
    data.sort((a, b) => {
      let va = a[key];
      let vb = b[key];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, searchBy, sortBy]);

  //---Reset Password click, open confirm
  const handleAction = (type, email) => {
    if (type === 'reset') {
      setResetEmail(email);
      setShowResetConfirm(true);
    }
  };

  // === Confirm 모달에서 OK 눌렀을 때 실행 ===
  const sendResetLink = async () => {
    setShowResetConfirm(false);
    try {
      const res = await fetch('https://13.229.232.223:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirect: 'https://13.229.232.223:5173/ResetPassword',
          email: resetEmail,
        }),
        mode: 'cors',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setResetSuccessMsg(`Password reset link sent to ${resetEmail}.`);
      setShowResetSuccessModal(true);
    } catch (err) {
      console.error(err);
      setResetSuccessMsg('Failed to send reset link.');
      setShowResetSuccessModal(true);
    }
  };

  // // Reset Password → ResetPassword 페이지 이동
  // const handleAction = (type, email) => {
  //   if (type === 'reset') {
  //     if (!confirm(`Send a reset link to ${email}?`)) return;

  //     fetch('https://13.229.232.223:5000/forgot-password', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         redirect: 'http://localhost:5173/ResetPassword',
  //         email: email,
  //       }),
  //       mode: 'cors', // Enables CORS request
  //       credentials: 'include', // Include cookies for session management
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error(
  //             'Network response was not ok ' + response.statusText
  //           );
  //         }
  //       })
  //       .then(() => {
  //         alert('Password reset link sent.');
  //       })
  //       .catch((error) => {
  //         console.error('Fetch error:', error);
  //         alert('Failed to send reset link');
  //       });
  //   }
  // };

  // 기존 navigate로 새 페이지 이동 → 모달 열기
  const handleAdd = () => {
    // setForm({ username: '', email: '' }); // REMOVED
    setForm({ email: '' }); // CHANGED
    setAddOpen(true);
  };

  // 모달에서 “Send activation invitation to email” 클릭
  const onSend = async () => {
    if (!valid) return;
    setSending(true);

    try {
      const res = await fetch(
        'https://13.229.232.223:5000/admin/register-librarian',
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            redirect: 'https://13.229.232.223:5174/librarian-info',
          }),
          credentials: 'include',
        }
      );

      if (!res.ok) throw new Error();

      await res.json();

      setConfirmOpen(true);
    } catch (err) {
      alert('Failed to send invitation. Please try again.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // 성공 팝업 확인 → 목록에 즉시 반영 및 모달 닫기
  const onConfirm = () => {
    setConfirmOpen(false);
    setAddOpen(false);
  };

  // 상세 이동
  const goDetail = (row) => {
    navigate(`/librarians/${row.id}`, {
      state: { librarian: row },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      {/* Right side */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <h1 className="text-lg font-semibold">Librarian Management</h1>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Main */}
        <main className="p-6 flex-1">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-50">
              <LoadingAnimation />
            </div>
          )}
          <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Search By
                </label>
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="id">ID</option>
                  <option value="username">Username</option>
                  <option value="email">Email</option>
                </select>
                <input
                  type="text"
                  placeholder={`Enter ${searchBy}`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 w-full md:w-64 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center gap-2 ml-4">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="id-asc">ID ↑</option>
                  <option value="id-desc">ID ↓</option>
                  <option value="username-asc">Username A–Z</option>
                  <option value="username-desc">Username Z–A</option>
                  <option value="email-asc">Email A–Z</option>
                  <option value="email-desc">Email Z–A</option>
                </select>
              </div>

              <div className="md:ml-auto">
                <button
                  onClick={handleAdd}
                  className="h-10 rounded-md px-4 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Add New Librarian
                </button>
              </div>
            </div>
          </section>

          {/* List */}
          <section className="mt-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Username</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-100 hover:bg-indigo-50 cursor-pointer"
                    onClick={() => goDetail(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') goDetail(row);
                    }}
                  >
                    <td className="px-3 py-2 font-medium">{row.id}</td>
                    <td className="px-3 py-2 underline-offset-2 hover:underline">
                      {row.username}
                    </td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('reset', row.email);
                        }}
                        className="h-9 px-3 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-gray-500"
                      colSpan={4}
                    >
                      No librarians found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      {/* ===== ADD MODAL (Inline) ===== */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAddOpen(false)}
          />
          {/* Dialog */}
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Librarian</h2>

            <div className="space-y-4">
              {/* Email만 입력 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChangeForm}
                  placeholder="name@example.com"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <button
                type="button"
                className="px-4 h-10 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSend}
                disabled={!valid || sending}
                className="px-4 h-10 rounded-lg bg-blue-600 text-white font-normal hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed" // CHANGED: 글씨 굵기 줄임 (font-normal)
              >
                {sending ? 'Sending…' : 'Send Activation Invitation to Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onConfirm} />
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Invitation sent</h3>
            <p className="text-sm text-gray-600">
              An activation invitation has been sent to{' '}
              <span className="font-medium">
                {form.email || 'the specified email'}
              </span>
              .
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onConfirm}
                className="px-4 h-10 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Confirm Reset Password Modal === */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Send a reset link to{' '}
              <span className="font-semibold text-gray-800">{resetEmail}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={sendResetLink}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === 성공 메시지 모달 === */}
      {showResetSuccessModal && (
        <LibrarianSuccessModal
          message={resetSuccessMsg}
          onClose={() => {
            setShowResetSuccessModal(false);
          }}
        />
      )}
    </div>
  );
}
