
import React from 'react';

function HelpGuide({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">📖 คู่มือการใช้งาน</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8 text-gray-300">
                    {/* Scenario 1: Normal Split */}
                    <section>
                        <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center">
                            1. การหารค่าอาหารปกติ
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>เพิ่มชื่อเพื่อนๆ ในส่วน <strong>"สมาชิกในปาร์ตี้"</strong> (ด้านล่างสุด)</li>
                            <li>ไปที่ส่วน <strong>"รายการส่วนตัว"</strong></li>
                            <li>พิมพ์ชื่อรายการและราคา ในช่องของเพื่อนแต่ละคน แล้วกด Enter</li>
                        </ol>
                    </section>

                    {/* Scenario 2: Shared Items */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-400 mb-3 flex items-center">
                            2. การหารของทานเล่น / กองกลาง
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>ไปที่ส่วน <strong>"รายการที่แชร์"</strong> (สีเขียว)</li>
                            <li>ใส่ราคาของรายการนั้น (เช่น ค่าเฟรนช์ฟรายส์ 120 บาท)</li>
                            <li>คลิกเลือกชื่อคนที่จะร่วมหารรายการนี้ (ปุ่มจะเป็นสีเขียวเมื่อถูกเลือก)</li>
                            <li>กดปุ่ม <strong>"เพิ่มรายการที่แชร์"</strong></li>
                        </ol>
                    </section>

                    {/* Scenario 3: Treat Mode */}
                    <section>
                        <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center">
                            3. ฟีเจอร์ "มีคนเลี้ยง" (Treat Mode) 🎉
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">ใช้เมื่อมีคนในกลุ่มที่ไม่ต้องจ่ายเงิน (เช่น วันเกิดเพื่อน หรือ รุ่นพี่เลี้ยงน้อง)</p>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>ใส่ออเดอร์และรายการแชร์ตามปกติ <strong>เสมือนว่าทุกคนจ่ายเอง</strong></li>
                            <li>ไปที่ส่วน <strong>"ค่าใช้จ่ายเพิ่มเติม / ส่วนลด"</strong> (สีเหลือง)</li>
                            <li>ในหัวข้อ <strong>"คนเลี้ยง / คนที่ไม่ต้องจ่าย"</strong> ให้คลิกชื่อคนที่ไม่ต้องจ่าย</li>
                            <li>ระบบจะนำยอดเงินของคนนั้น ไปหารเฉลี่ยให้เพื่อนที่เหลือโดยอัตโนมัติ</li>
                        </ol>
                    </section>

                    {/* Scenario 4: Payment */}
                    <section>
                        <h3 className="text-xl font-semibold text-indigo-400 mb-3 flex items-center">
                            4. การจ่ายเงินและดูสรุป
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>ตรวจสอบยอดรวมได้ที่ส่วน <strong>"สรุปสั้นๆ"</strong></li>
                            <li>ใส่เบอร์ PromptPay ของคนรับเงิน เพื่อสร้าง QR Code (ไม่ต้องใส่ยอดเงิน ผู้โอนต้องระบุเอง)</li>
                            <li>กดปุ่ม <strong>"Save as Image"</strong> เพื่อบันทึกรูปไปแปะในกลุ่มไลน์ได้ทันที</li>
                        </ol>
                    </section>
                </div>

                <div className="p-6 border-t border-gray-700 bg-gray-900 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                        เข้าใจแล้ว ลุยเลย! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HelpGuide;
