
import React, { useState } from 'react';
import { NAMES_LIST, COLORS } from '../constants';
import { UserProfile, SpinMode } from '../types';

interface LandingGateProps {
  onEnter: (user: UserProfile) => void;
}

const LandingGate: React.FC<LandingGateProps> = ({ onEnter }) => {
  const [selectedName, setSelectedName] = useState<string>('');
  const [mode, setMode] = useState<SpinMode>('REGULER');

  const handleEnter = () => {
    if (!selectedName) return;
    const nameProfile = NAMES_LIST.find(n => n.displayName === selectedName);
    if (nameProfile) {
      onEnter({
        ...nameProfile,
        selectedMode: mode
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 overflow-y-auto">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 bg-[#0F0C29] animate-in fade-in duration-1000">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#302B63_0%,transparent_50%)]"></div>
         </div>
      </div>

      {/* NEW HEADLINE ABOVE THE CARD */}
      <div className="relative mb-8 sm:mb-12 text-center animate-in slide-in-from-top-10 duration-1000 delay-200">
        <h2 className="luxury-text text-3xl sm:text-7xl font-black uppercase tracking-tight leading-[1.1] shimmer-text drop-shadow-[0_0_35px_rgba(212,175,55,0.4)]">
          TEAM 06 PALING SPANNN,<br />
          SENO LEH KOMAN
        </h2>
      </div>

      {/* Main Welcome Card */}
      <div className="relative w-full max-w-md glass-effect gold-border rounded-[2.5rem] p-10 sm:p-14 text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in duration-700">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black shimmer-text mb-4 drop-shadow-lg">WELCOME</h1>
          <p className="luxury-text text-white/60 uppercase tracking-[0.2em] text-[10px] font-bold">TEAM 06 GACORRR</p>
        </div>

        <div className="space-y-6">
          {/* Name Selection */}
          <div className="text-left">
            <label className="block luxury-text text-yellow-500/80 text-[10px] uppercase tracking-widest font-bold mb-3 ml-2">
              SELECT IDENTITY
            </label>
            <div className="relative">
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white appearance-none cursor-pointer focus:border-yellow-500/50 outline-none transition-all hover:bg-black/60 font-semibold"
              >
                <option value="" disabled className="bg-[#0F0C29]">-- Choose Name --</option>
                {NAMES_LIST.map((user, idx) => (
                  <option key={idx} value={user.displayName} className="bg-[#0F0C29]">
                    {user.displayName}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="text-left">
            <label className="block luxury-text text-yellow-500/80 text-[10px] uppercase tracking-widest font-bold mb-3 ml-2">
              SELECT MODE
            </label>
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
              {(['REGULER', 'EXCLUSIVE'] as SpinMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`
                    flex-1 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase
                    ${mode === m 
                      ? (m === 'EXCLUSIVE' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg') 
                      : 'text-white/40 hover:text-white/70'
                    }
                  `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleEnter}
            disabled={!selectedName}
            className={`
              w-full py-5 rounded-2xl font-black text-lg tracking-[0.2em] uppercase transition-all duration-300 transform mt-4
              ${selectedName 
                ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.3)]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
              }
            `}
          >
            ENTER FORTUNE
          </button>
        </div>

        <div className="mt-10 text-white/20 text-[8px] uppercase tracking-[0.4em]">
          Platinum Member Restricted Area
        </div>
      </div>
    </div>
  );
};

export default LandingGate;
