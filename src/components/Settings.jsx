import React from 'react';

function Settings({ isSettingsOpen, setIsSettingsOpen, roundUpEnabled, setRoundUpEnabled, baseFontSize, setBaseFontSize }) {
  if (!isSettingsOpen) return null;

  return (
    <div className="fixed bottom-24 right-5 w-80 bg-[#1C1C1E]/90 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl border border-[#3A3A3C] z-50 animate-fade-in-up">
      <h3 className="text-[22px] font-bold text-white mb-5 border-b pb-3 border-[#3A3A3C]">ตั้งค่า</h3>
      
      <div className="flex items-center justify-between mb-6">
        <span className="text-white text-[16px] font-medium">ขนาดตัวอักษร</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setBaseFontSize(Math.max(12, baseFontSize - 1))} 
            className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white font-bold active:scale-95 transition-transform"
            aria-label="Decrease font size"
          >
            -
          </button>
          <span className="text-white text-[16px] font-semibold min-w-[24px] text-center">{baseFontSize}</span>
          <button 
            onClick={() => setBaseFontSize(Math.min(24, baseFontSize + 1))} 
            className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white font-bold active:scale-95 transition-transform"
            aria-label="Increase font size"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-white text-[16px] font-medium">ปัดเศษขึ้น (Round Up)</span>
        <label htmlFor="roundUpToggle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="roundUpToggle"
            className="sr-only peer"
            checked={roundUpEnabled}
            onChange={() => setRoundUpEnabled(!roundUpEnabled)}
          />
          <div className="w-11 h-6 bg-[#3A3A3C] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30D158]"></div>
        </label>
      </div>
      <button
        onClick={() => setIsSettingsOpen(false)}
        className="w-full px-4 py-3 bg-[#2C2C2E] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform text-[16px]"
      >
        ปิด
      </button>
    </div>
  );
}

export default Settings;
