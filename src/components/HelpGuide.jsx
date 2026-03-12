
import React from 'react';

function HelpGuide({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div className="bg-[#1C1C1E] rounded-[24px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2C2C2E]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#3A3A3C] sticky top-0 bg-[#1C1C1E]/95 backdrop-blur-sm z-10">
                    <h2 className="text-[22px] font-bold text-white tracking-wide">คู่มือการใช้งาน</h2>
                    <button
                        onClick={onClose}
                        className="text-[#8E8E93] hover:text-white transition-colors p-1.5 rounded-full bg-[#2C2C2E] hover:bg-[#3A3A3C] active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-7 space-y-8 text-[#EBEBF5] text-[15px] leading-relaxed">
                    {/* Scenario 1: Normal Split */}
                    <section>
                        <h3 className="text-[18px] font-bold text-[#0A84FF] mb-3 flex items-center">
                            1. การหารค่าอาหารปกติ
                        </h3>
                        <ol className="list-decimal list-outside space-y-2 ml-5 text-[#8E8E93]">
                            <li><span className="text-[#EBEBF5]">เพิ่มชื่อเพื่อนๆ ในส่วน <strong>"สมาชิกในปาร์ตี้"</strong> (ด้านล่างสุด)</span></li>
                            <li><span className="text-[#EBEBF5]">ไปที่ส่วน <strong>"รายการส่วนตัว"</strong></span></li>
                            <li><span className="text-[#EBEBF5]">พิมพ์ชื่อรายการและราคา ในช่องของเพื่อนแต่ละคน แล้วกด Enter</span></li>
                        </ol>
                    </section>

                    {/* Scenario 2: Shared Items */}
                    <section>
                        <h3 className="text-[18px] font-bold text-[#30D158] mb-3 flex items-center">
                            2. การหารของทานเล่น / กองกลาง
                        </h3>
                        <ol className="list-decimal list-outside space-y-2 ml-5 text-[#8E8E93]">
                            <li><span className="text-[#EBEBF5]">ไปที่ส่วน <strong>"รายการที่แชร์"</strong> (สีเขียว)</span></li>
                            <li><span className="text-[#EBEBF5]">ใส่ราคาของรายการนั้น (เช่น ค่าเฟรนช์ฟรายส์ 120 บาท)</span></li>
                            <li><span className="text-[#EBEBF5]">คลิกเลือกชื่อคนที่จะร่วมหารรายการนี้ (ปุ่มจะเป็นสีเขียวเมื่อถูกเลือก)</span></li>
                            <li><span className="text-[#EBEBF5]">กดปุ่ม <strong>"เพิ่มรายการที่แชร์"</strong></span></li>
                        </ol>
                    </section>

                    {/* Scenario 3: Treat Mode */}
                    <section>
                        <h3 className="text-[18px] font-bold text-[#FF9F0A] mb-3 flex items-center">
                            3. ฟีเจอร์ "มีคนเลี้ยง" (Treat Mode)
                        </h3>
                        <p className="text-[14px] text-[#8E8E93] mb-3">ใช้เมื่อมีคนในกลุ่มที่ไม่ต้องจ่ายเงิน (เช่น วันเกิดเพื่อน หรือ รุ่นพี่เลี้ยงน้อง)</p>
                        <ol className="list-decimal list-outside space-y-2 ml-5 text-[#8E8E93]">
                            <li><span className="text-[#EBEBF5]">ใส่ออเดอร์และรายการแชร์ตามปกติ <strong>เสมือนว่าทุกคนจ่ายเอง</strong></span></li>
                            <li><span className="text-[#EBEBF5]">ไปที่ส่วน <strong>"ค่าใช้จ่ายเพิ่มเติม / ส่วนลด"</strong> (สีส้ม)</span></li>
                            <li><span className="text-[#EBEBF5]">ในหัวข้อ <strong>"คนเลี้ยง / คนที่ไม่ต้องจ่าย"</strong> ให้คลิกชื่อคนที่ไม่ต้องจ่าย</span></li>
                            <li><span className="text-[#EBEBF5]">ระบบจะนำยอดเงินของคนนั้น ไปหารเฉลี่ยให้เพื่อนที่เหลือโดยอัตโนมัติ</span></li>
                        </ol>
                    </section>

                    {/* Scenario 4: Refunds */}
                    <section>
                        <h3 className="text-[18px] font-bold text-[#FF453A] mb-3 flex items-center">
                            4. การคืนเงิน / สั่งผิด
                        </h3>
                        <p className="text-[14px] text-[#8E8E93] mb-3">เมื่อรายการอาหารมาผิด หรือต้องทำการคืนเงินบางส่วน</p>
                        <ol className="list-decimal list-outside space-y-2 ml-5 text-[#8E8E93]">
                            <li><span className="text-[#EBEBF5]">เปิดส่วน <strong>"ส่วนการตั้งค่า"</strong> แล้วเปิดการแสดงผล <strong>"คืนเงิน/ส่งผิด"</strong></span></li>
                            <li><span className="text-[#EBEBF5]">ระบุชื่อคนที่สั่งผิด และกรอกจำนวนเงินที่ได้คืน</span></li>
                            <li><span className="text-[#EBEBF5]">ระบบจะนำเงินคืนไป <strong>หักลบออกจากยอดของคนคนนั้นโดยตรง</strong> ก่อนนำไปคำนวณส่วนลดหรือค่าส่ง (เพื่อรักษาความยุติธรรมให้ทุกคนในกลุ่ม)</span></li>
                        </ol>
                    </section>

                    {/* Scenario 5: Payment */}
                    <section>
                        <h3 className="text-[18px] font-bold text-[#BF5AF2] mb-3 flex items-center">
                            5. การจ่ายเงินและดูสรุป
                        </h3>
                        <ol className="list-decimal list-outside space-y-2 ml-5 text-[#8E8E93]">
                            <li><span className="text-[#EBEBF5]">สามารถตั้งค่าสลับการดู <strong>"สรุปยอดจ่ายจริง"</strong> (ใบเสร็จ) และ <strong>"สรุปบิลสุดท้าย"</strong> (แบบละเอียด) ได้ที่เมนูตั้งค่า</span></li>
                            <li><span className="text-[#EBEBF5]">ใส่เบอร์ PromptPay ของคนรับเงิน เพื่อสร้าง QR Code ไว้แสกนจ่ายได้อย่างรวดเร็ว</span></li>
                            <li><span className="text-[#EBEBF5]">กดปุ่ม <strong>"Save"</strong> บนตาราง หรือโหลด <strong>"PDF"</strong> ใบเสร็จเพื่อส่งในแชทกลุ่มได้เลย</span></li>
                        </ol>
                    </section>
                </div>

                <div className="p-6 border-t border-[#3A3A3C] bg-[#1C1C1E] sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-[#0A84FF] text-white font-bold rounded-xl active:scale-[0.98] transition-transform shadow-sm text-[16px]"
                    >
                        เข้าใจแล้ว
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HelpGuide;
