
import React, { useState } from 'react';
import SectionCard from './SectionCard';

function PersonOrderInput({ person, addItem, removeItem }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) return; // guard against empty/NaN
    addItem(person.id, itemName, itemPrice);
    setItemName('');
    setItemPrice('');
  };

  return (
    <div className="mb-3 p-4 bg-[#2C2C2E] rounded-2xl shadow-sm relative flex flex-col h-full">
      <h3 className="text-[17px] font-semibold text-white mb-3 truncate">{person.name}</h3>
      <div className="flex flex-col gap-2 mb-3">
        <input
          type="text"
          className="w-full p-2.5 text-[15px] bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder-[#8E8E93]"
          placeholder="รายการ (เช่น กะเพรา)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2.5 text-[15px] bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder-[#8E8E93]"
            placeholder="ราคา ฿"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddItem(); }}
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2.5 bg-white text-black font-bold rounded-xl active:scale-[0.96] opacity-90 transition-transform whitespace-nowrap shadow-sm flex items-center justify-center"
            aria-label="Add item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Spacer to push items list to the bottom if container grows */}
      <div className="flex-grow"></div>

      {person.items.length > 0 && (
        <ul className="space-y-2 mt-4 pt-3 border-t border-[#3A3A3C]">
          {person.items.map(item => (
            <li key={item.id} className="flex justify-between items-center px-1">
              <span className="truncate mr-2 max-w-[120px] text-[15px] text-[#EBEBF5]">{item.name || 'ไม่มีชื่อ'}</span>
              <span className="flex items-center text-[15px] font-medium text-white">
                ฿{item.price.toFixed(0)}
                <button
                  onClick={() => removeItem(person.id, item.id)}
                  className="ml-3 text-[#8E8E93] hover:text-[#FF453A] active:scale-95 transition-all"
                  aria-label="ลบ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
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
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#8E8E93]" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 16H7v-2h2v2zm0-4H7V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z" /></svg>}
    >
      {people.length === 0 ? (
        <p className="text-[#8E8E93] text-[15px] italic">กรุณาเพิ่มคนก่อนเพื่อกำหนดรายการสั่งซื้อส่วนตัว</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
