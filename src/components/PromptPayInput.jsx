
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

  const generateQRCode = () => {
    if (promptPayId.trim() === '') {
      alert('Please enter a PromptPay ID.');
      return;
    }
    // Format for PromptPay QR code (Thai QR Payment standard)
    // Example: 00020101021230370016A000000677010111011300000000000005802TH53037645405100.006304A70B
    // This is a simplified example. A real PromptPay QR would require more details.
    // For simplicity, we'll just use the ID and amount.
    const formattedAmount = totalAmount.toFixed(2);
    const qrData = `00020101021229370016A0000006770101110113${promptPayId}5802TH530376454${formattedAmount}6304`;
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
