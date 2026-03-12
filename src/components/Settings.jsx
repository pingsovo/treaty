import React from 'react';

function Settings({ 
  isSettingsOpen, setIsSettingsOpen, 
  roundUpEnabled, setRoundUpEnabled, 
  baseFontSize, setBaseFontSize,
  showSharedItems, setShowSharedItems,
  showRefunds, setShowRefunds,
  showShortSummary, setShowShortSummary,
  showFinalSummary, setShowFinalSummary
}) {
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

      <div className="flex items-center justify-between mb-5">
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

      <div className="flex items-center justify-between mb-5">
        <span className="text-[16px] font-medium text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          รายการที่แชร์
        </span>
        <label htmlFor="sharedItemsToggle" className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="sharedItemsToggle" className="sr-only peer" checked={showSharedItems} onChange={() => setShowSharedItems(!showSharedItems)} />
          <div className="w-11 h-6 bg-[#3A3A3C] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30D158]"></div>
        </label>
      </div>

      <div className="flex items-center justify-between mb-5">
        <span className="text-[16px] font-medium text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          คืนเงิน/ส่งผิด
        </span>
        <label htmlFor="refundsToggle" className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="refundsToggle" className="sr-only peer" checked={showRefunds} onChange={() => setShowRefunds(!showRefunds)} />
          <div className="w-11 h-6 bg-[#3A3A3C] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30D158]"></div>
        </label>
      </div>

      <div className="flex items-center justify-between mb-5">
        <span className="text-[16px] font-medium text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          สรุปยอดจ่ายจริง
        </span>
        <label htmlFor="shortSummaryToggle" className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="shortSummaryToggle" className="sr-only peer" checked={showShortSummary} onChange={() => setShowShortSummary(!showShortSummary)} />
          <div className="w-11 h-6 bg-[#3A3A3C] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30D158]"></div>
        </label>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-[16px] font-medium text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          สรุปบิลสุดท้าย
        </span>
        <label htmlFor="finalSummaryToggle" className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="finalSummaryToggle" className="sr-only peer" checked={showFinalSummary} onChange={() => setShowFinalSummary(!showFinalSummary)} />
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
