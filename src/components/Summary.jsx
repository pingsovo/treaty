import React from 'react';
import SectionCard from './SectionCard';

function Summary({ people, calculatedResults, serviceChargeEnabled, serviceChargePercentage, vatEnabled }) {
  return (
    <SectionCard
      title="สรุปบิลสุดท้าย"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#8E8E93]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" /></svg>}
    >
      {people.length === 0 ? (
        <p className="text-[#8E8E93] text-[15px] italic">เพิ่มคนและรายการสั่งซื้อเพื่อดูสรุป</p>
      ) : (
        <>
          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(calculatedResults).map(result => (
              <div key={result.name} className="p-5 bg-[#2C2C2E] rounded-2xl shadow-sm relative overflow-hidden transition-transform">
                <h3 className="text-[20px] font-bold text-white mb-4 border-b border-[#3A3A3C] pb-3 tracking-wide">{result.name}</h3>
                <ul className="text-[#EBEBF5] text-[14px] space-y-2.5 mb-5 font-medium">
                  <li className="flex justify-between"><span className="text-[#8E8E93]">รายการสั่งซื้อส่วนตัว:</span> <span>฿{result.individualSubtotal.toFixed(2)}</span></li>
                  <li className="flex justify-between"><span className="text-[#8E8E93]">รายการที่แชร์:</span> <span>฿{result.sharedItemContribution.toFixed(2)}</span></li>
                  
                  <li className="flex justify-between font-bold text-white border-t pt-3 mt-3 border-[#3A3A3C]">
                    <span className="text-[#8E8E93]">ยอดรวมย่อย:</span> <span>฿{result.subtotalBeforeProportion.toFixed(2)}</span>
                  </li>
                  
                  {result.proportionalDiscount > 0 && (
                    <li className="flex justify-between text-white"><span>ส่วนลดตามสัดส่วน:</span> <span>- ฿{result.proportionalDiscount.toFixed(2)}</span></li>
                  )}
                  {result.proportionalShipping > 0 && (
                    <li className="flex justify-between text-white"><span>ค่าส่งตามสัดส่วน:</span> <span>+ ฿{result.proportionalShipping.toFixed(2)}</span></li>
                  )}
                  {serviceChargeEnabled && (
                    <li className="flex justify-between text-white"><span>Service Charge ({serviceChargePercentage}%):</span> <span>+ ฿{result.proportionalServiceCharge.toFixed(2)}</span></li>
                  )}
                  {vatEnabled && (
                    <li className="flex justify-between text-white"><span>VAT (7%):</span> <span>+ ฿{result.proportionalVat.toFixed(2)}</span></li>
                  )}
                  {result.treatContribution > 0 && (
                    <li className="flex justify-between items-center text-white font-bold bg-[#3A3A3C] p-2 rounded-lg mt-2">
                      <span>เลี้ยงเพื่อนไป:</span> <span>+ ฿{result.treatContribution.toFixed(2)}</span>
                    </li>
                  )}
                  {result.treatReceived > 0 && (
                    <li className="flex justify-between items-center text-white font-bold border border-[#3A3A3C] p-2 rounded-lg mt-2">
                      <span>ได้รับเลี้ยง (ฟรี!):</span> <span>฿{result.treatReceived.toFixed(2)}</span>
                    </li>
                  )}
                </ul>
                <div className="mt-4 pt-4 border-t border-[#3A3A3C] flex justify-between items-end">
                  <span className="text-[14px] text-[#8E8E93] font-medium mb-1">ยอดชำระสุทธิ</span>
                  <span className="text-[28px] font-bold text-white">฿{result.totalPay.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}

export default Summary;
