import React, { useEffect, useState } from 'react';
import { SpinResult } from '../types';

interface ResultModalProps {
  result: SpinResult | null;
  onClose: () => void;
  onSpinAgain: () => void;
}

const Confetti = ({ intensified = false }) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const count = intensified ? 180 : 100;
    const colors = intensified 
      ? ['#E0A7FF', '#FFFFFF', '#7000FF', '#FF00FF', '#7000FF']
      : ['#D4AF37', '#FFF7AD', '#B8860B', '#FFFFFF', '#FFD700'];
    
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: (intensified ? 6 : 5) + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: intensified ? (2 + Math.random() * 2) : (3 + Math.random() * 3),
      angle: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, [intensified]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.angle}deg)`,
            animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
            boxShadow: intensified ? `0 0 15px ${p.color}` : `0 0 10px ${p.color}`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose, onSpinAgain }) => {
  if (!result) return null;
  const isExclusive = result.mode === 'EXCLUSIVE';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500"></div>
      
      <Confetti intensified={isExclusive} />

      <div className={`
        relative w-full max-w-xl glass-effect gold-border rounded-[3rem] p-8 sm:p-14 text-center animate-reveal
        ${isExclusive ? 'shadow-[0_0_150px_rgba(224,167,255,0.5)] border-purple-500/50' : 'shadow-[0_0_100px_rgba(212,175,55,0.4)]'}
      `}>
        <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 sweep-overlay opacity-30"></div>
        </div>

        <h3 className={`luxury-text text-xl sm:text-2xl font-bold mb-2 tracking-widest uppercase ${isExclusive ? 'text-purple-400' : 'text-yellow-500'}`}>
          SELAMAT, {result.userName.toUpperCase()}!
        </h3>
        
        <h2 className={`text-2xl sm:text-4xl font-semibold mb-6 tracking-normal leading-tight drop-shadow-xl ${isExclusive ? 'text-white/90' : 'shimmer-text opacity-90'}`}>
          KAMU MENDAPATKAN:
        </h2>

        <div className={`bg-gradient-to-br border rounded-3xl py-10 mb-10 transform scale-110 shadow-2xl relative overflow-hidden ${isExclusive ? 'from-purple-900/40 to-indigo-900/60 border-purple-400/50' : 'from-yellow-400/20 to-yellow-900/40 border-yellow-500/50'}`}>
          <span className="luxury-text text-4xl sm:text-6xl font-bold text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] relative z-10">
            {result.prize}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10 text-white/60 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
          <div className="glass-effect p-4 rounded-xl border border-white/5">
            <div className="text-white/40 mb-1">MODE</div>
            <div className={`font-bold ${isExclusive ? 'text-purple-400' : 'text-yellow-500'}`}>{result.mode}</div>
          </div>
          <div className="glass-effect p-4 rounded-xl border border-white/5">
            <div className="text-white/40 mb-1">SPIN KE (HARI INI)</div>
            <div className="text-white">#{result.spinNumber}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSpinAgain}
            className={`
              group relative px-10 py-5 rounded-2xl font-black text-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl
              ${isExclusive ? 'bg-gradient-to-r from-purple-500 to-indigo-400 shadow-purple-500/30' : 'bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-yellow-500/30'}
            `}
          >
            <span className="relative z-10">Spin Lagi</span>
          </button>
          <button
            onClick={onClose}
            className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;