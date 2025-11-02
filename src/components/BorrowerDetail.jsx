// src/components/BorrowerDetail.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import ActionSuccessModel from './ActionSuccessModel';

export default function BorrowerDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const initial = state?.borrower || null;

  const [borrower, setBorrower] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [processing, setProcessing] = useState(false);
  const [fines, setFines] = useState(initial?.fine || []); // Outstanding Fines
  const [showSuspendModal, setShowSuspendModal] = useState(false); // 모달 열기
  const [suspendReason, setSuspendReason] = useState(''); // 사유 입력

  // 변경: Confirm 모달 관리
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'suspend' | 'reinstate' | 'delete'

  // 변경: 성공/실패 모달 관리
  const [showSuccessModel, setSuccessModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (borrower || !id) {
      setLoading(false);
      return;
    }
  }, [id, borrower]);

  // === Suspend 실행 ===
  const suspendUser = async () => {
    setProcessing(true);
    try {
      const res = await fetch(
        `https://13.229.232.223:5000/admin/suspend-user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: borrower.id, reason: suspendReason }),
          mode: 'cors',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error();

      // setBorrower((prev) => ({
      //   ...prev,
      //   status: 'SUSPENDED',
      //   suspensionReason: suspendReason,
      // }));

      setSuccessMessage(`${borrower.username} suspended successfully.`);
    } catch (err) {
      console.error(err);
      setSuccessMessage(`Failed to suspend ${borrower.username}.`);
    } finally {
      setProcessing(false);
      setShowConfirmModal(false);
      setSuccessModel(true);
    }
  };

  // === Reinstate 실행 ===
  const reinstateUser = async () => {
    setProcessing(true);
    try {
      const res = await fetch(
        `https://13.229.232.223:5000/admin/reinstate-user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: borrower.id }),
          mode: 'cors',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error();

      // setBorrower((prev) => ({
      //   ...prev,
      //   status: 'ACTIVE',
      //   suspensionReason: null, // 또는 '' 가능
      // }));

      setSuccessMessage(`${borrower.username} reinstated successfully.`);
    } catch (err) {
      console.error(err);
      setSuccessMessage(`Failed to reinstate ${borrower.username}.`);
    } finally {
      setProcessing(false);
      setShowConfirmModal(false);
      setSuccessModel(true);
    }
  };

  // === Delete 실행 ===
  const deleteUser = async () => {
    setProcessing(true);
    try {
      const res = await fetch(
        `https://13.229.232.223:5000/admin/user?id=${encodeURIComponent(
          borrower.id
        )}`,
        { method: 'DELETE', mode: 'cors', credentials: 'include' }
      );
      if (!res.ok) throw new Error();
      setSuccessMessage(`${borrower.username} deleted successfully.`);
    } catch (err) {
      console.error(err);
      setSuccessMessage(`Failed to delete ${borrower.username}.`);
    } finally {
      setProcessing(false);
      setShowConfirmModal(false);
      setSuccessModel(true);
    }
  };

  // 버튼 핸들러
  const handleAction = (action) => {
    if (action === 'suspend') {
      setSuspendReason('');
      setShowSuspendModal(true);
    } else {
      setConfirmAction(action);
      setShowConfirmModal(true);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!borrower) return <div className="p-6">No borrower found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <h1 className="text-lg font-semibold">Borrower Detail</h1>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Detail Card */}
        <main className="p-6 flex-1 flex justify-center pt-10">
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            {/* Borrower Info */}
            <h2 className="text-xl font-semibold mb-4">Borrower Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500">ID</div>
                <div className="font-medium">{borrower.id}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Username</div>
                <div className="font-medium">{borrower.username}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="font-medium">{borrower.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-medium">{borrower.status || '—'}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500">Suspension Reason</div>
                <div className="font-medium">
                  {borrower.suspensionReason || '—'}
                </div>
              </div>
            </div>

            {/* Outstanding Fines */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Outstanding Fines</h3>
              {fines.length > 0 ? (
                <table className="min-w-full text-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 text-left">
                      <th className="px-3 py-2">Fine ID</th>
                      <th className="px-3 py-2">Fine Amount</th>
                      <th className="px-3 py-2">Fine Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fines.map((fine) => (
                      <tr key={fine.id} className="border-t border-gray-100">
                        <td className="px-3 py-2">{fine.id}</td>
                        <td className="px-3 py-2">${fine.amount}</td>
                        <td className="px-3 py-2">
                          {fine.date
                            ? new Date(fine.date).toLocaleDateString()
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">No outstanding fines.</div>
              )}
            </div>

            {/* 버튼 그룹 */}
            <div className="mt-auto pt-6 flex flex-wrap gap-2">
              {borrower.status !== 'SUSPENDED' && (
                <button
                  onClick={() => handleAction('suspend')}
                  disabled={processing}
                  className="h-10 px-4 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Suspend Account
                </button>
              )}
              {borrower.status === 'SUSPENDED' && (
                <button
                  onClick={() => handleAction('reinstate')}
                  disabled={processing}
                  className="h-10 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-70"
                >
                  Reinstate Account
                </button>
              )}
              <button
                onClick={() => handleAction('delete')}
                disabled={processing}
                className="h-10 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-70"
              >
                Delete Account
              </button>
              <button
                onClick={() => navigate('/borrowers')}
                className="h-10 px-4 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Back to list
              </button>
            </div>
          </div>
        </main>
      </div>

      {/*Suspend Reason Modal*/}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Suspend User</h2>

            <label className="text-sm text-gray-600 mb-1 block">
              Reason for Suspension
            </label>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4 resize-none"
              placeholder="Enter suspension reason..."
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
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

      {/*Confirm Modal*/}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{' '}
              <span className="font-semibold text-red-600">
                {confirmAction}
              </span>{' '}
              <span className="font-semibold">{borrower.username}</span>?
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
                  confirmAction === 'suspend'
                    ? suspendUser
                    : confirmAction === 'reinstate'
                    ? reinstateUser
                    : deleteUser
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success / Fail Modal */}
      {showSuccessModel && (
        <ActionSuccessModel
          message={successMessage}
          setSuccessModel={setSuccessModel}
        />
      )}
    </div>
  );
}
