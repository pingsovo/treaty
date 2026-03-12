
import React, { useState } from 'react';
import SectionCard from './SectionCard';

/**
 * People component — manage session members.
 * suggestionNames: string[] — names from other sessions, offered as quick-add chips.
 */
function People({ people, addPerson, removePerson, suggestionNames = [] }) {
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddPerson = (name = newPersonName) => {
    const trimmed = name.trim();
    if (trimmed === '') return;
    addPerson(trimmed);
    setNewPersonName('');
  };

  const currentNames = new Set(people.map((p) => p.name.toLowerCase()));

  // Filter suggestions to those not already in this session (case-insensitive)
  const filteredSuggestions = [...new Set(suggestionNames)].filter(
    (n) => !currentNames.has(n.toLowerCase())
  );

  return (
    <SectionCard
      title="ใครกินบ้าง?"
      icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#8E8E93]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.88 6-3.88s5.97 1.89 6 3.88c-1.29 1.94-3.5 3.22-6 3.22z" /></svg>}
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          className="flex-grow p-3 bg-[#2C2C2E] rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder-[#8E8E93] text-[17px]"
          placeholder="เช่น อลิซ, บ็อบ"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddPerson(); }}
        />
        <button
          onClick={() => handleAddPerson()}
          className="px-6 py-3 bg-white text-black font-bold rounded-xl active:scale-[0.98] transition-transform flex-shrink-0"
        >
          เพิ่มคน
        </button>
      </div>

      {/* Cross-session suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="mb-5">
          <p className="text-[13px] text-[#8E8E93] mb-2">เพิ่มจาก Session อื่น:</p>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((name) => (
              <button
                key={name}
                onClick={() => handleAddPerson(name)}
                className="px-3 py-1.5 text-[14px] bg-[#1C1C1E] border border-[#3A3A3C] text-white rounded-full active:scale-95 transition-transform"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Added people chips */}
      <div className="flex flex-wrap gap-2">
        {people.length === 0 ? (
          <p className="text-[#8E8E93] text-[15px] italic">ยังไม่มีคนเพิ่ม</p>
        ) : (
          people.map(p => (
            <span key={p.id} className="flex items-center bg-[#2C2C2E] text-white px-3 py-1.5 rounded-full text-[15px] cursor-default">
              {p.name}
              <button
                onClick={() => removePerson(p.id)}
                className="ml-2 text-[#8E8E93] hover:text-[#FF453A] active:scale-95 transition-all"
                aria-label={`ลบ ${p.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
