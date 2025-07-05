
import React from 'react';

function Settings({ isSettingsOpen, setIsSettingsOpen, roundUpEnabled, setRoundUpEnabled }) {
  if (!isSettingsOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 z-50 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-4 border-b pb-2 border-gray-700">ตั้งค่า</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300 text-lg font-medium">ปัดขึ้นหรือไม่?</span>
        <label htmlFor="roundUpToggle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="roundUpToggle"
            className="sr-only peer"
            checked={roundUpEnabled}
            onChange={() => setRoundUpEnabled(!roundUpEnabled)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-500"></div>
        </label>
      </div>
      <button
        onClick={() => setIsSettingsOpen(false)}
        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 active:scale-95"
      >
        ปิด
      </button>
    </div>
  );
}

export default Settings;
