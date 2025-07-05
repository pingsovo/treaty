
import React from 'react';

function Settings({ isSettingsOpen, setIsSettingsOpen, roundUpEnabled, setRoundUpEnabled }) {
  if (!isSettingsOpen) return null;

  return (
    <>
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="fixed bottom-6 right-6 bg-gray-700 p-4 rounded-full shadow-lg text-white hover:bg-gray-600 transition-all duration-300 z-50 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.74-1.71-.98l-.37-2.65C14.06 2.18 13.64 2 13.12 2h-2.24c-.52 0-.94.18-1.01.64l-.37 2.65c-.62.24-1.19.58-1.71.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.74 1.71.98l.37 2.65c.07.46.49.64 1.01.64h2.24c.52 0 .94-.18 1.01-.64l.37-2.65c.62-.24 1.19-.58 1.71-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c-.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
      </button>
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
    </>
  );
}

export default Settings;
