
import React, { useState } from 'react';

/**
 * History Panel — shows a list of past saved (completed) sessions.
 * history: [{ id, savedAt, sessionName, results: [{ name, totalPay }], grandTotal }]
 * onClear: () => void
 * onDelete: (id) => void
 */
function HistoryPanel({ isOpen, onClose, history, onClear, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-[#1C1C1E] border-l border-[#2C2C2E] shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3A3A3C] bg-[#1C1C1E]/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-[20px] font-bold text-white tracking-wide">ประวัติการคำนวณ</h2>
            <p className="text-[13px] text-[#8E8E93] mt-0.5 font-medium">{history.length} รายการ (30 วันล่าสุด)</p>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => { if (window.confirm('ยืนยันลบประวัติทั้งหมด?')) onClear(); }}
                className="text-[13px] text-[#FF453A] font-semibold tracking-wide active:scale-95 transition-transform mr-1"
              >
                ล้างทั้งหมด
              </button>
            )}
            <button onClick={onClose} className="bg-[#2C2C2E] text-[#8E8E93] hover:text-white p-2 text-sm rounded-full active:scale-95 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto bg-[#000000]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#8E8E93] gap-3 px-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-30 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-[17px] font-semibold text-white">ยังไม่มีประวัติ</p>
              <p className="text-[14px]">เมื่อคุณกดปุ่ม "บันทึกประวัติ" ในหน้าจอหลัก ข้อมูลสรุปจะถูกเก็บไว้ที่นี่โดยอัตโนมัติ (นานสูงสุด 30 วัน)</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#1C1C1E]">
              {[...history].reverse().map((entry) => (
                <li key={entry.id} className="p-5 bg-[#1C1C1E] mt-[1px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white text-[16px] tracking-wide">{entry.sessionName}</p>
                      <p className="text-[13px] text-[#8E8E93] mt-1 font-medium">{entry.savedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-[18px]">฿{entry.grandTotal.toFixed(2)}</span>
                      <button
                        onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                        className="text-[#8E8E93] hover:text-white p-2 bg-[#2C2C2E] rounded-full active:scale-95 transition-transform ml-1"
                        title="ดูรายละเอียด"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expanded === entry.id ? 'rotate-180 text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="text-[#8E8E93] hover:bg-[#FF453A]/20 hover:text-[#FF453A] p-2 bg-[#2C2C2E] rounded-full active:scale-95 transition-colors"
                        title="ลบ"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === entry.id && (
                    <div className="mt-4 bg-[#2C2C2E] rounded-2xl overflow-hidden border border-[#3A3A3C]">
                      <table className="w-full text-[14px]">
                        <thead className="bg-[#3A3A3C] text-[#8E8E93]">
                          <tr>
                            <th className="text-left px-4 py-2.5 font-semibold text-[13px] tracking-wide">ชื่อ</th>
                            <th className="text-right px-4 py-2.5 font-semibold text-[13px] tracking-wide">ยอดที่ต้องชำระ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3A3A3C]">
                          {entry.results.map((r, i) => (
                            <tr key={i} className="text-[#EBEBF5]">
                              <td className="px-4 py-3 flex items-center gap-3 font-medium">
                                <div className="w-[24px] h-[24px] rounded-full bg-[#1C1C1E] flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-[#8E8E93] border border-[#3A3A3C]">
                                  {r.name.charAt(0)}
                                </div>
                                {r.name}
                              </td>
                              <td className={`px-4 py-3 text-right font-bold tracking-wide ${r.totalPay === 0 ? 'text-[#FF9F0A]' : 'text-white'}`}>
                                {r.totalPay === 0 ? 'ฟรี' : `฿${r.totalPay.toFixed(2)}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryPanel;
