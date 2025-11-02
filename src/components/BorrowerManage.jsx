import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ActionSuccessModel from './ActionSuccessModel';
import LoadingAnimation from './LoadingAnimation';

export default function BorrowerManage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const logout = () => navigate('/', { replace: true });

  // UI State
  const [searchBy, setSearchBy] = useState('id');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('id-asc');

  // === Adding parts ===
  const [showSuspendModal, setShowSuspendModal] = useState(false); // Suspend reason 모달
  const [suspendReason, setSuspendReason] = useState('');
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirm 모달
  const [confirmAction, setConfirmAction] = useState(null); // 'suspend' | 'reinstate'
  const [showSuccessModel, setSuccessModel] = useState(false); // 성공/실패 모달
  const [successAction, setSuccessAction] = useState(''); // 메시지 ('suspend success' 등)
  const [isLoading, setIsLoading] = useState(false);

  // List Data
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          'https://13.229.232.223:5000/admin/users?type=BORROWER',
          {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          }
        );

        if (!res.ok) throw new Error();

        const data = (await res.json()).data;
        const borrowers_temp = data.filter((item) => {
          if (item.user.account_state === 'DELETED') return false;
          return true;
        });
        const borrowers = borrowers_temp.map((item) => {
          const user = item.user;
          const fine = item.fine;

          return {
            id: user.id,
            username: user.name,
            email: user.email,
            status: user.account_state,
            fine: fine,
            suspensionReason: user.suspension_reason,
          };
        });

        setRows(borrowers);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBorrowers();
  }, [state?.refresh]);

  // Filter + Sort
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

  // === Suspend 실행 ===
  const suspendUser = async () => {
    try {
      const res = await fetch(
        `https://13.229.232.223:5000/admin/suspend-user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedBorrower.id,
            reason: suspendReason,
          }),
          mode: 'cors',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error();

      // setRows((prev) =>
      //   prev.map((b) =>
      //     b.id === selectedBorrower.id ? { ...b, status: 'SUSPENDED' } : b
      //   )
      // );

      setSuccessAction(`${selectedBorrower.username} suspended successfully.`);
    } catch (err) {
      console.error(err);
      setSuccessAction(`Failed to suspend ${selectedBorrower.username}.`);
    } finally {
      setShowConfirmModal(false);
      setSuccessModel(true);
    }
  };

  // === Reinstate 실행 ===
  const reinstateUser = async () => {
    try {
      const res = await fetch(
        `https://13.229.232.223:5000/admin/reinstate-user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedBorrower.id }),
          mode: 'cors',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error();

      // setRows((prev) =>
      //   prev.map((b) =>
      //     b.id === selectedBorrower.id ? { ...b, status: 'ACTIVE' } : b
      //   )
      // );

      setSuccessAction(`${selectedBorrower.username} reinstated successfully.`);
    } catch (err) {
      console.error(err);
      setSuccessAction(`Failed to reinstate ${selectedBorrower.username}.`);
    } finally {
      setShowConfirmModal(false);
      setSuccessModel(true);
    }
  };

  // 버튼 액션
  const handleAction = (action, borrower) => {
    setSelectedBorrower(borrower);
    if (action === 'suspend') {
      setSuspendReason('');
      setShowSuspendModal(true);
    } else if (action === 'reinstate') {
      setConfirmAction('reinstate');
      setShowConfirmModal(true);
    }
  };

  // 상세 이동
  const goDetail = (row) => {
    navigate(`/borrowers/${row.id}`, {
      state: { borrower: row },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      {/* Right side */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <h1 className="text-lg font-semibold">Borrower Management</h1>{' '}
          {/*제목 변경됨 */}
          <button
            onClick={logout}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Main */}
        <main className="p-6 flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-50">
              <LoadingAnimation />
            </div>
          )}
          {/* Controls */}
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
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Enter ${searchBy}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-10 w-full md:w-64 rounded-md border border-gray-300 bg-white px-3 pr-10 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
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
            </div>
          </section>

          {/* Borrower List */}
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
                    <td className="px-3 py-2 flex flex-wrap gap-2">
                      {row.status === 'SUSPENDED' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('reinstate', row);
                          }}
                          className="h-9 px-3 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                        >
                          Reinstate Account
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('suspend', row);
                          }}
                          className="h-9 px-3 rounded-md bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition"
                        >
                          Suspend Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-gray-500"
                      colSpan={4}
                    >
                      No borrowers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>
      {/* === Suspend Reason Modal === */}
      {showSuspendModal && selectedBorrower && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSuspendModal(false)}
          />
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Suspend User</h2>

            <label
              htmlFor="suspendReason"
              className="block text-sm text-gray-600 mb-1"
            >
              Reason for Suspension
            </label>
            <textarea
              id="suspendReason"
              name="suspendReason"
              value={suspendReason}
              onChange={(e) => {
                setSuspendReason(e.target.value);
              }}
              placeholder="Enter reason..."
              className="w-full h-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-none"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setConfirmAction('suspend');
                  setShowConfirmModal(true);
                }}
                disabled={!suspendReason.trim()}
                className="px-4 h-10 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Confirm Modal === */}
      {showConfirmModal && selectedBorrower && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{' '}
              <span className="font-semibold text-red-600">
                {confirmAction}
              </span>{' '}
              <span className="font-semibold">{selectedBorrower.username}</span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmAction === 'suspend' ? suspendUser : reinstateUser
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Success / Fail Modal === */}
      {showSuccessModel && (
        <ActionSuccessModel
          message={successAction}
          setSuccessModel={setSuccessModel}
        />
      )}
    </div>
  );
}
