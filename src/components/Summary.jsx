import React from 'react';
import SectionCard from './SectionCard';

function Summary({ people, calculatedResults, serviceChargeEnabled, serviceChargePercentage, vatEnabled }) {
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
