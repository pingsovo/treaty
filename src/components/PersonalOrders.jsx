
import React, { useState } from 'react';
import SectionCard from './SectionCard';

function PersonOrderInput({ person, addItem, removeItem }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    addItem(person.id, itemName, itemPrice);
    setItemName('');
    setItemPrice('');
  };

  return (
    <div className="mb-4 p-4 border border-blue-900 rounded-xl bg-gray-900 shadow-sm">
      <h3 className="text-xl font-bold text-blue-300 mb-3">{person.name}</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ชื่อรายการ (ไม่บังคับ)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full sm:w-28 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ราคา (฿)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onBlur={handleAddItem}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddItem(); }}
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md active:scale-95"
        >
          เพิ่มรายการ
        </button>
      </div>
      {person.items.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 mt-4 border-t border-gray-700 pt-3">
          {person.items.map(item => (
            <li key={item.id} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-700">
              <span className="font-medium">{item.name || 'รายการที่ไม่มีชื่อ'}</span> {/* แสดง 'รายการที่ไม่มีชื่อ' หากชื่อว่างเปล่า */}
              <span className="flex items-center">
                ฿{item.price.toFixed(2)}
                <button
                  onClick={() => removeItem(person.id, item.id)}
                  className="ml-3 text-blue-400 hover:text-blue-200 transition-colors duration-200"
                  aria-label={`ลบ ${item.name || 'รายการ'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PersonalOrders({ people, addItemToPerson, removeItemFromPerson }) {
  return (
    <SectionCard
      title="รายการสั่งซื้อส่วนตัว"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 16H7v-2h2v2zm0-4H7V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z" /></svg>}
      description="ป้อนรายการที่แต่ละคนสั่งเอง"
      bgColor="bg-gray-800"
      borderColor="border-blue-800"
    >
      {people.length === 0 ? (
        <p className="text-gray-400 italic">กรุณาเพิ่มคนก่อนเพื่อกำหนดรายการสั่งซื้อส่วนตัว</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {people.map(p => (
            <PersonOrderInput
              key={p.id}
              person={p}
              addItem={addItemToPerson}
              removeItem={removeItemFromPerson}
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export default PersonalOrders;
