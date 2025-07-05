
import React from 'react';
import SectionCard from './SectionCard';

function Costs({ shippingCost, setShippingCost, discount, setDiscount, serviceChargeEnabled, setServiceChargeEnabled, serviceChargePercentage, setServiceChargePercentage, vatEnabled, setVatEnabled }) {
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
      </div>
    </SectionCard>
  );
}

export default Costs;
