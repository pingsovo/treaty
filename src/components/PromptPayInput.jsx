
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
    }
  }, []);

  // Function to calculate CRC-16-CCITT
  const crc16ccitt = (data) => {
    const poly = 0x1021;
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= (data.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) > 0) {
          crc = ((crc << 1) ^ poly);
        } else {
          crc <<= 1;
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  };

  const generateQRCode = () => {
    if (promptPayId.trim() === '') {
      alert('Please enter a PromptPay ID.');
      return;
    }

    // PromptPay QR Code Specification (simplified for this use case)
    // Payload Format Indicator (ID 00) - "01"
    // Point of Initiation Method (ID 01) - "11" (static QR)
    // Merchant Information (ID 29-51)
    //   - Merchant Information Template (ID 29)
    //     - Globally Unique Identifier (ID 00) - "A000000677010111" (for PromptPay)
    //     - Merchant ID (ID 01) - Mobile Number (13 digits, e.g., 0812345678) or Thai ID (13 digits)
    // Currency Code (ID 53) - "764" (Thai Baht)
    // Transaction Amount (ID 54) - totalAmount
    // Country Code (ID 58) - "TH"
    // CRC (ID 63) - Calculated CRC-16-CCITT

    let merchantIdField = '';
    if (promptPayId.length === 10 && promptPayId.startsWith('0')) { // Mobile number
      merchantIdField = `01130000000${promptPayId.substring(1)}`; // Format for mobile
    } else if (promptPayId.length === 13 && !isNaN(promptPayId)) { // Thai ID
      merchantIdField = `0213${promptPayId}`; // Format for Thai ID
    } else {
      alert('Invalid PromptPay ID format. Please use a 10-digit mobile number (starting with 0) or a 13-digit Thai ID.');
      return;
    }

    const amountField = totalAmount.toFixed(2);
    const amountLength = amountField.length.toString().padStart(2, '0');

    let qrDataWithoutCrc = `00020101021229370016A000000677010111${merchantIdField}530376454${amountLength}${amountField}5802TH`;

    const crc = crc16ccitt(qrDataWithoutCrc + '6304'); // Append '6304' for CRC calculation
    const qrData = `${qrDataWithoutCrc}6304${crc}`;

    setQrCodeValue(qrData);
    Cookies.set(PROMPTPAY_ID_COOKIE, promptPayId, { expires: 365 }); // Store for 1 year
  };

  return (
    <div className="p-5 bg-gray-900 rounded-xl shadow-md border border-indigo-900">
      <h3 className="text-2xl font-bold text-white mb-3 border-b pb-2 border-indigo-800">PromptPay QR Code</h3>
      <div className="mb-4">
        <label htmlFor="promptPayId" className="block text-gray-300 text-lg font-medium mb-2">PromptPay ID (Mobile/Thai ID):</label>
        <input
          id="promptPayId"
          type="text"
          className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
          placeholder="e.g., 0812345678 or 1-2345-67890-12-3"
          value={promptPayId}
          onChange={(e) => setPromptPayId(e.target.value)}
        />
      </div>
      <button
        onClick={generateQRCode}
        className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 active:scale-95"
      >
        Generate QR Code
      </button>

      {qrCodeValue && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-300 text-lg mb-2">Scan to Pay ฿{totalAmount.toFixed(2)}</p>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <QRCodeSVG
              value={qrCodeValue}
              size={256}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptPayInput;
