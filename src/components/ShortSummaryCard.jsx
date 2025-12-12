
import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import PartyReceipt from './PartyReceipt';
import PromptPayInput from './PromptPayInput';

function ShortSummaryCard({ people, calculatedResults, handleDownloadImage, summaryCardRef }) {
  const partyReceiptRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const totalAmount = Object.values(calculatedResults).reduce((sum, result) => sum + result.totalPay, 0);
  const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const handleExportPDF = async () => {
    if (partyReceiptRef.current) {
      setIsExporting(true);
      try {
        // Need a small delay to ensure rendering if it was hidden
        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await htmlToImage.toPng(partyReceiptRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#111827' // Match bg-gray-900
        });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [partyReceiptRef.current.offsetWidth, partyReceiptRef.current.offsetHeight] // Custom size based on content
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`lunch-party-receipt-${new Date().toISOString().slice(0, 10)}.pdf`);
      } catch (error) {
        console.error('PDF Export Error:', error);
        alert('Could not export PDF. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 sm:p-8 rounded-3xl shadow-2xl border border-blue-700 relative overflow-hidden mt-4 mb-4 sm:mt-8 sm:mb-8" ref={summaryCardRef}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center shadow-sm">
              <span className="mr-3 text-3xl sm:text-4xl">🧾</span> สรุปยอดจ่ายจริง
            </h2>
            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {isExporting ? 'Creating...' : 'PDF'}
              </button>
              <button
                onClick={handleDownloadImage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: QR Code */}
            <div className="flex justify-center md:justify-start">
              <PromptPayInput totalAmount={totalAmount} />
            </div>

            {/* Right Column: Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="text-sm uppercase bg-blue-900/50 text-blue-200 border-b border-blue-700">
                  <tr>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 rounded-tl-lg text-sm sm:text-base">ชื่อ</th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-right rounded-tr-lg text-sm sm:text-base">ยอดที่ต้องจ่าย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-800">
                  {people.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-800/30 transition-colors">
                      <td className="py-2 px-3 sm:py-3 sm:px-4 font-medium text-white flex items-center text-sm sm:text-base">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] sm:text-xs font-bold mr-2 sm:mr-3 shadow-md">
                          {p.name.charAt(0)}
                        </div>
                        {p.name}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-right font-bold text-green-400 text-base sm:text-lg">
                        {calculatedResults[p.id].totalPay.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-900 border-t-2 border-indigo-600">
                  <tr>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 font-bold text-base sm:text-xl text-white text-right">รวมทั้งหมด</td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 text-right font-bold text-xl sm:text-2xl text-green-400">
                      {totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Party Receipt for PDF Generation */}
      <div style={{ position: 'absolute', top: -10000, left: -10000 }}>
        <PartyReceipt
          ref={partyReceiptRef}
          people={people}
          calculatedResults={calculatedResults}
          totalAmount={totalAmount}
          date={dateStr}
        />
      </div>
    </>
  );
}

export default ShortSummaryCard;
