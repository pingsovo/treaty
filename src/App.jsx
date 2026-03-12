
import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import Cookies from 'js-cookie';
import People from './components/People';
import PersonalOrders from './components/PersonalOrders';
import SharedItems from './components/SharedItems';
import Costs from './components/Costs';
import Summary from './components/Summary';
import Settings from './components/Settings';
import ShortSummaryCard from './components/ShortSummaryCard';
import HelpGuide from './components/HelpGuide';
import SessionManager from './components/SessionManager';
import MultiSessionSummary from './components/MultiSessionSummary';
import Refunds from './components/Refunds';
import HistoryPanel from './components/HistoryPanel';

// ---- Constants ----
const SESSIONS_COOKIE = 'treaty_sessions';
const ACTIVE_SESSION_COOKIE = 'treaty_active_session';
const HISTORY_COOKIE = 'treaty_history';
const COOKIE_OPTS = { expires: 30 }; // 30-day history

const DEFAULT_PEOPLE = [
  { id: 'ping', name: 'ปิง', items: [] },
  { id: 'ou', name: 'อู๋', items: [] },
  { id: 'mudmee', name: 'มัดหมี่', items: [] },
  { id: 'gugg', name: 'กั๊ก', items: [] },
  { id: 'do', name: 'โด้', items: [] },
  { id: 'dew', name: 'ดิว', items: [] },
  { id: 'taw', name: 'ตาว', items: [] },
];

const createSession = (name = 'Session 1', people = DEFAULT_PEOPLE) => ({
  id: Date.now().toString(),
  name,
  people,
  sharedItems: [],
  shippingCost: 0,
  discount: 0,
  serviceChargeEnabled: false,
  serviceChargePercentage: 10,
  vatEnabled: false,
  treatedPeopleIds: [],
  treatSharingMode: 'active_only',
  refunds: [],
});

