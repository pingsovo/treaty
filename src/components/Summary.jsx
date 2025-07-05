
import React from 'react';
import SectionCard from './SectionCard';

function Summary({ people, calculatedResults, serviceChargeEnabled, serviceChargePercentage, vatEnabled, handleDownloadImage, summaryCardRef }) {
  return (
    <SectionCard
      title="สรุปบิลสุดท้าย"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-indigo-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" /></svg>}
      description="ดูว่าแต่ละคนต้องจ่ายเท่าไหร่หลังจากการคำนวณทั้งหมด"
      bgColor="bg-gray-800"
      borderColor="border-indigo-800"
    >
      {people.length === 0 ? (
        <p className="text-gray-400 italic">เพิ่มคนและรายการสั่งซื้อเพื่อดูสรุป</p>
      ) : (
        <>
          {/* Quick Summary Table */}
          <div id="quickResult" className="mb-8 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto">
            <div ref={summaryCardRef} id="quickResult">
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

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(calculatedResults).map(result => (
              <div key={result.name} className="p-5 bg-gray-900 rounded-xl shadow-md border border-indigo-900 transform hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                <h3 className="text-2xl font-bold text-white mb-3 border-b pb-2 border-indigo-800">{result.name}</h3>
                <ul className="text-gray-300 text-base space-y-2 mb-3">
                  <li><span className="font-semibold">รายการสั่งซื้อส่วนตัว:</span> <span className="float-right">฿{result.individualSubtotal.toFixed(2)}</span></li>
                  <li><span className="font-semibold">รายการที่แชร์:</span> <span className="float-right">฿{result.sharedItemContribution.toFixed(2)}</span></li>
                  <li className="font-bold text-gray-200 border-t pt-2 mt-2 border-gray-700"><span className="font-semibold">ยอดรวมย่อย:</span> <span className="float-right">฿{result.subtotalBeforeProportion.toFixed(2)}</span></li>
                  <li className="text-red-400"><span className="font-semibold">ส่วนลดตามสัดส่วน:</span> <span className="float-right">- ฿{result.proportionalDiscount.toFixed(2)}</span></li>
                  <li className="text-green-400"><span className="font-semibold">ค่าส่งตามสัดส่วน:</span> <span className="float-right">+ ฿{result.proportionalShipping.toFixed(2)}</span></li>
                  {serviceChargeEnabled && (
                    <li className="text-yellow-400"><span className="font-semibold">Service Charge ({serviceChargePercentage}%):</span> <span className="float-right">+ ฿{result.proportionalServiceCharge.toFixed(2)}</span></li>
                  )}
                  {vatEnabled && (
                    <li className="text-orange-400"><span className="font-semibold">VAT (7%):</span> <span className="float-right">+ ฿{result.proportionalVat.toFixed(2)}</span></li>
                  )}
                </ul>
                <p className="mt-4 text-xl font-extrabold text-indigo-400 bg-indigo-900 p-3 rounded-lg flex justify-between items-center">
                  <span>ยอดที่ต้องชำระทั้งหมด:</span>
                  <span className="text-3xl">฿{result.totalPay.toFixed(2)}</span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}

export default Summary;
