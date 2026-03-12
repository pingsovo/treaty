
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
    <div className="p-4 bg-[#2C2C2E] rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          className="flex-grow p-3 text-[15px] bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder-[#8E8E93]"
          placeholder="ชื่อรายการ (ไม่บังคับ)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full sm:w-32 p-3 text-[15px] bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder-[#8E8E93]"
          placeholder="ราคา (฿)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddSharedItem(); }}
        />
      </div>
      <div className="mb-5">
        <label className="block text-[#EBEBF5] text-[15px] font-medium mb-2.5">ใครแชร์รายการนี้บ้าง?</label>
        <div className="flex flex-wrap gap-2">
          {people.map(p => {
            const isSelected = selectedSharers.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => handleSharerToggle(p.id)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-transform active:scale-95 border
                  ${isSelected ? 'bg-white text-black border-white shadow-sm' : 'bg-[#1C1C1E] text-[#8E8E93] border-[#3A3A3C]'}`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={handleAddSharedItem}
        className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-[0.98] transition-transform shadow-sm"
      >
        เพิ่มรายการที่แชร์
      </button>

      {sharedItems.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#3A3A3C]">
          <h4 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">รายการที่แชร์ปัจจุบัน</h4>
          <ul className="space-y-2">
            {sharedItems.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-[#1C1C1E] px-3 py-2.5 rounded-xl border border-[#2C2C2E]">
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-white">
                    {item.name || 'ไม่มีชื่อ'} <span className="text-white font-bold ml-1">฿{item.price.toFixed(2)}</span>
                  </span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">
                    แชร์โดย: {item.sharers.map(id => people.find(p => p.id === id)?.name).join(', ')}
                  </span>
                </div>
                <button
                  onClick={() => removeSharedItem(item.id)}
                  className="ml-3 text-[#8E8E93] hover:text-[#FF453A] transition-colors p-2 active:scale-95"
                  aria-label="ลบรายการ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#8E8E93]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>}
    >
      {people.length < 1 ? (
        <p className="text-[#8E8E93] text-[15px] italic">กรุณาเพิ่มคนอย่างน้อยหนึ่งคนเพื่อเพิ่มรายการที่แชร์</p>
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
