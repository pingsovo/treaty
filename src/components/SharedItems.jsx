
import React, { useState } from 'react';
import SectionCard from './SectionCard';

function SharedItemInput({ people, addSharedItem, sharedItems, removeSharedItem }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedSharers, setSelectedSharers] = useState([]);

  const handleAddSharedItem = () => {
    addSharedItem(itemName, itemPrice, selectedSharers);
    setItemName('');
    setItemPrice('');
    setSelectedSharers([]);
  };

  const handleSharerToggle = (personId) => {
    if (selectedSharers.includes(personId)) {
      setSelectedSharers(selectedSharers.filter(id => id !== personId));
    } else {
      setSelectedSharers([...selectedSharers, personId]);
    }
  };

  return (
    <div className="p-4 border border-green-900 rounded-xl bg-gray-900 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ชื่อรายการที่แชร์ (ไม่บังคับ)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full sm:w-28 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ราคา (฿)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onBlur={handleAddSharedItem}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddSharedItem(); }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-lg font-medium mb-2">ใครแชร์รายการนี้บ้าง?</label>
        <div className="flex flex-wrap gap-2">
          {people.map(p => (
            <button
              key={p.id}
              onClick={() => handleSharerToggle(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-md transform hover:scale-105 active:scale-95
                ${selectedSharers.includes(p.id) ? 'bg-green-600 text-white' : 'bg-green-800 text-green-100 hover:bg-green-700'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleAddSharedItem}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-md w-full active:scale-95"
      >
        เพิ่มรายการที่แชร์
      </button>

      {sharedItems.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h4 className="text-lg font-semibold text-green-300 mb-2">รายการที่แชร์ปัจจุบัน:</h4>
          <ul className="space-y-2 text-gray-300">
            {sharedItems.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-700">
                <span className="font-medium">
                  {item.name || 'รายการที่ไม่มีชื่อ'} - ฿{item.price.toFixed(2)} (แชร์โดย: {item.sharers.map(id => people.find(p => p.id === id)?.name).join(', ')})
                </span>
                <button
                  onClick={() => removeSharedItem(item.id)}
                  className="ml-3 text-green-400 hover:text-green-200 transition-colors duration-200"
                  aria-label={`ลบ ${item.name || 'รายการ'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SharedItems({ people, addSharedItem, sharedItems, removeSharedItem }) {
  return (
    <SectionCard
      title="รายการที่แชร์"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>}
      description="เพิ่มรายการเช่น ของกินเล่นหรือเครื่องดื่มที่หลายคนแชร์กัน"
      bgColor="bg-gray-800"
      borderColor="border-green-800"
    >
      {people.length < 1 ? (
        <p className="text-gray-400 italic">กรุณาเพิ่มคนอย่างน้อยหนึ่งคนเพื่อเพิ่มรายการที่แชร์</p>
      ) : (
        <SharedItemInput
          people={people}
          addSharedItem={addSharedItem}
          sharedItems={sharedItems}
          removeSharedItem={removeSharedItem}
        />
      )}
    </SectionCard>
  );
}

export default SharedItems;
