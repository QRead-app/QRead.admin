import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import LibrarianSuccessModal from './LibrarianSuccessModal';

export default function LibrarianDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const initial = state?.librarian || null;

  const [librarian, setLibrarian] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [processing, setProcessing] = useState(false);

  //--- reset modal state & success message---
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  useEffect(() => {
    if (librarian || !id) {
      setLoading(false);
      return;
    }

    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://13.229.232.223:5000/admin/users?id=${id}`,
          {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        const user = json?.data?.user || json?.data || json;

        setLibrarian({
          id: user.id,
          username: user.name || user.username || '',
          email: user.email || '',
          status: user.account_state || '',
          createdAt: user.createdAt || user.created || '',
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load librarian details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id, librarian]);

  const confirmReset = () => {
    setShowResetConfirm(true);
  };

  const sendResetLink = async () => {
    setShowResetConfirm(false);
    try {
      const res = await fetch('https://13.229.232.223:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirect: 'http://13.229.232.223:5173/ResetPassword',
          email: librarian.email,
        }),
        mode: 'cors',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setResetSuccessMsg(`Password reset link sent to ${librarian.email}.`);
      setShowResetSuccessModal(true);
    } catch (err) {
      console.error(err);
      setResetSuccessMsg('Failed to send reset link.');
      setShowResetSuccessModal(true);
    }
  };

  // const handleResetPassword = (email) => {
  //   if (!confirm(`Send a reset link to ${email}?`)) return;

  //   fetch('https://13.229.232.223:5000/forgot-password', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       redirect: 'http://localhost:5173/ResetPassword',
  //       email: email,
  //     }),
  //     mode: 'cors', // Enables CORS request
  //     credentials: 'include', // Include cookies for session management
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok ' + response.statusText);
  //       }
  //     })
  //     .then(() => {
  //       alert('Password reset link sent.');
  //     })
  //     .catch((error) => {
  //       console.error('Fetch error:', error);
  //       alert('Failed to send reset link');
  //     });
  // };

  const handleDelete = async () => {
    if (!librarian) return;
    // if (!confirm(`Are you sure you want to DELETE ${librarian.username}?`))
    //   return;
    setShowDeleteConfirm(false);
    setProcessing(true);
    try {
      const res = await fetch(
        `https://13.229.232.223:5000/admin/user?id=${encodeURIComponent(
          librarian.id
        )}`,
        { method: 'DELETE', mode: 'cors', credentials: 'include' }
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Delete failed');
      }
      setDeleteSuccessMsg('Librarian deleted.');
      setShowDeleteSuccessModal(true);
    } catch (err) {
      console.error(err);
      setDeleteSuccessMsg('Failed to delete librarian.');
    } finally {
      setProcessing(false);
      setShowDeleteSuccessModal(true);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!librarian) return <div className="p-6">No librarian found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      {/* Main */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <h1 className="text-lg font-semibold">Librarian Detail</h1>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Detail Card */}
        <main className="p-6 flex-1 flex justify-center pt-10">
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col h-[480px]">
            <h2 className="text-xl font-semibold mb-4">Librarian Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500">ID</div>
                <div className="font-medium">{librarian.id}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Username</div>
                <div className="font-medium">{librarian.username}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="font-medium">{librarian.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-medium">{librarian.status}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="font-medium">{librarian.type}</div>
              </div>
            </div>

            <div className="mt-auto pt-6 flex flex-wrap gap-2">
              <button
                onClick={() => confirmReset()}
                disabled={processing}
                className="h-10 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
              >
                Reset Password
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={processing}
                className="h-10 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-70"
              >
                Delete Account
              </button>

              <button
                onClick={() => navigate('/librarians')}
                className="h-10 px-4 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Back to list
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* === Confirm Reset Password Modal === */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Send a reset link to{' '}
              <span className="font-semibold text-gray-800">
                {librarian.email}
              </span>
              ?
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Delete account{' '}
              <span className="font-semibold text-gray-800">
                {librarian.username}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetSuccessModal && (
        <LibrarianSuccessModal
          header="Password Reset Link Sent"
          message={resetSuccessMsg}
          onClose={() => {
            setShowResetSuccessModal(false);
            navigate('/librarians');
          }}
        />
      )}
      {showDeleteSuccessModal && (
        <LibrarianSuccessModal
          header="Librarian Successfully Deleted"
          message={deleteSuccessMsg}
          onClose={() => {
            setShowDeleteSuccessModal(false);
            navigate('/librarians');
          }}
        />
      )}
    </div>
  );
}
