
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Wheel, { WheelHandle } from './components/Wheel';
import ResultModal from './components/ResultModal';
import SpinHistory from './components/SpinHistory';
import LandingGate from './components/LandingGate';
import ConfirmModal from './components/ConfirmModal';
import { Prize, SpinResult, SpinMode, UserProfile } from './types';
import { REGULER_PRIZES, EXCLUSIVE_PRIZES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('spin_user_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  
  // Localized state for current session
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [currentHistory, setCurrentHistory] = useState<SpinResult[]>([]);

  const [confirmState, setConfirmState] = useState<{ type: 'change-menu' } | null>(null);

  const wheelRef = useRef<WheelHandle>(null);

  const mode: SpinMode = user?.selectedMode || 'REGULER';
  const activePrizes = useMemo(() => mode === 'EXCLUSIVE' ? EXCLUSIVE_PRIZES : REGULER_PRIZES, [mode]);

  // Storage Key Helper
  const getKeys = useCallback(() => {
    if (!user) return { countKey: '', historyKey: '' };
    const dateStr = new Date().toISOString().split('T')[0];
    const prefix = `spin_v3_${dateStr}_${user.name}_${mode}`;
    return {
      countKey: `${prefix}_count`,
      historyKey: `${prefix}_history`
    };
  }, [user, mode]);

  // Load data whenever user or mode changes
  useEffect(() => {
    if (!user) return;
    const { countKey, historyKey } = getKeys();
    
    const savedCount = localStorage.getItem(countKey);
    const savedHistory = localStorage.getItem(historyKey);
    
    setCurrentCount(savedCount ? parseInt(savedCount, 10) : 0);
    setCurrentHistory(savedHistory ? JSON.parse(savedHistory) : []);
    
    localStorage.setItem('spin_user_session', JSON.stringify(user));
  }, [user, mode, getKeys]);

  const handleEnter = (selectedUser: UserProfile) => {
    setUser(selectedUser);
  };

  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    wheelRef.current?.spin();
  };

  const onFinished = (prize: Prize) => {
    const { countKey, historyKey } = getKeys();
    const nextCounter = currentCount + 1;
    
    const newResult: SpinResult = {
      id: Math.random().toString(36).substr(2, 9),
      prize: prize.label,
      timestamp: Date.now(),
      mode: mode,
      userName: user?.name || 'Unknown',
      spinNumber: nextCounter
    };

    // Update state
    setCurrentCount(nextCounter);
    const updatedHistory = [newResult, ...currentHistory].slice(0, 5);
    setCurrentHistory(updatedHistory);

    // Persist to namespaced storage
    localStorage.setItem(countKey, nextCounter.toString());
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

    setCurrentResult(newResult);
    setIsSpinning(false);
    setShowResult(true);
  };

  if (!user) {
    return <LandingGate onEnter={handleEnter} />;
  }

  return (
    <div className={`min-h-screen relative flex flex-col items-center transition-colors duration-1000 ${mode === 'EXCLUSIVE' ? 'bg-[#1a0b2e]' : 'bg-[#0F0C29]'}`}>
      {/* Background Glow Decorations */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${mode === 'EXCLUSIVE' ? 'opacity-40' : 'opacity-20'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[150px]"></div>
      </div>

      <header className="sticky top-0 w-full z-50 glass-effect border-b border-white/10 px-6 py-4 sm:px-12 sm:py-5 flex flex-wrap justify-between items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">IDENTITY</span>
            <span className="text-white font-black text-lg tracking-widest drop-shadow-md">{user.name}</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">SESSION MODE</span>
            <span className={`font-black text-lg tracking-widest ${mode === 'EXCLUSIVE' ? 'text-purple-400' : 'text-yellow-500'}`}>
              {mode}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setConfirmState({ type: 'change-menu' })}
          className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-bold uppercase px-6 py-3 rounded-xl transition-all border border-white/10 tracking-[0.2em]"
        >
          KEMBALI KE MENU
        </button>
      </header>

      <main className="relative z-10 flex flex-col items-center w-full px-4 pt-10 sm:pt-20 pb-20">
        <div className="text-center mb-12">
          <h1 className={`text-5xl sm:text-8xl font-black mb-3 drop-shadow-2xl transition-all duration-700 ${mode === 'EXCLUSIVE' ? 'text-white scale-105 tracking-tighter' : 'shimmer-text tracking-normal'}`}>
            {mode === 'EXCLUSIVE' ? 'EXCLUSIVE FORTUNE' : 'PLATINUM SPIN'}
          </h1>
          <p className="luxury-text text-white/30 text-[10px] sm:text-xs uppercase tracking-[0.5em] font-medium">Ultimate Luxury Collection</p>
        </div>

        <div className="relative mb-14 group">
          <Wheel ref={wheelRef} onFinished={onFinished} spinning={isSpinning} mode={mode} prizes={activePrizes} />
        </div>

        <div className="flex flex-col items-center gap-10 w-full max-w-3xl">
           <button
            onClick={handleSpinClick}
            disabled={isSpinning}
            className={`
              relative group px-16 py-7 sm:px-36 sm:py-9 rounded-[3rem] font-black text-2xl sm:text-4xl tracking-[0.2em] uppercase transition-all duration-500 transform
              ${isSpinning 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed scale-95 opacity-80 shadow-none' 
                : (mode === 'EXCLUSIVE' 
                    ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-800 text-white hover:scale-105 active:scale-90 hover:shadow-[0_0_80px_rgba(168,85,247,0.7)] border-t-2 border-white/30'
                    : 'bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 text-black hover:scale-105 active:scale-90 hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] border-t-2 border-white/50'
                  )
              }
            `}
          >
            <span className="relative z-10">{isSpinning ? 'Sedang memutar...' : 'SPIN NOW'}</span>
            {!isSpinning && <div className="absolute inset-0 rounded-[3rem] bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>}
          </button>

          <div className="w-full max-w-sm glass-effect rounded-[2rem] p-6 text-center border border-white/10 shadow-2xl">
              <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">TOTAL SPIN HARI INI ({mode})</div>
              <div className="text-4xl font-black text-white drop-shadow-md">{currentCount}</div>
          </div>
        </div>

        <div className="w-full max-w-lg mt-16">
          <SpinHistory history={currentHistory} />
        </div>
      </main>

      {showResult && (
        <ResultModal 
          result={currentResult} 
          onClose={() => setShowResult(false)} 
          onSpinAgain={() => {
            setShowResult(false);
            setTimeout(handleSpinClick, 400);
          }} 
        />
      )}

      {confirmState?.type === 'change-menu' && (
        <ConfirmModal 
          title="KEMBALI KE MENU"
          message="Anda akan keluar dari sesi spin saat ini dan kembali ke layar pemilihan Nama & Mode."
          onConfirm={() => {
            setUser(null);
            setConfirmState(null);
          }}
          onCancel={() => setConfirmState(null)}
          confirmText="YA, KELUAR"
        />
      )}

      <footer className="mt-auto py-12 text-white/5 text-[9px] tracking-[0.6em] uppercase font-bold text-center">
        Platinum Edition Suite • Reset Otomatis Per Hari
      </footer>
    </div>
  );
};

export default App;
