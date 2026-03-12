
import React, { useState, useEffect } from 'react';
import SectionCard from './SectionCard';

function Costs({ shippingCost, setShippingCost, discount, setDiscount, serviceChargeEnabled, setServiceChargeEnabled, serviceChargePercentage, setServiceChargePercentage, vatEnabled, setVatEnabled, people, treatedPeopleIds, setTreatedPeopleIds, treatSharingMode, setTreatSharingMode }) {
  // Local string state so user can clear the field (avoid parseFloat locking to 0)
  const [shippingStr, setShippingStr] = useState(String(shippingCost));
  const [discountStr, setDiscountStr] = useState(String(discount));

  // Sync external → local when parent resets
  useEffect(() => { setShippingStr(String(shippingCost)); }, [shippingCost]);
  useEffect(() => { setDiscountStr(String(discount)); }, [discount]);

  const handleShippingChange = (val) => {
    setShippingStr(val);
    const n = parseFloat(val);
    setShippingCost(isNaN(n) ? 0 : n);
  };

  const handleDiscountChange = (val) => {
    setDiscountStr(val);
    const n = parseFloat(val);
    setDiscount(isNaN(n) ? 0 : n);
  };
  return (
    <SectionCard
      title="ค่าใช้จ่ายเพิ่มเติม / ส่วนลด"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#8E8E93]" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="shipping" className="block text-[#EBEBF5] text-[15px] font-medium mb-2">ค่าส่ง (฿):</label>
          <input
            id="shipping"
            type="number"
            min="0"
            step="0.01"
            className="w-full p-3 text-[15px] bg-[#2C2C2E] sm:bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF9F0A] transition-all text-white placeholder-[#8E8E93]"
            value={shippingStr}
            onChange={(e) => handleShippingChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-[#EBEBF5] text-[15px] font-medium mb-2">จำนวนส่วนลด (฿):</label>
          <input
            id="discount"
            type="number"
            min="0"
            step="0.01"
            className="w-full p-3 text-[15px] bg-[#2C2C2E] sm:bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF9F0A] transition-all text-white placeholder-[#8E8E93]"
            value={discountStr}
            onChange={(e) => handleDiscountChange(e.target.value)}
          />
        </div>
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
          <div className="flex items-center justify-between bg-[#1C1C1E] p-3.5 rounded-xl">
            <span className="text-white text-[16px]">มี Service Charge</span>
            <label htmlFor="serviceChargeToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="serviceChargeToggle"
                className="sr-only peer"
                checked={serviceChargeEnabled}
                onChange={() => setServiceChargeEnabled(!serviceChargeEnabled)}
              />
              <div className="w-[51px] h-[31px] bg-[#3A3A3C] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[27px] after:w-[27px] after:transition-all peer-checked:bg-[#30D158] shadow-inner"></div>
            </label>
          </div>
          {serviceChargeEnabled && (
            <div className="animate-fade-in-up">
              <label htmlFor="serviceChargePercentage" className="block text-[#EBEBF5] text-[15px] font-medium mb-2">เปอร์เซ็นต์ SC (%):</label>
              <input
                id="serviceChargePercentage"
                type="number"
                min="0"
                step="0.01"
                className="w-full p-3 text-[15px] bg-[#2C2C2E] sm:bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF9F0A] transition-all text-white placeholder-[#8E8E93]"
                value={serviceChargePercentage}
                onChange={(e) => setServiceChargePercentage(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
          <div className="flex items-center justify-between bg-[#1C1C1E] p-3.5 rounded-xl sm:col-starts-1">
            <span className="text-white text-[16px]">มี VAT 7%</span>
            <label htmlFor="vatToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="vatToggle"
                className="sr-only peer"
                checked={vatEnabled}
                onChange={() => setVatEnabled(!vatEnabled)}
              />
              <div className="w-[51px] h-[31px] bg-[#3A3A3C] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[27px] after:w-[27px] after:transition-all peer-checked:bg-[#30D158] shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* Treat Mode Section */}
        {people && people.length > 0 && (
          <div className="col-span-full mt-4 pt-5 border-t border-[#3A3A3C]">
            <h3 className="text-[17px] font-semibold text-white mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg> 
              คนเลี้ยง (Treat Mode)
            </h3>
            <p className="text-[#8E8E93] text-[13px] mb-4">
              เลือกคนที่ ไม่ต้องจ่ายเงิน (ทุกคนที่เหลือจะหารยอดนี้เพิ่มเท่าๆ กัน)
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {people.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    const isTreated = treatedPeopleIds.includes(p.id);
                    if (isTreated) {
                      setTreatedPeopleIds(treatedPeopleIds.filter(id => id !== p.id));
                    } else {
                      // Prevent selecting everyone (someone must pay!)
                      if (treatedPeopleIds.length === people.length - 1) {
                        alert('ต้องมีคนจ่ายอย่างน้อย 1 คนครับ!');
                        return;
                      }
                      setTreatedPeopleIds([...treatedPeopleIds, p.id]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium transition-transform active:scale-95 flex items-center gap-1.5 border
                    ${treatedPeopleIds.includes(p.id) ? 'bg-white text-black border-white shadow-sm' : 'bg-[#1C1C1E] text-[#8E8E93] border-[#3A3A3C]'}`}
                >
                  {p.name} 
                  {treatedPeopleIds.includes(p.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Sharing Mode Toggle - Only show if there are treated people */}
            {treatedPeopleIds.length > 0 && (
              <div className="bg-[#1C1C1E] p-4 rounded-2xl animate-fade-in-up border border-[#2C2C2E]">
                <p className="text-white text-[15px] font-medium mb-3">รูปแบบการหารยอดของคนเลี้ยง:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="treatSharingMode"
                      value="active_only"
                      checked={treatSharingMode === 'active_only'}
                      onChange={() => setTreatSharingMode('active_only')}
                      className="w-5 h-5 text-white bg-[#2C2C2E] border-[#3A3A3C] focus:ring-1 focus:ring-white focus:ring-offset-[#1C1C1E] focus:ring-offset-2"
                    />
                    <span className="ml-3 text-[15px] text-[#EBEBF5]">
                      หารเฉพาะคนที่มียอด <span className="text-[13px] text-[#8E8E93] block sm:inline">(Active Only)</span>
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="treatSharingMode"
                      value="all"
                      checked={treatSharingMode === 'all'}
                      onChange={() => setTreatSharingMode('all')}
                      className="w-5 h-5 text-white bg-[#2C2C2E] border-[#3A3A3C] focus:ring-1 focus:ring-white focus:ring-offset-[#1C1C1E] focus:ring-offset-2"
                    />
                    <span className="ml-3 text-[15px] text-[#EBEBF5]">
                      หารทุกคนที่เหลือ <span className="text-[13px] text-[#8E8E93] block sm:inline">(All Remaining)</span>
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default Costs;