// ---- Load from Cookie ----
const loadSavedSessions = () => {
  try {
    const raw = Cookies.get(SESSIONS_COOKIE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return null;
};

// ---- Calculation Logic ----
function calculateSession(session, roundUpEnabled) {
  const { people, sharedItems, shippingCost, discount, serviceChargeEnabled, serviceChargePercentage, vatEnabled, treatedPeopleIds, treatSharingMode, refunds = [] } = session;
  const calculation = {};
  let totalOverallSubtotal = 0;

  people.forEach((p) => {
    calculation[p.id] = {
      name: p.name,
      individualSubtotal: 0,
      sharedItemContribution: 0,
      subtotalBeforeProportion: 0,
      proportionalShipping: 0,
      proportionalDiscount: 0,
      proportionalServiceCharge: 0,
      proportionalVat: 0,
      totalPay: 0,
      treatContribution: 0,
      treatReceived: 0,
      refundDeduction: 0,
    };
    p.items.forEach((item) => { calculation[p.id].individualSubtotal += item.price; });
  });

  sharedItems.forEach((sItem) => {
    if (sItem.sharers.length > 0) {
      const perSharerCost = sItem.price / sItem.sharers.length;
      sItem.sharers.forEach((sharerId) => {
        if (calculation[sharerId]) calculation[sharerId].sharedItemContribution += perSharerCost;
      });
    }
  });

  // Calculate refunds per person
  let totalLeftoverRefund = 0;
  refunds.forEach((refund) => {
    if (calculation[refund.personId]) {
      calculation[refund.personId].refundDeduction += refund.amount;
    }
  });

  people.forEach((p) => {
    const grossSubtotal = calculation[p.id].individualSubtotal + calculation[p.id].sharedItemContribution;
    const deduction = calculation[p.id].refundDeduction || 0;
    const netSubtotal = grossSubtotal - deduction;
    
    // If refund is larger than subtotal, the remainder acts as an additional discount for the group
    if (netSubtotal < 0) {
      calculation[p.id].subtotalBeforeProportion = 0;
      totalLeftoverRefund += Math.abs(netSubtotal);
    } else {
      calculation[p.id].subtotalBeforeProportion = netSubtotal;
    }
    
    totalOverallSubtotal += calculation[p.id].subtotalBeforeProportion;
  });

  const effectiveDiscount = discount + totalLeftoverRefund;

  people.forEach((p) => {
    if (totalOverallSubtotal > 0) {
      const proportion = calculation[p.id].subtotalBeforeProportion / totalOverallSubtotal;
      calculation[p.id].proportionalShipping = shippingCost * proportion;
      calculation[p.id].proportionalDiscount = effectiveDiscount * proportion;
    }
    let subtotalForTaxes = calculation[p.id].subtotalBeforeProportion;
    if (serviceChargeEnabled) {
      calculation[p.id].proportionalServiceCharge = subtotalForTaxes * (serviceChargePercentage / 100);
      subtotalForTaxes += calculation[p.id].proportionalServiceCharge;
    }
    if (vatEnabled) {
      calculation[p.id].proportionalVat = subtotalForTaxes * 0.07;
    }
    calculation[p.id].totalPay =
      calculation[p.id].subtotalBeforeProportion +
      calculation[p.id].proportionalShipping -
      calculation[p.id].proportionalDiscount +
      calculation[p.id].proportionalServiceCharge +
      calculation[p.id].proportionalVat;
  });

  // Treat Mode
  const treatedSet = new Set(treatedPeopleIds);
  let payingIds = people.filter((p) => !treatedSet.has(p.id)).map((p) => p.id);

  if (treatedPeopleIds.length > 0 && payingIds.length > 0) {
    let pool = 0;
    treatedPeopleIds.forEach((id) => {
      if (calculation[id]) {
        pool += calculation[id].totalPay;
        calculation[id].treatReceived = calculation[id].totalPay;
        calculation[id].totalPay = 0;
      }
    });

    if (treatSharingMode === 'active_only') {
      payingIds = payingIds.filter((id) => calculation[id] && calculation[id].totalPay > 0);
    }

    const targetIds = payingIds.length > 0 ? payingIds : people.filter((p) => !treatedSet.has(p.id)).map((p) => p.id);
    if (targetIds.length > 0) {
      const share = pool / targetIds.length;
      targetIds.forEach((id) => {
        if (calculation[id]) { calculation[id].treatContribution = share; calculation[id].totalPay += share; }
      });
    }
  }

  // Removed obsolete global proportional refund deduction logic

  people.forEach((p) => { if (calculation[p.id].totalPay < 0) calculation[p.id].totalPay = 0; });

  if (roundUpEnabled) {
    people.forEach((p) => { calculation[p.id].totalPay = Math.ceil(calculation[p.id].totalPay); });
  }

  return calculation;
}

// ---- Session updater helper ----
const updateSession = (sessions, id, updater) =>
  sessions.map((s) => (s.id === id ? { ...s, ...updater(s) } : s));

// ---- Main App ----
function App() {
  const saved = loadSavedSessions();
  const [sessions, setSessions] = useState(saved || [createSession('Session 1')]);
  const [activeSessionId, setActiveSessionId] = useState(
    Cookies.get(ACTIVE_SESSION_COOKIE) || (saved ? saved[0]?.id : null) || sessions[0].id
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [roundUpEnabled, setRoundUpEnabled] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // ---- Typography Scale ----
  const [baseFontSize, setBaseFontSize] = useState(
    Number(Cookies.get('treaty_font_size')) || 16
  );

  useEffect(() => {
    Cookies.set('treaty_font_size', baseFontSize, COOKIE_OPTS);
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  // ---- Component Visibility Toggles ----
  const [showSharedItems, setShowSharedItems] = useState(Cookies.get('treaty_show_shared') === 'true');
  const [showRefunds, setShowRefunds] = useState(Cookies.get('treaty_show_refunds') === 'true');
  const [showShortSummary, setShowShortSummary] = useState(Cookies.get('treaty_show_short_summary') !== 'false');
  const [showFinalSummary, setShowFinalSummary] = useState(Cookies.get('treaty_show_final_summary') === 'true');

  useEffect(() => { Cookies.set('treaty_show_shared', showSharedItems, COOKIE_OPTS); }, [showSharedItems]);
  useEffect(() => { Cookies.set('treaty_show_refunds', showRefunds, COOKIE_OPTS); }, [showRefunds]);
  useEffect(() => { Cookies.set('treaty_show_short_summary', showShortSummary, COOKIE_OPTS); }, [showShortSummary]);
  useEffect(() => { Cookies.set('treaty_show_final_summary', showFinalSummary, COOKIE_OPTS); }, [showFinalSummary]);

  // ---- History ----
  const loadHistory = () => {
    try {
      const raw = Cookies.get(HISTORY_COOKIE);
      if (raw) return JSON.parse(raw);
    } catch { /**/ }
    return [];
  };
  const [history, setHistory] = useState(loadHistory);

  const persistHistory = (h) => {
    try { Cookies.set(HISTORY_COOKIE, JSON.stringify(h), COOKIE_OPTS); } catch { /**/ }
  };

  const saveToHistory = () => {
    const results = Object.values(calculatedResults).map(({ name, totalPay }) => ({ name, totalPay }));
    const grandTotal = results.reduce((s, r) => s + r.totalPay, 0);
    const now = new Date();
    const entry = {
      id: Date.now().toString(),
      savedAt: now.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }),
      sessionName: activeSession.name,
      results,
      grandTotal,
    };
    const next = [...history, entry];
    setHistory(next);
    persistHistory(next);
    alert(`บันทึกประวัติ "${activeSession.name}" แล้ว!`);
  };

  const deleteHistoryEntry = (id) => {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    persistHistory(next);
  };

  const clearHistory = () => {
    setHistory([]);
    Cookies.remove(HISTORY_COOKIE);
  };

  const summaryCardRef = useRef(null);

  // ---- Persist sessions to cookie on every change ----
  useEffect(() => {
    try {
      Cookies.set(SESSIONS_COOKIE, JSON.stringify(sessions), COOKIE_OPTS);
    } catch { /* ignore quota errors */ }
  }, [sessions]);

  useEffect(() => {
    Cookies.set(ACTIVE_SESSION_COOKIE, activeSessionId, COOKIE_OPTS);
  }, [activeSessionId]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // ---- Session CRUD ----
  const addSession = () => {
    const count = sessions.length + 1;
    const newSession = createSession(`Session ${count}`, []);
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  const removeSession = (id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeSessionId === id && next.length > 0) setActiveSessionId(next[0].id);
      return next;
    });
  };

  const resetAll = () => {
    const fresh = [createSession('Session 1')];
    setSessions(fresh);
    setActiveSessionId(fresh[0].id);
    Cookies.remove(SESSIONS_COOKIE);
    Cookies.remove(ACTIVE_SESSION_COOKIE);
    setShowResetConfirm(false);
  };

  // ---- Setters scoped to active session ----
  const update = (field) => (value) =>
    setSessions((prev) => updateSession(prev, activeSessionId, () => ({ [field]: value })));

  const setShippingCost = update('shippingCost');
  const setDiscount = update('discount');
  const setServiceChargeEnabled = update('serviceChargeEnabled');
  const setServiceChargePercentage = update('serviceChargePercentage');
  const setVatEnabled = update('vatEnabled');
  const setTreatedPeopleIds = update('treatedPeopleIds');
  const setTreatSharingMode = update('treatSharingMode');

  // ---- Refund ops ----
  const addRefund = ({ personId, personName, itemNote, amount, mode }) => {
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        refunds: [...(s.refunds || []), { id: Date.now().toString(), personId, personName, itemNote, amount, mode }],
      }))
    );
  };

  const removeRefund = (refundId) => {
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        refunds: (s.refunds || []).filter((r) => r.id !== refundId),
      }))
    );
  };

  // ---- People ops ----
  const addPerson = (name) => {
    if (!name.trim()) return;
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        people: [...s.people, { id: Date.now().toString(), name: name.trim(), items: [] }],
      }))
    );
  };

  const removePerson = (personId) => {
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        people: s.people.filter((p) => p.id !== personId),
        sharedItems: s.sharedItems.map((item) => ({
          ...item,
          sharers: item.sharers.filter((id) => id !== personId),
        })),
        treatedPeopleIds: s.treatedPeopleIds.filter((id) => id !== personId),
      }))
    );
  };

  const addItemToPerson = (personId, itemName, itemPrice) => {
    if (isNaN(itemPrice) || parseFloat(itemPrice) < 0) return;
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        people: s.people.map((p) =>
          p.id === personId
            ? { ...p, items: [...p.items, { id: Date.now().toString(), name: itemName.trim(), price: parseFloat(itemPrice) }] }
            : p
        ),
      }))
    );
  };

  const removeItemFromPerson = (personId, itemId) => {
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        people: s.people.map((p) =>
          p.id === personId ? { ...p, items: p.items.filter((item) => item.id !== itemId) } : p
        ),
      }))
    );
  };

  // ---- Shared items ----
  const addSharedItem = (itemName, itemPrice, sharerIds) => {
    if (isNaN(itemPrice) || parseFloat(itemPrice) < 0 || sharerIds.length === 0) return;
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        sharedItems: [...s.sharedItems, { id: Date.now().toString(), name: itemName.trim(), price: parseFloat(itemPrice), sharers: sharerIds }],
      }))
    );
  };

  const removeSharedItem = (id) => {
    setSessions((prev) =>
      updateSession(prev, activeSessionId, (s) => ({
        sharedItems: s.sharedItems.filter((item) => item.id !== id),
      }))
    );
  };

  // ---- Calculations ----
  const calculatedResults = React.useMemo(
    () => calculateSession(activeSession, roundUpEnabled),
    [activeSession, roundUpEnabled]
  );

  const allSessionResults = React.useMemo(
    () => sessions.map((s) => ({ sessionName: s.name, calculatedResults: calculateSession(s, roundUpEnabled) })),
    [sessions, roundUpEnabled]
  );

  // ---- Download image ----
  const handleDownloadImage = () => {
    const el = summaryCardRef.current;
    if (!el) return;
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    htmlToImage
      .toPng(el, { backgroundColor: '#000000', quality: 1.0, pixelRatio: 2 })
      .then((dataUrl) => { const a = document.createElement('a'); a.download = `${ts}.png`; a.href = dataUrl; a.click(); })
      .catch((err) => console.error('Could not save image', err));
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center p-0 sm:p-6 font-inter text-[#EBEBF5] relative">
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-5 z-50 flex gap-3">
        <button onClick={() => setIsHistoryOpen(true)} className="relative bg-[#1C1C1E]/80 backdrop-blur-xl border border-[#3A3A3C] p-3 sm:p-4 rounded-full shadow-xl text-white hover:bg-[#2C2C2E]/80 transition-colors active:scale-95" aria-label="History">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF453A] text-white text-[11px] font-bold rounded-full px-1.5 min-w-[20px] h-[20px] flex items-center justify-center border-2 border-black tracking-tighter">{history.length}</span>
          )}
        </button>
        <button onClick={() => setIsHelpOpen(true)} className="bg-[#1C1C1E]/80 backdrop-blur-xl border border-[#3A3A3C] p-3 sm:p-4 rounded-full shadow-xl text-white hover:bg-[#2C2C2E]/80 transition-colors active:scale-95" aria-label="Help">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="bg-[#1C1C1E]/80 backdrop-blur-xl border border-[#3A3A3C] p-3 sm:p-4 rounded-full shadow-xl text-white hover:bg-[#2C2C2E]/80 transition-colors active:scale-95" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.74-1.71-.98l-.37-2.65C14.06 2.18 13.64 2 13.12 2h-2.24c-.52 0-.94.18-1.01.64l-.37 2.65c-.62.24-1.19.58-1.71.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.74 1.71.98l.37 2.65c.07.46.49.64 1.01.64h2.24c.52 0 .94-.18 1.01-.64l.37-2.65c.62-.24 1.19-.58 1.71-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c-.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" /></svg>
        </button>
      </div>

      <Settings 
        isSettingsOpen={isSettingsOpen} 
        setIsSettingsOpen={setIsSettingsOpen} 
        roundUpEnabled={roundUpEnabled} 
        setRoundUpEnabled={setRoundUpEnabled} 
        baseFontSize={baseFontSize}
        setBaseFontSize={setBaseFontSize}
        showSharedItems={showSharedItems}
        setShowSharedItems={setShowSharedItems}
        showRefunds={showRefunds}
        setShowRefunds={setShowRefunds}
        showShortSummary={showShortSummary}
        setShowShortSummary={setShowShortSummary}
        showFinalSummary={showFinalSummary}
        setShowFinalSummary={setShowFinalSummary}
      />
      <HelpGuide isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={clearHistory}
        onDelete={deleteHistoryEntry}
      />

      <div className="w-full max-w-full md:max-w-2xl lg:max-w-4xl mx-auto pb-24">
        {/* iOS Large Title Header */}
        <div className="px-4 pt-12 pb-4 flex items-end justify-between">
          <h1 className="text-[34px] font-bold text-white tracking-tight leading-none">
            แบ่งบิล
          </h1>
          {/* Reset / Clear history */}
          {showResetConfirm ? (
            <div className="flex items-center gap-2 bg-red-900/50 border border-red-700 px-3 py-2 rounded-xl text-sm">
              <span className="text-red-300">ล้างข้อมูลทั้งหมด?</span>
              <button onClick={resetAll} className="text-white bg-red-600 px-2 py-1 rounded-lg hover:bg-red-500 text-xs">ยืนยัน</button>
              <button onClick={() => setShowResetConfirm(false)} className="text-gray-400 hover:text-white text-xs">ยกเลิก</button>
            </div>
          ) : (
            <button onClick={() => setShowResetConfirm(true)} className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              ล้างข้อมูล
            </button>
          )}
        </div>

        {/* Cookie save indicator */}
        <p className="text-xs text-gray-600 mb-4 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          บันทึกอัตโนมัติ (30 วัน)
        </p>

        {/* Session Tabs */}
        <SessionManager
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          addSession={addSession}
          removeSession={removeSession}
        />

        {/* Session Name Edit + Save History */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <input
            type="text"
            className="bg-transparent border-b border-gray-600 focus:border-blue-500 focus:outline-none text-white text-xl font-bold pb-1 max-w-xs flex-1"
            value={activeSession.name}
            onChange={(e) => setSessions((prev) => updateSession(prev, activeSessionId, () => ({ name: e.target.value })))}
            placeholder="ชื่อ Session"
          />
          <button
            onClick={saveToHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-md active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            บันทึกประวัติ
          </button>
        </div>

        <PersonalOrders
          people={activeSession.people}
          addItemToPerson={addItemToPerson}
          removeItemFromPerson={removeItemFromPerson}
        />

        <div className={`grid grid-cols-1 ${showSharedItems ? 'lg:grid-cols-2' : ''} gap-8 mt-4`}>
          {showSharedItems && (
            <SharedItems
              people={activeSession.people}
              addSharedItem={addSharedItem}
              sharedItems={activeSession.sharedItems}
              removeSharedItem={removeSharedItem}
            />
          )}
          <Costs
            shippingCost={activeSession.shippingCost}
            setShippingCost={setShippingCost}
            discount={activeSession.discount}
            setDiscount={setDiscount}
            serviceChargeEnabled={activeSession.serviceChargeEnabled}
            setServiceChargeEnabled={setServiceChargeEnabled}
            serviceChargePercentage={activeSession.serviceChargePercentage}
            setServiceChargePercentage={setServiceChargePercentage}
            vatEnabled={activeSession.vatEnabled}
            setVatEnabled={setVatEnabled}
            people={activeSession.people}
            treatedPeopleIds={activeSession.treatedPeopleIds}
            setTreatedPeopleIds={setTreatedPeopleIds}
            treatSharingMode={activeSession.treatSharingMode}
            setTreatSharingMode={setTreatSharingMode}
          />
        </div>

        {/* Refunds / Wrong Orders */}
        {showRefunds && (
          <div className="mt-4">
            <Refunds
              refunds={activeSession.refunds || []}
              people={activeSession.people}
              onAdd={addRefund}
              onRemove={removeRefund}
            />
          </div>
        )}

        {showShortSummary && (
          <ShortSummaryCard
            people={activeSession.people}
            calculatedResults={calculatedResults}
            handleDownloadImage={handleDownloadImage}
            summaryCardRef={summaryCardRef}
          />
        )}

        {showFinalSummary && (
          <>
            <Summary
              people={activeSession.people}
              calculatedResults={calculatedResults}
              serviceChargeEnabled={activeSession.serviceChargeEnabled}
              serviceChargePercentage={activeSession.serviceChargePercentage}
              vatEnabled={activeSession.vatEnabled}
            />

            {/* Multi-Session merged summary */}
            {sessions.length > 1 && (
              <MultiSessionSummary sessionResults={allSessionResults} />
            )}
          </>
        )}

        <People
          people={activeSession.people}
          addPerson={addPerson}
          removePerson={removePerson}
          suggestionNames={
            sessions
              .filter((s) => s.id !== activeSessionId)
              .flatMap((s) => s.people.map((p) => p.name))
          }
        />
      </div>
    </div>
  );
}

export default App;
