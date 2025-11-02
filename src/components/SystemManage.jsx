// src/components/SystemManage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function SystemManage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // UI State
  const [startReminder, setStartReminder] = useState(1);
  const [startReminderChanged, setStartReminderChanged] = useState(false);
  const [repeatReminder, setRepeatReminder] = useState(1);
  const [repeatReminderChanged, setRepeatReminderChanged] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          'https://13.229.232.223:5000/admin/app-setting',
          {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          }
        );

        if (!res.ok) throw new Error();

        const data = (await res.json()).data;

        setStartReminder(data.reminder_x_days_before_due);
        setRepeatReminder(data.reminder_every_x_days);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();
  }, [state?.refresh]); //Now re-fetch when state.refresh changes

  const changeSetting = (type, value) => {
    switch (type) {
      case 'startReminder':
        setStartReminderChanged(true);
        setStartReminder(value);
        break;

      case 'repeatReminder':
        setRepeatReminderChanged(true);
        setRepeatReminder(value);
        break;
    }
  };

  const logout = () => navigate('/', { replace: true });

  const handleSave = async () => {
    // 숫자 값 보정 (0 이하 값 방지)
    const safeStartReminder = Math.max(1, parseInt(startReminder) || 1);
    const safeRepeatReminder = Math.max(1, parseInt(repeatReminder) || 1);

    setStartReminder(safeStartReminder);
    setRepeatReminder(safeRepeatReminder);

    const updateSetting = async (setting, value) => {
      try {
        const res = await fetch(
          `https://13.229.232.223:5000/admin/app-setting`,
          {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              key: setting,
              value: value,
            }),
            mode: 'cors',
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        const user = json?.data?.user || json?.data || json;
      } catch (err) {
        console.error(err);
      }
    };

    if (repeatReminderChanged)
      await updateSetting('reminder_every_x_days', repeatReminder);
    if (startReminderChanged)
      await updateSetting('reminder_x_days_before_due', startReminder);

    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 bg-gray-50 shadow-sm sticky top-0 z-10 h-[64px]">
          <h1 className="text-lg font-semibold">System Management</h1>
          <button
            onClick={logout}
            className="h-9 rounded-lg border border-transparent px-3.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Main */}
        <main className="p-6 flex-1 flex justify-center pt-10">
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Reminder Settings</h2>

            {/* Start Reminder */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Start reminder X days before due date
              </label>
              <input
                type="number"
                min="1"
                value={startReminder}
                onChange={(e) => changeSetting('startReminder', e.target.value)}
                placeholder="Enter days"
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Repeat Reminder */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Send reminder every X days
              </label>
              <input
                type="number"
                min="1"
                value={repeatReminder}
                onChange={(e) =>
                  changeSetting('repeatReminder', e.target.value)
                }
                placeholder="Enter days"
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Save Button */}
            <div className="mt-auto pt-6 flex justify-center">
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Show SuccessModal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-3 text-black-600">
              Settings Saved
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Your reminder settings have been successfully saved.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
