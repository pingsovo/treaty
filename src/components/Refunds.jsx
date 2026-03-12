
import React, { useState } from 'react';
import SectionCard from './SectionCard';

/**
 * Refunds section — lets user mark a wrong order as refunded.
 * A refund is attributed to a specific person's order and deducted proportionally.
 *
 * Props:
 *  refunds: [{ id, personId, personName, itemNote, amount, mode }]
 *  people: [{ id, name }]
 *  onAdd: ({ personId, itemNote, amount, mode }) => void
 *  onRemove: (id) => void
 */
function Refunds({ refunds, people, onAdd, onRemove }) {
  const [personId, setPersonId] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [mode, setMode] = useState('direct'); // 'direct' | 'app'

  const handleAdd = () => {
    const amount = parseFloat(amountStr);
    if (!personId || isNaN(amount) || amount <= 0) {
      alert('กรุณาเลือกชื่อและกรอกจำนวนเงินที่ได้รับคืน');
      return;
    }
    const person = people.find((p) => p.id === personId);
    onAdd({ personId, personName: person?.name || '', itemNote: itemNote.trim(), amount, mode });
    setItemNote('');
    setAmountStr('');
  };

  return (
    <SectionCard
      title="คืนเงิน / สั่งผิด"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#8E8E93]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
        </svg>
      }
    >
      {/* Add Refund Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Person selector */}
        <div>
          <label className="block text-[#EBEBF5] text-[15px] font-medium mb-2">คนที่สั่งผิด</label>
          <select
            className="w-full p-3 text-[15px] bg-[#2C2C2E] sm:bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF9F0A] transition-all text-white appearance-none"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
          >
            <option value="">-- เลือก --</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-[#EBEBF5] text-[15px] font-medium mb-2">ยอดที่ได้รับคืน (฿)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-3 text-[15px] bg-[#2C2C2E] sm:bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF9F0A] transition-all text-white placeholder-[#8E8E93]"
            placeholder="0.00"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
        </div>

        {/* Item note */}
        <div className="sm:col-span-2">
          <label className="block text-[#EBEBF5] text-[15px] font-medium mb-2">หมายเหตุ (optional)</label>
          <input
            type="text"
            className="w-full p-3 text-[15px] bg-[#2C2C2E] sm:bg-[#1C1C1E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF9F0A] transition-all text-white placeholder-[#8E8E93]"
            placeholder="เช่น ผัดกะเพรา สั่งผิด"
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
          />
        </div>

        {/* Mode */}
        <div className="sm:col-span-2">
          <label className="block text-[#EBEBF5] text-[15px] font-medium mb-2.5">ประเภทการคืนเงิน</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="refundMode" value="direct" checked={mode === 'direct'} onChange={() => setMode('direct')} className="w-5 h-5 text-[#FF9F0A] bg-[#2C2C2E] border-none focus:ring-0 focus:ring-offset-0" />
              <span className="text-[15px] text-[#EBEBF5]">
                💵 คืนตรงจากร้าน <span className="text-[13px] text-[#8E8E93] ml-1">(หักยอดตรงๆ)</span>
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="refundMode" value="app" checked={mode === 'app'} onChange={() => setMode('app')} className="w-5 h-5 text-[#FF9F0A] bg-[#2C2C2E] border-none focus:ring-0 focus:ring-offset-0" />
              <span className="text-[15px] text-[#EBEBF5]">
                📱 คืนผ่าน App <span className="text-[13px] text-[#8E8E93] ml-1">(อาจมี service charge/VAT)</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full sm:w-auto px-6 py-3 bg-[#FF9F0A] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm active:scale-[0.98] mb-5"
      >
        เพิ่มรายการคืนเงิน
      </button>

      {/* Refund list */}
      {refunds.length > 0 && (
        <div className="mt-2 pt-4 border-t border-[#3A3A3C]">
          <h4 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">รายการคืนเงินปัจจุบัน</h4>
          <ul className="space-y-2">
            {refunds.map((r) => (
              <li key={r.id} className="flex justify-between items-start bg-[#1C1C1E] px-4 py-3 rounded-xl border-l-[3px] border-[#FF9F0A]">
                <div>
                  <span className="font-semibold text-white">{r.personName}</span>
                  {r.itemNote && <span className="text-[#8E8E93] ml-2">— {r.itemNote}</span>}
                  <div className="text-[13px] text-[#8E8E93] mt-1">
                    {r.mode === 'direct' ? '💵 คืนตรงจากร้าน' : '📱 คืนผ่าน App'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#FF9F0A] font-bold text-[16px]">-฿{r.amount.toFixed(2)}</span>
                  <button onClick={() => onRemove(r.id)} className="text-[#8E8E93] hover:text-[#FF453A] transition-colors p-1" aria-label="ลบรายการ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {refunds.length === 0 && (
        <p className="text-[#8E8E93] text-[15px] italic">ยังไม่มีรายการคืนเงิน</p>
      )}
    </SectionCard>
  );
}

export default Refunds;
