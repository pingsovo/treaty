
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Cookies from 'js-cookie';

const PROMPTPAY_ID_COOKIE = 'promptPayId';

function PromptPayInput({ totalAmount }) {
  const [promptPayId, setPromptPayId] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');

  useEffect(() => {
    const savedId = Cookies.get(PROMPTPAY_ID_COOKIE);
    if (savedId) {
      setPromptPayId(savedId);
      // Auto-generate QR if we have a saved ID
    }
  }, []);

  // CRC-16/CCITT-FALSE
  const crc16 = (data) => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= (data.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  };

  // Build a TLV (Tag-Length-Value) field
  const field = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const generateQRCode = () => {
    const raw = promptPayId.replace(/[-\s]/g, '');

    if (raw === '') {
      alert('กรุณากรอก PromptPay ID');
      return;
    }

    let accountField;
    if (raw.length === 10 && /^\d+$/.test(raw)) {
      // Mobile number: prefix country code, strip leading 0 → 66XXXXXXXXX
      const normalized = '0066' + raw.slice(1);
      accountField = field('01', normalized);
    } else if (raw.length === 13 && /^\d+$/.test(raw)) {
      // Thai national ID / Tax ID
      accountField = field('02', raw);
    } else {
      alert('PromptPay ID ไม่ถูกต้อง\nกรุณาใช้เบอร์มือถือ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก');
      return;
    }

    // Merchant account info template (ID 29)
    const guid = field('00', 'A000000677010111');
    const merchantAccount = field('29', guid + accountField);

    // Build payload without CRC
    const payload =
      field('00', '01') +          // Payload Format Indicator
      field('01', '11') +          // Point of Initiation: static
      merchantAccount +            // Merchant Account (ID 29)
      field('53', '764') +         // Currency: THB
      field('58', 'TH') +          // Country
      field('63', '0000');         // Placeholder for CRC (4 zeros)

    // Replace placeholder CRC with real one
    const realCrc = crc16(payload.slice(0, -4)); // Calc over everything except last 4 chars ('0000')
    const finalPayload = payload.slice(0, -4) + realCrc;

    setQrCodeValue(finalPayload);
    Cookies.set(PROMPTPAY_ID_COOKIE, promptPayId, { expires: 365 });
  };

  // Auto-regenerate QR when totalAmount changes (if QR was already shown)
  useEffect(() => {
    if (qrCodeValue && promptPayId) {
      generateQRCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount]);

  return (
    <div className="p-5 bg-gradient-to-b from-[#0A84FF] to-[#0055B3] rounded-[24px] shadow-lg w-full relative overflow-hidden">
      {/* Decorative top cutout for wallet pass look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[12px] bg-black rounded-b-[10px]"></div>

      <h3 className="text-[18px] font-bold text-white mb-4 text-center mt-2 tracking-wide font-medium">PromptPay QR</h3>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          id="promptPayId"
          type="text"
          inputMode="numeric"
          className="flex-1 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 text-[15px] transition-all"
          placeholder="เบอร์มือถือ / เลขบัตร ปชช."
          value={promptPayId}
          onChange={(e) => setPromptPayId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
        />
        <button
          onClick={generateQRCode}
          className="px-5 py-3 bg-white text-[#0A84FF] font-bold rounded-xl shadow-sm active:scale-[0.96] transition-transform text-[15px] whitespace-nowrap"
        >
          สร้าง QR
        </button>
      </div>

      {qrCodeValue && (
        <div className="mt-6 flex flex-col items-center bg-white rounded-[20px] p-6 pb-5 shadow-inner relative">
          {/* Top dashed line for "ticket" effect */}
          <div className="absolute top-0 left-5 right-5 h-[1px] border-t-2 border-dashed border-gray-200"></div>
          {/* Half circles on sides for ticket effect */}
          <div className="absolute -top-3 left-0 w-6 h-6 bg-[#0055B3] rounded-full -translate-x-1/2"></div>
          <div className="absolute -top-3 right-0 w-6 h-6 bg-[#0055B3] rounded-full translate-x-1/2"></div>
          
          <div className="bg-white p-2 rounded-xl mb-3">
            <QRCodeSVG
              value={qrCodeValue}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-gray-800 font-bold text-[22px]">฿{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-gray-500 text-[13px] mt-0.5 text-center font-medium">แสกนเพื่อชำระเงินผ่านแอปธนาคาร</p>
        </div>
      )}
    </div>
  );
}

export default PromptPayInput;
