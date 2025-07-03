import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

// ส่วนประกอบหลักของแอป
function App() {
  // สถานะสำหรับจัดการข้อมูลบุคคล, รายการสั่งซื้อ, รายการที่แชร์, ค่าส่ง, และส่วนลด
  const [people, setPeople] = useState([
    { id: 'ping', name: 'ปิง', items: [] },
    { id: 'ou', name: 'อู๋', items: [] },
    { id: 'mudmee', name: 'มัดหมี่', items: [] },
    { id: 'm', name: 'เอ็ม', items: [] },
    { id: 'ploy', name: 'พลอย', items: [] },
    { id: 'gugg', name: 'กั๊ก', items: [] },
    { id: 'do', name: 'โด้', items: [] },
    { id: 'dew', name: 'ดิว', items: [] },
    { id: 'taw', name: 'ตาว', items: [] },
  ]);
  const [sharedItems, setSharedItems] = useState([]); // [{ id, name, price, sharers: [personId1, personId2] }]
  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(false);
  const [serviceChargePercentage, setServiceChargePercentage] = useState(10); // Default 10%
  const [vatEnabled, setVatEnabled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [roundUpEnabled, setRoundUpEnabled] = useState(false);

  // สถานะสำหรับช่องกรอกชื่อคนใหม่
  const [newPersonName, setNewPersonName] = useState('');
  const summaryCardRef = useRef(null);

  const handleDownloadImage = () => {
    const element = summaryCardRef.current;
    if (element) {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const fileName = `${year}${month}${day}${hours}${minutes}.png`;

      const rect = element.getBoundingClientRect();

      htmlToImage.toPng(element, {
        backgroundColor: '#111827',
        quality: 1.0,
        pixelRatio: 2,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
      })
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
        alert('Could not save the image. There was a rendering error.');
      });
    }
  };

  // ฟังก์ชันสำหรับเพิ่มคนใหม่
  const addPerson = () => {
    if (newPersonName.trim() !== '') {
      setPeople([...people, { id: Date.now().toString(), name: newPersonName.trim(), items: [] }]);
      setNewPersonName('');
    }
  };

  // ฟังก์ชันสำหรับลบคน
  const removePerson = (personId) => {
    setPeople(prevPeople => prevPeople.filter(p => p.id !== personId));
    // ลบออกจากรายการที่แชร์ที่พวกเขามีส่วนร่วมอยู่ด้วย
    setSharedItems(prevSharedItems => prevSharedItems.map(item => ({
      ...item,
      sharers: item.sharers.filter(sharerId => sharerId !== personId)
    })));
  };

  // ฟังก์ชันสำหรับเพิ่มรายการอาหารให้กับคน
  const addItemToPerson = (personId, itemName, itemPrice) => {
    // ชื่อรายการสามารถเว้นว่างได้ แต่ราคาต้องเป็นตัวเลขที่ไม่ติดลบ
    if (!isNaN(itemPrice) && parseFloat(itemPrice) >= 0) {
      setPeople(prevPeople => prevPeople.map(p =>
        p.id === personId
          ? { ...p, items: [...p.items, { id: Date.now().toString(), name: itemName.trim(), price: parseFloat(itemPrice) }] }
          : p
      ));
    }
  };

  // ฟังก์ชันสำหรับลบรายการอาหารออกจากของคน
  const removeItemFromPerson = (personId, itemId) => {
    setPeople(prevPeople => prevPeople.map(p =>
      p.id === personId
        ? { ...p, items: p.items.filter(item => item.id !== itemId) }
        : p
    ));
  };

  // ฟังก์ชันสำหรับเพิ่มรายการที่แชร์
  const addSharedItem = (itemName, itemPrice, sharerIds) => {
    // ชื่อรายการสามารถเว้นว่างได้ แต่ราคาต้องเป็นตัวเลขที่ไม่ติดลบ และต้องมีผู้แชร์อย่างน้อยหนึ่งคน
    if (!isNaN(itemPrice) && parseFloat(itemPrice) >= 0 && sharerIds.length > 0) {
      setSharedItems(prevSharedItems => [...prevSharedItems, { id: Date.now().toString(), name: itemName.trim(), price: parseFloat(itemPrice), sharers: sharerIds }]);
    }
  };

  // ฟังก์ชันสำหรับลบรายการที่แชร์
  const removeSharedItem = (sharedItemId) => {
    setSharedItems(prevSharedItems => prevSharedItems.filter(item => item.id !== sharedItemId));
  };

  // --- ตรรกะการคำนวณ ---
  const calculateTotals = () => {
    const calculation = {};
    let totalOverallSubtotal = 0; // ยอดรวมทั้งหมดของรายการส่วนตัวและรายการที่แชร์

    // เริ่มต้นการคำนวณสำหรับแต่ละคน
    people.forEach(p => {
      calculation[p.id] = {
        name: p.name,
        individualSubtotal: 0,
        sharedItemContribution: 0,
        subtotalBeforeProportion: 0, // รายการส่วนตัว + รายการที่แชร์
        proportionalShipping: 0,
        proportionalDiscount: 0,
        proportionalServiceCharge: 0,
        proportionalVat: 0,
        totalPay: 0,
      };

      // คำนวณยอดรวมย่อยของรายการส่วนตัว
      p.items.forEach(item => {
        calculation[p.id].individualSubtotal += item.price;
      });
    });

    // คำนวณส่วนที่แต่ละคนต้องจ่ายสำหรับรายการที่แชร์
    sharedItems.forEach(sItem => {
      if (sItem.sharers.length > 0) {
        const perSharerCost = sItem.price / sItem.sharers.length;
        sItem.sharers.forEach(sharerId => {
          if (calculation[sharerId]) { // ตรวจสอบให้แน่ใจว่าผู้แชร์มีอยู่ในรายชื่อคนปัจจุบัน
            calculation[sharerId].sharedItemContribution += perSharerCost;
          }
        });
      }
    });

    // คำนวณยอดรวมย่อยก่อนการแบ่งสัดส่วนสำหรับแต่ละคนและยอดรวมทั้งหมด
    people.forEach(p => {
      calculation[p.id].subtotalBeforeProportion =
        calculation[p.id].individualSubtotal + calculation[p.id].sharedItemContribution;
      totalOverallSubtotal += calculation[p.id].subtotalBeforeProportion;
    });

    // แบ่งค่าส่งและส่วนลดตามสัดส่วน
    people.forEach(p => {
      if (totalOverallSubtotal > 0) { // หลีกเลี่ยงการหารด้วยศูนย์หากไม่มีรายการสั่งซื้อ
        const proportion = calculation[p.id].subtotalBeforeProportion / totalOverallSubtotal;
        calculation[p.id].proportionalShipping = shippingCost * proportion;
        calculation[p.id].proportionalDiscount = discount * proportion;
      } else {
        // หากยอดรวมทั้งหมดเป็น 0 ค่าส่ง/ส่วนลดก็จะเป็น 0 สำหรับแต่ละคน
        calculation[p.id].proportionalShipping = 0;
        calculation[p.id].proportionalDiscount = 0;
      }

      // คำนวณยอดที่ต้องจ่ายสุดท้าย
      let subtotalForTaxes = calculation[p.id].subtotalBeforeProportion;

      if (serviceChargeEnabled) {
        calculation[p.id].proportionalServiceCharge = subtotalForTaxes * (serviceChargePercentage / 100);
        subtotalForTaxes += calculation[p.id].proportionalServiceCharge;
      }

      if (vatEnabled) {
        calculation[p.id].proportionalVat = subtotalForTaxes * 0.07; // 7% VAT
      }

      calculation[p.id].totalPay =
        calculation[p.id].subtotalBeforeProportion +
        calculation[p.id].proportionalShipping -
        calculation[p.id].proportionalDiscount +
        calculation[p.id].proportionalServiceCharge +
        calculation[p.id].proportionalVat;

      if (roundUpEnabled) {
        calculation[p.id].totalPay = Math.ceil(calculation[p.id].totalPay);
      }
    });

    return calculation;
  };

  const calculatedResults = calculateTotals();

  // ส่วนประกอบช่วยในการเรนเดอร์การ์ดส่วน
  const SectionCard = ({ title, icon, description, children, bgColor, borderColor, textColor }) => (
    <section className={`mb-8 p-6 ${bgColor} rounded-2xl shadow-lg border ${borderColor}`}>
      <h2 className={`text-3xl font-extrabold ${textColor || 'text-gray-100'} mb-3 flex items-center`}>
        {icon}
        {title}
      </h2>
      {description && <p className="text-gray-400 mb-4 text-md">{description}</p>}
      {children}
    </section>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 sm:p-6 font-inter text-gray-100 relative">
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="fixed bottom-6 right-6 bg-gray-700 p-4 rounded-full shadow-lg text-white hover:bg-gray-600 transition-all duration-300 z-50 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.74-1.71-.98l-.37-2.65C14.06 2.18 13.64 2 13.12 2h-2.24c-.52 0-.94.18-1.01.64l-.37 2.65c-.62.24-1.19.58-1.71.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.74 1.71.98l.37 2.65c.07.46.49.64 1.01.64h2.24c.52 0 .94-.18 1.01-.64l.37-2.65c.62-.24 1.19-.58 1.71-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
      </button>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 z-50 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-white mb-4 border-b pb-2 border-gray-700">ตั้งค่า</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300 text-lg font-medium">ปัดขึ้นหรือไม่?</span>
            <label htmlFor="roundUpToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="roundUpToggle"
                className="sr-only peer"
                checked={roundUpEnabled}
                onChange={() => setRoundUpEnabled(!roundUpEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-500"></div>
            </label>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 active:scale-95"
          >
            ปิด
          </button>
        </div>
      )}
      {/* ปรับให้ container หลักเป็น fluid มากขึ้น */}
      <div className="bg-gray-900 p-6 sm:p-10 lg:p-12 rounded-3xl shadow-2xl w-full max-w-full md:max-w-6xl xl:max-w-screen-xl border border-gray-700 mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-white mb-10 tracking-tight leading-tight">
          🍽️ แบ่งบิลค่าอาหารกลางวัน
        </h1>

        {/* Personal Orders Section */}
        <SectionCard
          title="รายการสั่งซื้อส่วนตัว"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 16H7v-2h2v2zm0-4H7V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>}
          description="ป้อนรายการที่แต่ละคนสั่งเอง"
          bgColor="bg-gray-800"
          borderColor="border-blue-800"
        >
          {people.length === 0 ? (
            <p className="text-gray-400 italic">กรุณาเพิ่มคนก่อนเพื่อกำหนดรายการสั่งซื้อส่วนตัว</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {people.map(p => (
                <PersonOrderInput
                  key={p.id}
                  person={p}
                  addItem={addItemToPerson}
                  removeItem={removeItemFromPerson}
                />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Shared Items and Additional Costs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard
            title="รายการที่แชร์"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>}
            description="เพิ่มรายการเช่น ของกินเล่นหรือเครื่องดื่มที่หลายคนแชร์กัน"
            bgColor="bg-gray-800"
            borderColor="border-green-800"
          >
            {people.length < 1 ? (
              <p className="text-gray-400 italic">กรุณาเพิ่มคนอย่างน้อยหนึ่งคนเพื่อเพิ่มรายการที่แชร์</p>
            ) : (
              <SharedItemInput
                people={people}
                addSharedItem={addSharedItem}
                sharedItems={sharedItems}
                removeSharedItem={removeSharedItem}
              />
            )}
          </SectionCard>

          <SectionCard
            title="ค่าใช้จ่ายเพิ่มเติม / ส่วนลด"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>}
            description="ป้อนค่าส่งและส่วนลดโดยรวม"
            bgColor="bg-gray-800"
            borderColor="border-yellow-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shipping" className="block text-gray-300 text-lg font-medium mb-2">ค่าส่ง (฿):</label>
                <input
                  id="shipping"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor="discount" className="block text-gray-300 text-lg font-medium mb-2">จำนวนส่วนลด (฿):</label>
                <input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-xl border border-gray-600">
                  <span className="text-gray-300 text-lg font-medium">มี Service Charge</span>
                  <label htmlFor="serviceChargeToggle" className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="serviceChargeToggle"
                      className="sr-only peer"
                      checked={serviceChargeEnabled}
                      onChange={() => setServiceChargeEnabled(!serviceChargeEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
                {serviceChargeEnabled && (
                  <div>
                    <label htmlFor="serviceChargePercentage" className="block text-gray-300 text-lg font-medium mb-2">เปอร์เซ็นต์ Service Charge (%):</label>
                    <input
                      id="serviceChargePercentage"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                      value={serviceChargePercentage}
                      onChange={(e) => setServiceChargePercentage(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-xl border border-gray-600">
                  <span className="text-gray-300 text-lg font-medium">มี VAT 7%</span>
                  <label htmlFor="vatToggle" className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="vatToggle"
                      className="sr-only peer"
                      checked={vatEnabled}
                      onChange={() => setVatEnabled(!vatEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Final Bill Summary Section */}
        <SectionCard
          title="สรุปบิลสุดท้าย"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-indigo-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/></svg>}
          description="ดูว่าแต่ละคนต้องจ่ายเท่าไหร่หลังจากการคำนวณทั้งหมด"
          bgColor="bg-gray-800"
          borderColor="border-indigo-800"
        >
          {people.length === 0 ? (
            <p className="text-gray-400 italic">เพิ่มคนและรายการสั่งซื้อเพื่อดูสรุป</p>
          ) : (
            <>
              {/* Quick Summary Table */}
              <div id="quickResult" className="mb-8 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto">
                <div ref={summaryCardRef} id="quickResult">
                  <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-700">
                    <h3 className="text-2xl font-bold text-white">ยอดรวมด่วน</h3>
                    <button
                      onClick={handleDownloadImage}
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 active:scale-95 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                      </svg>
                      Save as Image
                    </button>
                  </div>
                  <table className="w-full text-left text-gray-300">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="py-3 px-4 font-semibold text-lg">ชื่อ</th>
                        <th className="py-3 px-4 text-right font-semibold text-lg">ยอดที่ต้องชำระ (฿)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(calculatedResults).map((result, index) => (
                      <tr key={result.name} className={`border-b border-gray-800 last:border-b-0 transition-colors ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
                          <td className="py-2 px-4">{result.name}</td>
                          <td className="py-2 px-4 text-right font-semibold text-xl text-white">{result.totalPay.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(calculatedResults).map(result => (
                  <div key={result.name} className="p-5 bg-gray-900 rounded-xl shadow-md border border-indigo-900 transform hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                    <h3 className="text-2xl font-bold text-white mb-3 border-b pb-2 border-indigo-800">{result.name}</h3>
                    <ul className="text-gray-300 text-base space-y-2 mb-3">
                      <li><span className="font-semibold">รายการสั่งซื้อส่วนตัว:</span> <span className="float-right">฿{result.individualSubtotal.toFixed(2)}</span></li>
                      <li><span className="font-semibold">รายการที่แชร์:</span> <span className="float-right">฿{result.sharedItemContribution.toFixed(2)}</span></li>
                      <li className="font-bold text-gray-200 border-t pt-2 mt-2 border-gray-700"><span className="font-semibold">ยอดรวมย่อย:</span> <span className="float-right">฿{result.subtotalBeforeProportion.toFixed(2)}</span></li>
                      <li className="text-red-400"><span className="font-semibold">ส่วนลดตามสัดส่วน:</span> <span className="float-right">- ฿{result.proportionalDiscount.toFixed(2)}</span></li>
                      <li className="text-green-400"><span className="font-semibold">ค่าส่งตามสัดส่วน:</span> <span className="float-right">+ ฿{result.proportionalShipping.toFixed(2)}</span></li>
                      {serviceChargeEnabled && (
                        <li className="text-yellow-400"><span className="font-semibold">Service Charge ({serviceChargePercentage}%):</span> <span className="float-right">+ ฿{result.proportionalServiceCharge.toFixed(2)}</span></li>
                      )}
                      {vatEnabled && (
                        <li className="text-orange-400"><span className="font-semibold">VAT (7%):</span> <span className="float-right">+ ฿{result.proportionalVat.toFixed(2)}</span></li>
                      )}
                    </ul>
                    <p className="mt-4 text-xl font-extrabold text-indigo-400 bg-indigo-900 p-3 rounded-lg flex justify-between items-center">
                      <span>ยอดที่ต้องชำระทั้งหมด:</span>
                      <span className="text-3xl">฿{result.totalPay.toFixed(2)}</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>

        {/* Who's Eating Section */}
        <SectionCard
          title="ใครกินบ้าง?"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.88 6-3.88s5.97 1.89 6 3.88c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>}
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
              onKeyPress={(e) => { if (e.key === 'Enter') addPerson(); }}
            />
            <button
              onClick={addPerson}
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
      </div>
    </div>
  );
}

// ส่วนประกอบสำหรับเพิ่มและจัดการรายการสั่งซื้อส่วนตัวของแต่ละคน
function PersonOrderInput({ person, addItem, removeItem }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    addItem(person.id, itemName, itemPrice);
    setItemName('');
    setItemPrice('');
  };

  return (
    <div className="mb-4 p-4 border border-blue-900 rounded-xl bg-gray-900 shadow-sm">
      <h3 className="text-xl font-bold text-blue-300 mb-3">{person.name}</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ชื่อรายการ (ไม่บังคับ)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full sm:w-28 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ราคา (฿)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onBlur={handleAddItem}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddItem(); }}
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md active:scale-95"
        >
          เพิ่มรายการ
        </button>
      </div>
      {person.items.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 mt-4 border-t border-gray-700 pt-3">
          {person.items.map(item => (
            <li key={item.id} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-700">
              <span className="font-medium">{item.name || 'รายการที่ไม่มีชื่อ'}</span> {/* แสดง 'รายการที่ไม่มีชื่อ' หากชื่อว่างเปล่า */}
              <span className="flex items-center">
                ฿{item.price.toFixed(2)}
                <button
                  onClick={() => removeItem(person.id, item.id)}
                  className="ml-3 text-blue-400 hover:text-blue-200 transition-colors duration-200"
                  aria-label={`ลบ ${item.name || 'รายการ'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ส่วนประกอบสำหรับเพิ่มและจัดการรายการที่แชร์
function SharedItemInput({ people, addSharedItem, sharedItems, removeSharedItem }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedSharers, setSelectedSharers] = useState([]);

  const handleAddSharedItem = () => {
    addSharedItem(itemName, itemPrice, selectedSharers);
    setItemName('');
    setItemPrice('');
    setSelectedSharers([]);
  };

  const handleSharerToggle = (personId) => {
    if (selectedSharers.includes(personId)) {
      setSelectedSharers(selectedSharers.filter(id => id !== personId));
    } else {
      setSelectedSharers([...selectedSharers, personId]);
    }
  };

  return (
    <div className="p-4 border border-green-900 rounded-xl bg-gray-900 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ชื่อรายการที่แชร์ (ไม่บังคับ)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full sm:w-28 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
          placeholder="ราคา (฿)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onBlur={handleAddSharedItem}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddSharedItem(); }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-lg font-medium mb-2">ใครแชร์รายการนี้บ้าง?</label>
        <div className="flex flex-wrap gap-2">
          {people.map(p => (
            <button
              key={p.id}
              onClick={() => handleSharerToggle(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-md transform hover:scale-105 active:scale-95
                ${selectedSharers.includes(p.id) ? 'bg-green-600 text-white' : 'bg-green-800 text-green-100 hover:bg-green-700'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleAddSharedItem}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-md w-full active:scale-95"
      >
        เพิ่มรายการที่แชร์
      </button>

      {sharedItems.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h4 className="text-lg font-semibold text-green-300 mb-2">รายการที่แชร์ปัจจุบัน:</h4>
          <ul className="space-y-2 text-gray-300">
            {sharedItems.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-700">
                <span className="font-medium">
                  {item.name || 'รายการที่ไม่มีชื่อ'} - ฿{item.price.toFixed(2)} (แชร์โดย: {item.sharers.map(id => people.find(p => p.id === id)?.name).join(', ')})
                </span>
                <button
                  onClick={() => removeSharedItem(item.id)}
                  className="ml-3 text-green-400 hover:text-green-200 transition-colors duration-200"
                  aria-label={`ลบ ${item.name || 'รายการ'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;