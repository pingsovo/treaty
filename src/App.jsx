
import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import People from './components/People';
import PersonalOrders from './components/PersonalOrders';
import SharedItems from './components/SharedItems';
import Costs from './components/Costs';
import Summary from './components/Summary';
import Settings from './components/Settings';
import ShortSummaryCard from './components/ShortSummaryCard';
import HelpGuide from './components/HelpGuide';

// Main App Component
function App() {
  // State for managing people, orders, shared items, shipping, and discount
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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [roundUpEnabled, setRoundUpEnabled] = useState(false);
  const [treatedPeopleIds, setTreatedPeopleIds] = useState([]);
  const [treatSharingMode, setTreatSharingMode] = useState('active_only'); // 'active_only' | 'all'

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

      htmlToImage.toPng(element, {
        backgroundColor: '#111827',
        quality: 1.0,
        pixelRatio: 2,
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

  // Function to add a new person
  const addPerson = (newPersonName) => {
    if (newPersonName.trim() !== '') {
      setPeople([...people, { id: Date.now().toString(), name: newPersonName.trim(), items: [] }]);
    }
  };

  // Function to remove a person
  const removePerson = (personId) => {
    setPeople(prevPeople => prevPeople.filter(p => p.id !== personId));
    // Also remove them from any shared items they were part of
    setSharedItems(prevSharedItems => prevSharedItems.map(item => ({
      ...item,
      sharers: item.sharers.filter(sharerId => sharerId !== personId)
    })));
    // Also remove from treated list if present
    setTreatedPeopleIds(prevIds => prevIds.filter(id => id !== personId));
  };

  // Function to add an item to a person
  const addItemToPerson = (personId, itemName, itemPrice) => {
    // Item name can be empty, but price must be a non-negative number
    if (!isNaN(itemPrice) && parseFloat(itemPrice) >= 0) {
      setPeople(prevPeople => prevPeople.map(p =>
        p.id === personId
          ? { ...p, items: [...p.items, { id: Date.now().toString(), name: itemName.trim(), price: parseFloat(itemPrice) }] }
          : p
      ));
    }
  };

  // Function to remove an item from a person
  const removeItemFromPerson = (personId, itemId) => {
    setPeople(prevPeople => prevPeople.map(p =>
      p.id === personId
        ? { ...p, items: p.items.filter(item => item.id !== itemId) }
        : p
    ));
  };

  // Function to add a shared item
  const addSharedItem = (itemName, itemPrice, sharerIds) => {
    // Item name can be empty, but price must be a non-negative number and at least one sharer must be selected
    if (!isNaN(itemPrice) && parseFloat(itemPrice) >= 0 && sharerIds.length > 0) {
      setSharedItems(prevSharedItems => [...prevSharedItems, { id: Date.now().toString(), name: itemName.trim(), price: parseFloat(itemPrice), sharers: sharerIds }]);
    }
  };

  // Function to remove a shared item
  const removeSharedItem = (sharedItemId) => {
    setSharedItems(prevSharedItems => prevSharedItems.filter(item => item.id !== sharedItemId));
  };

  // --- Calculation Logic ---
  const calculatedResults = React.useMemo(() => {
    const calculation = {};
    let totalOverallSubtotal = 0; // Total of all personal and shared items

    // Initialize calculation for each person
    people.forEach(p => {
      calculation[p.id] = {
        name: p.name,
        individualSubtotal: 0,
        sharedItemContribution: 0,
        subtotalBeforeProportion: 0, // Personal items + shared items
        proportionalShipping: 0,
        proportionalDiscount: 0,
        proportionalServiceCharge: 0,
        proportionalVat: 0,
        totalPay: 0,
      };

      // Calculate subtotal for personal items
      p.items.forEach(item => {
        calculation[p.id].individualSubtotal += item.price;
      });
    });

    // Calculate each person's share of shared items
    sharedItems.forEach(sItem => {
      if (sItem.sharers.length > 0) {
        const perSharerCost = sItem.price / sItem.sharers.length;
        sItem.sharers.forEach(sharerId => {
          if (calculation[sharerId]) { // Ensure the sharer is still in the current list of people
            calculation[sharerId].sharedItemContribution += perSharerCost;
          }
        });
      }
    });

    // Calculate subtotal before proportion for each person and the total overall subtotal
    people.forEach(p => {
      calculation[p.id].subtotalBeforeProportion =
        calculation[p.id].individualSubtotal + calculation[p.id].sharedItemContribution;
      totalOverallSubtotal += calculation[p.id].subtotalBeforeProportion;
    });

    // Proportionally distribute shipping and discount
    people.forEach(p => {
      if (totalOverallSubtotal > 0) { // Avoid division by zero if there are no orders
        const proportion = calculation[p.id].subtotalBeforeProportion / totalOverallSubtotal;
        calculation[p.id].proportionalShipping = shippingCost * proportion;
        calculation[p.id].proportionalDiscount = discount * proportion;
      } else {
        // If total is 0, shipping/discount is 0 for everyone
        calculation[p.id].proportionalShipping = 0;
        calculation[p.id].proportionalDiscount = 0;
      }

      // Calculate final payment
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
    });

    // --- TREAT MODE LOGIC ---
    // If there are treated people, distribute their costs to the non-treated people
    const treatedPeopleIdsSet = new Set(treatedPeopleIds);
    let payingPeopleIds = people.filter(p => !treatedPeopleIdsSet.has(p.id)).map(p => p.id);

    // Initialize treat tracking
    people.forEach(p => {
      calculation[p.id].treatContribution = 0;
      calculation[p.id].treatReceived = 0;
    });

    if (treatedPeopleIds.length > 0 && payingPeopleIds.length > 0) {
      let totalTreatPool = 0;

      // Collect debt from treated people
      treatedPeopleIds.forEach(id => {
        if (calculation[id]) {
          const treatAmount = calculation[id].totalPay;
          totalTreatPool += treatAmount;
          calculation[id].treatReceived = treatAmount; // Record received amount
          calculation[id].totalPay = 0; // Treated person pays nothing
        }
      });

      // Distribute debt to paying people
      // Filter paying people based on mode
      if (treatSharingMode === 'active_only') {
        payingPeopleIds = payingPeopleIds.filter(id => calculation[id] && calculation[id].totalPay > 0);
      }

      if (payingPeopleIds.length > 0) {
        const perPayerShare = totalTreatPool / payingPeopleIds.length;
        payingPeopleIds.forEach(id => {
          if (calculation[id]) {
            calculation[id].treatContribution = perPayerShare; // Record contribution
            calculation[id].totalPay += perPayerShare;
          }
        });
      } else if (treatedPeopleIds.length < people.length) {
        // Edge case: Treated people exist, but no one else has > 0 cost to share it (in active_only mode)
        // Fallback to "All non-treated"
        const allRemainingIds = people.filter(p => !treatedPeopleIdsSet.has(p.id)).map(p => p.id);
        if (allRemainingIds.length > 0) {
          const fallbackShare = totalTreatPool / allRemainingIds.length;
          allRemainingIds.forEach(id => {
            if (calculation[id]) {
              calculation[id].treatContribution = fallbackShare; // Record contribution
              calculation[id].totalPay += fallbackShare;
            }
          });
        }
      }
    }

    // Apply Round Up LAST (after treat redistribution)
    if (roundUpEnabled) {
      people.forEach(p => {
        calculation[p.id].totalPay = Math.ceil(calculation[p.id].totalPay);
      });
    }

    return calculation;
  }, [people, sharedItems, shippingCost, discount, serviceChargeEnabled, serviceChargePercentage, vatEnabled, roundUpEnabled, treatedPeopleIds, treatSharingMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-2 sm:p-6 font-inter text-gray-100 relative">
      {/* Floating Settings Button */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-4">
        <button
          onClick={() => setIsHelpOpen(true)}
          className="bg-blue-600 p-3 sm:p-4 rounded-full shadow-lg text-white hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="bg-gray-700 p-3 sm:p-4 rounded-full shadow-lg text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.74-1.71-.98l-.37-2.65C14.06 2.18 13.64 2 13.12 2h-2.24c-.52 0-.94.18-1.01.64l-.37 2.65c-.62.24-1.19.58-1.71.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l-2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.74 1.71.98l.37 2.65c.07.46.49.64 1.01.64h2.24c.52 0 .94-.18 1.01-.64l.37-2.65c.62-.24 1.19-.58 1.71-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c-.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
          </svg>
        </button>
      </div>
      <Settings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        roundUpEnabled={roundUpEnabled}
        setRoundUpEnabled={setRoundUpEnabled}
      />
      <HelpGuide isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      {/* Make the main container more fluid */}
      <div className="bg-gray-900 p-4 sm:p-10 lg:p-12 rounded-3xl shadow-2xl w-full max-w-full md:max-w-6xl xl:max-w-screen-xl border border-gray-700 mx-auto">
        <h1 className="text-3xl sm:text-6xl font-extrabold text-center text-white mb-6 sm:mb-10 tracking-tight leading-tight">
          🍽️ แบ่งบิลค่าอาหารกลางวัน
        </h1>

        <PersonalOrders
          people={people}
          addItemToPerson={addItemToPerson}
          removeItemFromPerson={removeItemFromPerson}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SharedItems
            people={people}
            addSharedItem={addSharedItem}
            sharedItems={sharedItems}
            removeSharedItem={removeSharedItem}
          />

          <Costs
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
            discount={discount}
            setDiscount={setDiscount}
            serviceChargeEnabled={serviceChargeEnabled}
            setServiceChargeEnabled={setServiceChargeEnabled}
            serviceChargePercentage={serviceChargePercentage}
            setServiceChargePercentage={setServiceChargePercentage}
            vatEnabled={vatEnabled}
            setVatEnabled={setVatEnabled}
            people={people}
            treatedPeopleIds={treatedPeopleIds}
            setTreatedPeopleIds={setTreatedPeopleIds}
            treatSharingMode={treatSharingMode}
            setTreatSharingMode={setTreatSharingMode}
          />
        </div>

        <ShortSummaryCard
          people={people}
          calculatedResults={calculatedResults}
          handleDownloadImage={handleDownloadImage}
          summaryCardRef={summaryCardRef}
        />

        <Summary
          people={people}
          calculatedResults={calculatedResults}
          serviceChargeEnabled={serviceChargeEnabled}
          serviceChargePercentage={serviceChargePercentage}
          vatEnabled={vatEnabled}
        />

        <People
          people={people}
          addPerson={addPerson}
          removePerson={removePerson}
        />
      </div>
    </div>
  );
}

export default App;
