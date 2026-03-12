import React from 'react';

/**
 * Shows a merged cross-session summary table.
 * sessionResults: [{ sessionName, calculatedResults: { [personId]: { name, totalPay } } }]
 */
function MultiSessionSummary({ sessionResults }) {
  // Merge totals by person name across all sessions
  const merged = {}; // { name: { sessions: { [sessionName]: amount }, total } }

  sessionResults.forEach(({ sessionName, calculatedResults }) => {
    Object.values(calculatedResults).forEach(({ name, totalPay }) => {
      if (!merged[name]) {
        merged[name] = { sessions: {}, total: 0 };
      }
      merged[name].sessions[sessionName] = (merged[name].sessions[sessionName] || 0) + totalPay;
      merged[name].total += totalPay;
    });
  });

  const sessionNames = sessionResults.map((s) => s.sessionName);
  const grandTotal = Object.values(merged).reduce((sum, p) => sum + p.total, 0);

  if (sessionResults.length === 0) return null;

  return (
    <div className="bg-[#1C1C1E] p-5 sm:p-6 rounded-3xl shadow-sm mt-4 mb-4 sm:mt-6 sm:mb-6 overflow-hidden">
      <h2 className="text-[22px] sm:text-[24px] font-bold text-white mb-5 flex items-center tracking-wide">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        รวมทุกบิล (All Sessions)
      </h2>

      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <div className="min-w-full px-5 sm:px-0">
          <table className="w-full text-left text-white text-[14px] sm:text-[15px]">
            <thead className="text-[12px] sm:text-[13px] uppercase text-[#8E8E93] border-b border-[#3A3A3C] tracking-wider">
              <tr>
                <th className="py-3 px-3 sm:px-4 font-semibold">ชื่อ</th>
                {sessionNames.map((name) => (
                  <th key={name} className="py-3 px-2 sm:px-4 text-right font-medium">
                    {name}
                  </th>
                ))}
                <th className="py-3 px-3 sm:px-4 text-right font-semibold text-white">รวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A3C]">
              {Object.entries(merged).map(([name, data]) => (
                <tr key={name} className="hover:bg-[#2C2C2E] transition-colors">
                  <td className="py-3 px-3 sm:py-4 sm:px-4 font-medium flex items-center gap-3">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#3A3A3C] text-[#8E8E93] flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                      {name.charAt(0)}
                    </div>
                    {name}
                  </td>
                  {sessionNames.map((sName) => (
                    <td key={sName} className="py-3 px-2 sm:py-4 sm:px-4 text-right text-[#EBEBF5]">
                      {data.sessions[sName] != null
                        ? `฿${data.sessions[sName].toFixed(2)}`
                        : <span className="text-[#3A3A3C]">-</span>}
                    </td>
                  ))}
                  <td className="py-3 px-3 sm:py-4 sm:px-4 text-right font-bold text-white">
                    ฿{data.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-[#3A3A3C]">
              <tr>
                <td className="py-4 px-3 sm:px-4 font-semibold text-[#8E8E93]" colSpan={sessionNames.length + 1}>
                  ยอดรวมทั้งหมด
                </td>
                <td className="py-4 px-3 sm:px-4 text-right font-bold text-[18px] sm:text-[22px] text-white">
                  ฿{grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MultiSessionSummary;
