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
          backgroundColor: '#000000' // Dark mode background for the receipt
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
      <div className="bg-[#1C1C1E] p-5 sm:p-7 rounded-3xl shadow-sm border border-[#2C2C2E] mt-4 mb-4 sm:mt-6 sm:mb-6" ref={summaryCardRef}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-[22px] sm:text-[24px] font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            สรุปยอดจ่ายจริง
          </h2>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-[#2C2C2E] text-white border border-[#3A3A3C] px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-transform active:scale-[0.96] flex items-center text-[15px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {isExporting ? 'Creating...' : 'PDF'}
            </button>
            <button
              onClick={handleDownloadImage}
              className="bg-white text-black px-4 py-2.5 rounded-xl font-bold shadow-sm transition-transform active:scale-[0.96] flex items-center text-[15px]"
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
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <div className="min-w-full px-5 sm:px-0">
              <table className="w-full text-left text-white text-[15px]">
                <thead className="text-[13px] uppercase text-[#8E8E93] border-b border-[#3A3A3C]">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 rounded-tl-lg font-semibold tracking-wider">ชื่อ</th>
                    <th className="py-3 px-3 sm:px-4 text-right rounded-tr-lg font-semibold tracking-wider">ยอดที่ต้องจ่าย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3A3C]">
                  {people.map((p) => (
                    <tr key={p.id} className="hover:bg-[#2C2C2E] transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-medium flex items-center">
                        <div className="w-[28px] h-[28px] rounded-full bg-[#3A3A3C] text-[#8E8E93] flex items-center justify-center text-[12px] font-bold mr-3 flex-shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        {p.name}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right font-bold text-white text-[16px]">
                        ฿{calculatedResults[p.id].totalPay.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-[#3A3A3C]">
                  <tr>
                    <td className="py-4 px-3 sm:px-4 font-semibold text-[16px] text-[#8E8E93] text-right">รวมทั้งหมด</td>
                    <td className="py-4 px-3 sm:px-4 text-right font-bold text-[22px] text-white">
                      ฿{totalAmount.toFixed(2)}
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
