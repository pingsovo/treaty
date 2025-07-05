
import React, { useState } from 'react';
import SectionCard from './SectionCard';

function People({ people, addPerson, removePerson }) {
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddPerson = () => {
    if (newPersonName.trim() !== '') {
      addPerson(newPersonName);
      setNewPersonName('');
    }
  };

  return (
    <SectionCard
      title="ใครกินบ้าง?"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.88 6-3.88s5.97 1.89 6 3.88c-1.29 1.94-3.5 3.22-6 3.22z" /></svg>}
      description="เพิ่มทุกคนที่มีส่วนร่วมในการแบ่งค่าอาหารกลางวันครั้งนี้"
      bgColor="bg-gray-800"
      borderColor="border-purple-800"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
          placeholder="เช่น อลิซ, บ็อบ"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddPerson(); }}
        />
        <button
          onClick={handleAddPerson}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 active:scale-95"
        >
          เพิ่มคน
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {people.length === 0 ? (
          <p className="text-gray-500 italic">ยังไม่มีคนเพิ่ม</p>
        ) : (
          people.map(p => (
            <span key={p.id} className="flex items-center bg-purple-800 text-purple-100 px-4 py-2 rounded-full text-base font-medium shadow-md transition-all duration-200 hover:bg-purple-700">
              {p.name}
              <button
                onClick={() => removePerson(p.id)}
                className="ml-2 text-purple-300 hover:text-red-400 transition-colors duration-200"
                aria-label={`ลบ ${p.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))
        )}
      </div>
    </SectionCard>
  );
}

export default People;
