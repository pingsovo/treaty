
import React from 'react';

function SessionManager({ sessions, activeSessionId, setActiveSessionId, addSession, removeSession }) {
  return (
    <div className="mb-6 px-4">
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {/* Track matching iOS Segmented Control Background */}
        <div className="flex p-1 bg-[#1C1C1E] rounded-xl">
          {sessions.map((session) => {
            const isActive = activeSessionId === session.id;
            return (
              <div key={session.id} className="relative flex-shrink-0 group">
                <button
                  onClick={() => setActiveSessionId(session.id)}
                  className={`relative z-10 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2C2C2E] text-white shadow-sm'
                      : 'text-[#8E8E93] hover:text-gray-300'
                  }`}
                >
                  {session.name}
                </button>
                {sessions.length > 1 && isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSession(session.id); }}
                    className="absolute -top-1 -right-1 z-20 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm active:scale-90"
                    title="ลบ Session"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Session Button */}
        <button
          onClick={addSession}
          className="ml-2 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1E] text-blue-500 hover:bg-[#2C2C2E] transition-all"
          title="เพิ่ม Session"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
}

export default SessionManager;
