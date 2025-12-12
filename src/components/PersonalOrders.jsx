
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
    <div className="mb-3 p-3 border border-blue-900 rounded-xl bg-gray-900 shadow-sm relative">
      {/* Remove Person Button (Top Right) - Optional UX improvement later, keeping clean for now */}
      <h3 className="text-lg font-bold text-blue-300 mb-2 truncate">{person.name}</h3>
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          className="w-full p-2 text-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-gray-800 text-white placeholder-gray-400"
          placeholder="รายการ"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 text-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-gray-800 text-white placeholder-gray-400"
            placeholder="฿"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            onBlur={handleAddItem}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddItem(); }}
          />
          <button
            onClick={handleAddItem}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-300 shadow-md active:scale-95 whitespace-nowrap"
          >
            +
          </button>
        </div>
      </div>
      {person.items.length > 0 && (
        <ul className="space-y-2 text-gray-300 mt-2 border-t border-gray-700 pt-2">
          {person.items.map(item => (
            <li key={item.id} className="flex justify-between items-center bg-gray-800/50 px-2 py-1.5 rounded text-sm">
              <span className="truncate mr-2 max-w-[80px]">{item.name || '-'}</span>
              <span className="flex items-center text-xs sm:text-sm">
                ฿{item.price.toFixed(0)}
                <button
                  onClick={() => removeItem(person.id, item.id)}
                  className="ml-2 text-red-400 hover:text-red-300"
                  aria-label="ลบ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
