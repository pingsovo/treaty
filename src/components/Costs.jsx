
import React from 'react';
import SectionCard from './SectionCard';

function Costs({ shippingCost, setShippingCost, discount, setDiscount, serviceChargeEnabled, setServiceChargeEnabled, serviceChargePercentage, setServiceChargePercentage, vatEnabled, setVatEnabled, people, treatedPeopleIds, setTreatedPeopleIds, treatSharingMode, setTreatSharingMode }) {
  return (
    <SectionCard
      title="ค่าใช้จ่ายเพิ่มเติม / ส่วนลด"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>}
      description="ป้อนค่าส่งและส่วนลดโดยรวม"
      bgColor="bg-gray-800"
      borderColor="border-yellow-800"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="shipping" className="block text-gray-300 text-lg font-medium mb-2">ค่าส่ง (฿):</label>
          <input
            id="shipping"
            type="number"
            min="0"
            step="0.01"
            className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
            value={shippingCost}
            onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-gray-300 text-lg font-medium mb-2">จำนวนส่วนลด (฿):</label>
          <input
            id="discount"
            type="number"
            min="0"
            step="0.01"
            className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-between bg-gray-700 p-3 rounded-xl border border-gray-600">
            <span className="text-gray-300 text-lg font-medium">มี Service Charge</span>
            <label htmlFor="serviceChargeToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="serviceChargeToggle"
                className="sr-only peer"
                checked={serviceChargeEnabled}
                onChange={() => setServiceChargeEnabled(!serviceChargeEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-yellow-500"></div>
            </label>
          </div>
          {serviceChargeEnabled && (
            <div>
              <label htmlFor="serviceChargePercentage" className="block text-gray-300 text-lg font-medium mb-2">เปอร์เซ็นต์ Service Charge (%):</label>
              <input
                id="serviceChargePercentage"
                type="number"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                value={serviceChargePercentage}
                onChange={(e) => setServiceChargePercentage(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
          <div className="flex items-center justify-between bg-gray-700 p-3 rounded-xl border border-gray-600">
            <span className="text-gray-300 text-lg font-medium">มี VAT 7%</span>
            <label htmlFor="vatToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="vatToggle"
                className="sr-only peer"
                checked={vatEnabled}
                onChange={() => setVatEnabled(!vatEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-yellow-500"></div>
            </label>
          </div>
        </div>

        {/* Treat Mode Section */}
        {people && people.length > 0 && (
          <div className="col-span-full mt-6 border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
              <span className="mr-2">🎁</span> คนเลี้ยง / คนที่ไม่ต้องจ่าย (Treat Mode)
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              เลือกคนที่ <strong>ไม่ต้องจ่ายเงิน</strong> (ทุกคนที่เหลือจะหารยอดนี้เพิ่มเท่าๆ กัน)
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-md transform hover:scale-105 active:scale-95
                    ${treatedPeopleIds.includes(p.id) ? 'bg-yellow-600 text-white border-2 border-yellow-400' : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'}`}
                >
                  {p.name} {treatedPeopleIds.includes(p.id) && '🎉'}
                </button>
              ))}
            </div>

            {/* Sharing Mode Toggle - Only show if there are treated people */}
            {treatedPeopleIds.length > 0 && (
              <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 animate-fade-in-up">
                <p className="text-gray-300 text-sm font-medium mb-3">รูปแบบการหารยอดของคนเลี้ยง:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="treatSharingMode"
                      value="active_only"
                      checked={treatSharingMode === 'active_only'}
                      onChange={() => setTreatSharingMode('active_only')}
                      className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="ml-2 text-gray-200 group-hover:text-white transition-colors">
                      หารเฉพาะคนที่มียอด <span className="text-xs text-gray-400 block sm:inline">(Active Only)</span>
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="treatSharingMode"
                      value="all"
                      checked={treatSharingMode === 'all'}
                      onChange={() => setTreatSharingMode('all')}
                      className="w-5 h-5 text-yellow-500 bg-gray-600 border-gray-500 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="ml-2 text-gray-200 group-hover:text-white transition-colors">
                      หารทุกคนที่เหลือ <span className="text-xs text-gray-400 block sm:inline">(All Remaining)</span>
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
