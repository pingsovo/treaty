
import React from 'react';
import SectionCard from './SectionCard';
import PromptPayInput from './PromptPayInput';

function ShortSummaryCard({ people, calculatedResults, handleDownloadImage, summaryCardRef }) {
  return (
    <SectionCard
      title="สรุปสั้นๆ"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-indigo-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" /></svg>}
      description="สรุปยอดที่ต้องชำระและสร้าง QR Code PromptPay"
      bgColor="bg-gray-800"
      borderColor="border-indigo-800"
    >
      {people.length === 0 ? (
        <p className="text-gray-400 italic">เพิ่มคนและรายการสั่งซื้อเพื่อดูสรุป</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: PromptPay Input */}
          <PromptPayInput totalAmount={Object.values(calculatedResults).reduce((sum, result) => sum + result.totalPay, 0)} />

          {/* Right Column: Quick Summary Table */}
          <div ref={summaryCardRef} id="quickResult" className="p-5 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-700">
              <h3 className="text-2xl font-bold text-white">ยอดรวมด่วน</h3>
              <button
                onClick={handleDownloadImage}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 active:scale-95 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                </svg>
                Save as Image
              </button>
            </div>
            <table className="w-full text-left text-gray-300">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4 font-semibold text-lg">ชื่อ</th>
                  <th className="py-3 px-4 text-right font-semibold text-lg">ยอดที่ต้องชำระ (฿)</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(calculatedResults).map((result, index) => (
                  <tr key={result.name} className={`border-b border-gray-800 last:border-b-0 transition-colors ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
                    <td className="py-2 px-4">{result.name}</td>
                    <td className="py-2 px-4 text-right font-semibold text-xl text-white">{result.totalPay.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

export default ShortSummaryCard;
